import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:18443";
const token = process.env.TOKEN || "hydradb-investigation-token-32-bytes";
const outputDir =
  process.env.OUT || "investigation/results/scale";
const levels = [100, 500, 2000];
const chunkSize = 250;
const targetId = 29_100_000;
const middleBase = 29_101_000;
const leafBase = 29_200_000;
const relationshipBase = 39_000_000;
let lastBookmark = null;

await mkdir(outputDir, { recursive: true });

async function query(
  name,
  cypher,
  parameters = {},
  persist = false,
  extraBody = {},
) {
  const started = performance.now();
  const response = await fetch(baseUrl + "/v1/graphs/default/query", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "X-Graph-Namespace": "local",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cell_id: "cell-0",
      query_id: name,
      query: cypher,
      parameters,
      ...(lastBookmark ? { bookmark: lastBookmark } : {}),
      ...extraBody,
    }),
    signal: AbortSignal.timeout(60_000),
  });
  const body = await response.json();
  const result = {
    name,
    status: response.status,
    duration_ms: Number((performance.now() - started).toFixed(3)),
    row_count: Array.isArray(body.rows) ? body.rows.length : null,
    read_epoch: body.read_epoch ?? null,
    response: body,
  };
  if (persist) {
    await writeFile(
      outputDir + "/" + name + ".json",
      JSON.stringify(result, null, 2) + "\n",
    );
  }
  if (!response.ok) {
    throw new Error(name + " failed: " + JSON.stringify(body));
  }
  if (body.bookmark) {
    lastBookmark = body.bookmark;
  }
  return result;
}

async function batches(name, rows, cypher) {
  const results = [];
  for (let offset = 0; offset < rows.length; offset += chunkSize) {
    results.push(
      await query(
        name + "_" + String(offset / chunkSize + 1).padStart(3, "0"),
        cypher,
        { rows: rows.slice(offset, offset + chunkSize) },
      ),
    );
  }
  return results;
}

function percentile(values, fraction) {
  const ordered = [...values].sort((a, b) => a - b);
  return ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * fraction))];
}

async function measure(name, cypher, parameters = {}, extraBody = {}) {
  const samples = [];
  for (let iteration = 0; iteration < 6; iteration += 1) {
    samples.push(
      await query(
        name + "_" + iteration,
        cypher,
        parameters,
        false,
        extraBody,
      ),
    );
  }
  const warm = samples.slice(1).map((sample) => sample.duration_ms);
  return {
    name,
    cold_ms: samples[0].duration_ms,
    warm_ms: warm,
    warm_p50_ms: percentile(warm, 0.5),
    warm_p95_ms: percentile(warm, 0.95),
    response: samples.at(-1).response,
  };
}

const setupRows = [
  { vertex: targetId, name: "perf-vulnerable", kind: "target" },
  ...Array.from({ length: 100 }, (_, index) => ({
    vertex: middleBase + index,
    name: "perf-middle-" + index,
    kind: "middle",
  })),
];
const vertexCypher =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) " +
  "SET n:PerfNode, n.name = row.name, n.kind = row.kind";
const edgeCypher =
  "UNWIND $rows AS row MATCH (s:PerfNode {id: row.source}), (d:PerfNode {id: row.destination}) " +
  "MERGE (s)-[r:PERF_DEPENDS {id: row.relationship_vertex}]->(d) " +
  "SET r.source = row.source_name";

const report = {
  environment: { levels, chunk_size: chunkSize },
  setup: {},
  levels: [],
};

let started = performance.now();
const setupVertices = await batches("setup_vertices", setupRows, vertexCypher);
const middleEdges = Array.from({ length: 100 }, (_, index) => ({
  source: middleBase + index,
  destination: targetId,
  relationship_vertex: relationshipBase + index,
  source_name: "generated",
}));
const setupEdges = await batches("setup_edges", middleEdges, edgeCypher);
report.setup = {
  duration_ms: Number((performance.now() - started).toFixed(3)),
  requests: setupVertices.length + setupEdges.length,
  vertices: setupRows.length,
  edges: middleEdges.length,
};

let createdLeaves = 0;
for (const level of levels) {
  const newLeaves = Array.from(
    { length: level - createdLeaves },
    (_, offset) => createdLeaves + offset,
  );
  const leafRows = newLeaves.map((index) => ({
    vertex: leafBase + index,
    name: "perf-app-" + index,
    kind: "application",
  }));
  const leafEdges = newLeaves.map((index) => ({
    source: leafBase + index,
    destination: middleBase + (index % 100),
    relationship_vertex: relationshipBase + 1_000 + index,
    source_name: "lockfile",
  }));
  started = performance.now();
  const vertexWrites = await batches("vertices_" + level, leafRows, vertexCypher);
  const edgeWrites = await batches("edges_" + level, leafEdges, edgeCypher);
  const ingestionMs = performance.now() - started;
  createdLeaves = level;

  const measurements = [];
  measurements.push(
    await measure(
      "id_lookup_" + level,
      "MATCH (n:PerfNode {id: $id}) RETURN n.name AS name",
      { id: leafBase + level - 1 },
    ),
  );
  measurements.push(
    await measure(
      "property_lookup_" + level,
      "MATCH (n:PerfNode {name: $name}) RETURN n.id AS id",
      { name: "perf-app-" + (level - 1) },
    ),
  );
  measurements.push(
    await measure(
      "reverse_one_hop_" + level,
      "MATCH (target {id: $target})<-[:PERF_DEPENDS]-(n) RETURN count(*) AS total",
      { target: targetId },
    ),
  );
  measurements.push(
    await measure(
      "reverse_two_hop_native_path_" + level,
      "CALL algo.SSpaths({sourceNode: $target, relTypes: ['PERF_DEPENDS'], " +
        "relDirection: 'incoming', maxLen: 2, pathCount: $limit, resultLimit: $limit}) " +
        "YIELD path RETURN path",
      { target: targetId, limit: level + 100 },
      { page_size: 1 },
    ),
  );
  measurements.push(
    await measure(
      "forward_two_hop_" + level,
      "MATCH (app {id: $app})-[:PERF_DEPENDS*1..2]->(n) RETURN count(*) AS total",
      { app: leafBase + level - 1 },
    ),
  );

  report.levels.push({
    leaves: level,
    total_vertices: level + 101,
    total_edges: level + 100,
    ingestion: {
      added_vertices: leafRows.length,
      added_edges: leafEdges.length,
      requests: vertexWrites.length + edgeWrites.length,
      duration_ms: Number(ingestionMs.toFixed(3)),
      rows_per_second: Number(
        (((leafRows.length + leafEdges.length) * 1000) / ingestionMs).toFixed(1),
      ),
    },
    measurements,
  });
  console.log(
    "level=" + level +
      " ingestion_ms=" + ingestionMs.toFixed(1) +
      " reverse_2hop_p50_ms=" +
      measurements.find((item) => item.name.startsWith("reverse_two_hop"))
        .warm_p50_ms,
  );
}

await writeFile(
  outputDir + "/summary.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log("results written to " + outputDir);
