import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

import { HydraDbClient, hydraDbConfigFromEnv } from "../src/hydradb/client.js";

const outputDirectory = process.env.PERF_OUTPUT ?? "docs/validation/performance-10k";
const vertexCount = Number(process.env.PERF_VERTICES ?? 10_000);
const batchSize = 250;
const affectedRoots = 20;
const targetVertex = 80_000_001;
const packageBase = 80_100_000;
const appBase = 81_000_000;
const edgeBase = 90_000_000;
const validStart = Date.parse("2021-10-01T00:00:00.000Z");
const validEnd = Date.parse("2021-10-23T00:00:00.000Z");

if (!Number.isSafeInteger(vertexCount) || vertexCount < 100) {
  throw new Error("PERF_VERTICES must be a safe integer of at least 100.");
}

const client = new HydraDbClient({
  ...hydraDbConfigFromEnv(),
  requestTimeoutMs: 120_000,
  queryPrefix: `blastradius-perf-${Date.now()}`,
});

const target = {
  vertex: targetVertex,
  entity_id: "pkg:npm/ua-parser-js@0.7.29",
  kind: "version",
  name: "ua-parser-js@0.7.29",
};
const remainingVertices = vertexCount - 1;
const applicationCount = Math.floor(remainingVertices / 2);
const packageCount = remainingVertices - applicationCount;
const packages = Array.from({ length: packageCount }, (_, index) => ({
  vertex: packageBase + index,
  entity_id: `pkg:npm/perf-package-${index}@1.0.0`,
  kind: "version",
  name: `perf-package-${index}@1.0.0`,
}));
const applications = Array.from({ length: applicationCount }, (_, index) => ({
  vertex: appBase + index,
  entity_id: `app:perf-${index}`,
  kind: "application",
  name: `Performance App ${index}`,
}));
const dependencyEdges = packages.map((packageNode, index) => ({
  relationship_vertex: edgeBase + index,
  edge_id: `perf-chain-${index}`,
  source: packageNode.vertex,
  target: index < affectedRoots ? targetVertex : packages[(index + 1) % packages.length].vertex,
  evidence: "Generated lockfile-shaped performance fixture",
  t_valid_start: validStart,
  t_valid_end: validEnd,
}));
const applicationEdges = applications.map((application, index) => ({
  relationship_vertex: edgeBase + packages.length + index,
  edge_id: `perf-app-${index}`,
  source: application.vertex,
  target: packages[index % packages.length].vertex,
  evidence: "Generated application lockfile-shaped performance fixture",
  t_valid_start: validStart,
  t_valid_end: validEnd,
}));

const nodeQuery =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.entity_id = row.entity_id, n.kind = row.kind, n.name = row.name";
const edgeQuery =
  "UNWIND $rows AS row MATCH (s:DependencyNode {id: row.source}), (t:DependencyNode {id: row.target}) MERGE (s)-[r:DEPENDS_ON {id: row.relationship_vertex}]->(t) SET r.edge_id = row.edge_id, r.evidence = row.evidence, r.t_valid_start = row.t_valid_start, r.t_valid_end = row.t_valid_end";
const pathQuery =
  "CALL algo.SSpaths({sourceNode: $target, relTypes: ['DEPENDS_ON'], relDirection: 'incoming', maxLen: 6, pathCount: 50, resultLimit: 100}) YIELD path RETURN path";

const ingestionStartedAt = performance.now();
let ingestionRequests = 0;
for (const rows of chunks([target, ...packages, ...applications], batchSize)) {
  await client.query(`ingest-nodes-${++ingestionRequests}`, nodeQuery, { rows });
}
for (const rows of chunks([...dependencyEdges, ...applicationEdges], batchSize)) {
  await client.query(`ingest-edges-${++ingestionRequests}`, edgeQuery, { rows });
}
const ingestionDurationMs = performance.now() - ingestionStartedAt;

const nodeCount = await count("count-nodes", "MATCH (n:DependencyNode) RETURN count(*) AS count");
const edgeCount = await count("count-edges", "MATCH ()-[:DEPENDS_ON]->() RETURN count(*) AS count");
const samples: Array<{ durationMs: number; returnedPaths: number }> = [];
for (let iteration = 0; iteration < 21; iteration += 1) {
  const result = await client.query(`incoming-sspaths-${iteration}`, pathQuery, { target: targetVertex });
  samples.push({ durationMs: result.durationMs, returnedPaths: result.response.rows.length });
}

const warm = samples.slice(1).map((sample) => sample.durationMs);
const result = {
  timestamp: new Date().toISOString(),
  graph: {
    vertices: nodeCount,
    dependencyEdges: edgeCount,
    generatedAffectedRoots: affectedRoots,
    maxLength: 6,
    pathCount: 50,
    resultLimit: 100,
  },
  ingestion: {
    batchSize,
    requests: ingestionRequests,
    durationMs: round(ingestionDurationMs),
    rowsPerSecond: round(((nodeCount + edgeCount) * 1_000) / ingestionDurationMs),
  },
  query: {
    samples: samples.map((sample) => ({ durationMs: round(sample.durationMs), returnedPaths: sample.returnedPaths })),
    coldMs: round(samples[0].durationMs),
    warmP50Ms: round(percentile(warm, 0.5)),
    warmP95Ms: round(percentile(warm, 0.95)),
    warmMinMs: round(Math.min(...warm)),
    warmMaxMs: round(Math.max(...warm)),
  },
  limitations: [
    "Generated local single-node fixture, not an npm ecosystem crawl.",
    "Returned paths are explicitly capped at the product query contract limits.",
    "This measures client-observed HTTP duration, not server-only execution time.",
  ],
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(`${outputDirectory}/result.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));

if (nodeCount !== vertexCount || edgeCount !== dependencyEdges.length + applicationEdges.length) {
  throw new Error("Performance fixture count verification failed.");
}

async function count(operation: string, query: string): Promise<number> {
  const response = await client.query(operation, query);
  const value = response.response.rows[0]?.[0];
  if (value?.type !== "integer") throw new Error(`${operation} did not return an integer.`);
  return value.value;
}

function chunks<T>(values: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let offset = 0; offset < values.length; offset += size) {
    result.push(values.slice(offset, offset + size));
  }
  return result;
}

function percentile(values: number[], fraction: number): number {
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * fraction))];
}

function round(value: number): number {
  return Number(value.toFixed(3));
}
