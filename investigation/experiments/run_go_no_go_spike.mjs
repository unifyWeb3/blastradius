import { mkdir, writeFile } from "node:fs/promises";

const mode = process.env.MODE || "local";
const outputDir = process.env.OUT || "investigation/results/go-no-go";
await mkdir(outputDir, { recursive: true });

const fixture = {
  applications: [
    { vertex: 1001, kind: "application", dep_id: "app:a", name: "App A" },
    { vertex: 1004, kind: "application", dep_id: "app:b", name: "App B" },
  ],
  packages: [
    { vertex: 1002, kind: "package_version", dep_id: "pkg:x@1.2.3", name: "Package X", version: "1.2.3", compromised: false },
    { vertex: 1005, kind: "package_version", dep_id: "pkg:q@2.3.4", name: "Package Q", version: "2.3.4", compromised: false },
    { vertex: 1003, kind: "package_version", dep_id: "pkg:y@4.5.6", name: "Package Y", version: "4.5.6", compromised: true },
    { vertex: 1006, kind: "package_version", dep_id: "pkg:z@7.8.9", name: "Package Z", version: "7.8.9", compromised: false },
  ],
  statuses: [
    { vertex: 1007, kind: "security_status", dep_id: "status:compromised", name: "Compromised" },
  ],
  edges: [
    { relationship_vertex: 1101, edge_key: "app-a-x", source: 1001, target: 1002, t_valid_start: 20260801, t_valid_end: 20260820 },
    { relationship_vertex: 1102, edge_key: "x-y", source: 1002, target: 1003, t_valid_start: 20260802, t_valid_end: 20260820 },
    { relationship_vertex: 1103, edge_key: "app-b-q", source: 1004, target: 1005, t_valid_start: 20260803, t_valid_end: 20260820 },
    { relationship_vertex: 1104, edge_key: "q-y", source: 1005, target: 1003, t_valid_start: 20260804, t_valid_end: 20260820 },
    { relationship_vertex: 1105, edge_key: "y-z", source: 1003, target: 1006, t_valid_start: 20260805, t_valid_end: 20260820 },
  ],
  security_edges: [
    { relationship_vertex: 1201, edge_key: "y-compromised", source: 1003, target: 1007, t_valid_start: 20260806, t_valid_end: 20260812 },
  ],
};

await writeFile(outputDir + "/fixture.json", JSON.stringify(fixture, null, 2) + "\n");
await writeFile(
  outputDir + "/exact-graph-payload.json",
  JSON.stringify(hostedPayload("hack-hydra-go-no-go-01"), null, 2) + "\n",
);

if (mode === "hosted") {
  await hostedProbe();
} else if (mode === "local") {
  await localProbe();
} else {
  throw new Error(`Unsupported MODE=${mode}; use local or hosted`);
}

async function hostedProbe() {
  const key = process.env.HYDRADB_API_KEY || process.env.HYDRA_DB_API_KEY;
  const database = process.env.HYDRADB_DATABASE || process.env.HYDRA_DB_DATABASE;
  const base = process.env.HYDRADB_BASE_URL || "https://api.hydradb.com";
  const sourceId = process.env.HYDRADB_SOURCE_ID || "hack-hydra-go-no-go-01";
  if (!key || !database) {
    const result = {
      status: "blocked",
      reason: "HYDRADB_API_KEY/HYDRA_DB_API_KEY and HYDRADB_DATABASE/HYDRA_DB_DATABASE are required",
      base,
      source_id: sourceId,
      payload: hostedPayload(sourceId),
    };
    await writeFile(outputDir + "/hosted-blocked.json", JSON.stringify(result, null, 2) + "\n");
    console.error(result.reason);
    process.exitCode = 2;
    return;
  }

  const firstIngest = await ingestHosted("first");
  await waitUntilComplete("first");
  const firstRelations = await readHostedRelations("first");
  const graphContext = await queryHostedContext();

  const secondIngest = await ingestHosted("second");
  await waitUntilComplete("second");
  const secondRelations = await readHostedRelations("second");
  await save("hosted-idempotency-compare", {
    identical_relation_payload_after_second_ingest:
      JSON.stringify(firstRelations.body?.data?.relations) === JSON.stringify(secondRelations.body?.data?.relations),
    first: firstRelations.body?.data?.relations,
    second: secondRelations.body?.data?.relations,
  });
  console.log(
    `hosted first=${firstIngest.status} second=${secondIngest.status} relations=${secondRelations.status} query=${graphContext.status}`,
  );

  async function ingestHosted(label) {
    const form = new FormData();
    form.set("type", "knowledge");
    form.set("database", database);
    form.set("upsert", "true");
    form.set("app_knowledge", JSON.stringify([
      {
        id: sourceId,
        kind: "dependency-fixture",
        provider: "hack-hydra",
        external_id: sourceId,
        fields: { body: "App A and App B transitively depend on compromised Package Y 4.5.6." },
      },
    ]));
    form.set("graph_payload", JSON.stringify(hostedPayload(sourceId)));
    const response = await fetch(base + "/context/ingest", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "API-Version": "2" },
      body: form,
      signal: AbortSignal.timeout(30_000),
    });
    const record = { status: response.status, body: await parseBody(response) };
    await save(`hosted-ingest-${label}`, record);
    if (!response.ok) throw new Error(`hosted ${label} ingest failed: ${JSON.stringify(record)}`);
    return record;
  }

  async function waitUntilComplete(label) {
    const statusUrl = new URL(base + "/context/status");
    statusUrl.searchParams.set("database", database);
    statusUrl.searchParams.set("ids", sourceId);
    for (let attempt = 1; attempt <= 60; attempt++) {
      const response = await fetch(statusUrl, {
        headers: { Authorization: `Bearer ${key}`, "API-Version": "2" },
        signal: AbortSignal.timeout(30_000),
      });
      const body = await parseBody(response);
      await save(`hosted-status-${label}-${String(attempt).padStart(2, "0")}`, { status: response.status, body });
      if (!response.ok) throw new Error(`hosted status failed: ${JSON.stringify(body)}`);
      const state = body?.data?.statuses?.[0]?.indexing_status;
      if (state === "completed") return body;
      if (state === "errored") throw new Error(`hosted ingest errored: ${JSON.stringify(body)}`);
      await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
    throw new Error("hosted ingest did not reach completed within 120 seconds");
  }

  async function readHostedRelations(label) {
    const relationsUrl = new URL(base + "/context/relations");
    relationsUrl.searchParams.set("database", database);
    relationsUrl.searchParams.set("id", sourceId);
    relationsUrl.searchParams.set("limit", "100");
    const response = await fetch(relationsUrl, {
      headers: { Authorization: `Bearer ${key}`, "API-Version": "2" },
      signal: AbortSignal.timeout(30_000),
    });
    const record = { status: response.status, body: await parseBody(response) };
    await save(`hosted-relations-${label}`, record);
    if (!response.ok) throw new Error(`hosted relations failed: ${JSON.stringify(record)}`);
    return record;
  }

  async function queryHostedContext() {
    const response = await fetch(base + "/query", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "API-Version": "2",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        database,
        query: "Which applications depend on Package Y@4.5.6 and through what dependency paths?",
        type: "knowledge",
        query_by: "hybrid",
        mode: "thinking",
        graph_context: true,
      }),
      signal: AbortSignal.timeout(60_000),
    });
    const record = { status: response.status, body: await parseBody(response) };
    await save("hosted-query-graph-context", record);
    return record;
  }
}

function hostedPayload(sourceId) {
  return {
    [sourceId]: {
      entities: {
        app_a: { name: "App A", type: "APPLICATION", namespace: "supply-chain", identifier: "app:a" },
        app_b: { name: "App B", type: "APPLICATION", namespace: "supply-chain", identifier: "app:b" },
        x: { name: "Package X@1.2.3", type: "PACKAGE_VERSION", namespace: "npm", identifier: "pkg:x@1.2.3" },
        q: { name: "Package Q@2.3.4", type: "PACKAGE_VERSION", namespace: "npm", identifier: "pkg:q@2.3.4" },
        y: { name: "Package Y@4.5.6", type: "PACKAGE_VERSION", namespace: "npm", identifier: "pkg:y@4.5.6" },
        z: { name: "Package Z@7.8.9", type: "PACKAGE_VERSION", namespace: "npm", identifier: "pkg:z@7.8.9" },
        compromised: { name: "Compromised", type: "SECURITY_STATUS", namespace: "supply-chain", identifier: "status:compromised" },
      },
      relations: [
        { source: "app_a", target: "x", predicate: "DEPENDS_ON", context: "App A depends on Package X@1.2.3", temporal_details: "2026-08-01/2026-08-20" },
        { source: "x", target: "y", predicate: "DEPENDS_ON", context: "Package X@1.2.3 depends on Package Y@4.5.6", temporal_details: "2026-08-02/2026-08-20" },
        { source: "app_b", target: "q", predicate: "DEPENDS_ON", context: "App B depends on Package Q@2.3.4", temporal_details: "2026-08-03/2026-08-20" },
        { source: "q", target: "y", predicate: "DEPENDS_ON", context: "Package Q@2.3.4 depends on Package Y@4.5.6", temporal_details: "2026-08-04/2026-08-20" },
        { source: "y", target: "z", predicate: "DEPENDS_ON", context: "Package Y@4.5.6 depends on Package Z@7.8.9", temporal_details: "2026-08-05/2026-08-20" },
        { source: "y", target: "compromised", predicate: "HAS_SECURITY_STATUS", context: "Package Y@4.5.6 was compromised.", temporal_details: "2026-08-06/2026-08-12" },
      ],
    },
  };
}

async function localProbe() {
  const base = process.env.BASE_URL || "http://127.0.0.1:18447";
  const token = process.env.TOKEN || "hydradb-go-no-go-investigation-token-32";
  const namespace = process.env.NAMESPACE || "local";
  const graphId = process.env.GRAPH_ID || "default";
  const cellId = process.env.CELL_ID || "cell-0";
  let sequence = 0;

  async function query(name, cypher, parameters = {}) {
    const request = { cell_id: cellId, query_id: `go-no-go-${++sequence}-${name}`, query: cypher, parameters };
    const response = await fetch(`${base}/v1/graphs/${graphId}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Graph-Namespace": namespace,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(60_000),
    });
    const body = await parseBody(response);
    const record = { name, request, http_status: response.status, response: body };
    await save(name, record);
    if (!response.ok) throw new Error(`${name} failed with HTTP ${response.status}: ${JSON.stringify(body)}`);
    return body;
  }

  const nodeQueries = [
    ["insert-applications", "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.kind = row.kind, n.dep_id = row.dep_id, n.name = row.name", fixture.applications],
    ["insert-package-versions", "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.kind = row.kind, n.dep_id = row.dep_id, n.name = row.name, n.version = row.version, n.compromised = row.compromised", fixture.packages],
    ["insert-security-status", "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.kind = row.kind, n.dep_id = row.dep_id, n.name = row.name", fixture.statuses],
  ];
  const edgeQuery = "UNWIND $rows AS row MATCH (s:DependencyNode {id: row.source}), (t:DependencyNode {id: row.target}) MERGE (s)-[r:DEPENDS_ON {id: row.relationship_vertex}]->(t) SET r.edge_key = row.edge_key, r.t_valid_start = row.t_valid_start, r.t_valid_end = row.t_valid_end";
  const securityEdgeQuery = "UNWIND $rows AS row MATCH (s:DependencyNode {id: row.source}), (t:DependencyNode {id: row.target}) MERGE (s)-[r:COMPROMISED_DURING {id: row.relationship_vertex}]->(t) SET r.edge_key = row.edge_key, r.t_valid_start = row.t_valid_start, r.t_valid_end = row.t_valid_end";

  for (const [name, cypher, rows] of nodeQueries) await query(name + "-first", cypher, { rows });
  await query("insert-edges-first", edgeQuery, { rows: fixture.edges });
  await query("insert-security-edges-first", securityEdgeQuery, { rows: fixture.security_edges });
  const readbackFirst = await query("readback-first", "MATCH (s)-[r:DEPENDS_ON]->(t) RETURN s.dep_id AS source, t.dep_id AS target, r.edge_key AS edge_key, r.t_valid_start AS t_valid_start, r.t_valid_end AS t_valid_end ORDER BY edge_key");
  await query("version-readback", "MATCH (v:DependencyNode {dep_id: 'pkg:y@4.5.6'}) RETURN v.kind AS kind, v.name AS name, v.version AS version, v.compromised AS compromised");
  await query("predicate-readback", "MATCH ()-[:DEPENDS_ON]->() RETURN count(*) AS dependency_edges");
  await query("temporal-readback", "MATCH (s)-[r:DEPENDS_ON]->(t) WHERE r.t_valid_start <= 20260816 AND r.t_valid_end >= 20260816 RETURN s.dep_id AS source, t.dep_id AS target, r.t_valid_start AS start, r.t_valid_end AS end ORDER BY source");
  const securityReadbackFirst = await query("security-temporal-readback-first", "MATCH (v:DependencyNode {dep_id: 'pkg:y@4.5.6'})-[r:COMPROMISED_DURING]->(s:DependencyNode {dep_id: 'status:compromised'}) RETURN v.dep_id AS package, s.name AS status, r.t_valid_start AS start, r.t_valid_end AS end");
  const paths = await query("incoming-sspaths", "CALL algo.SSpaths({sourceNode: $target, relTypes: ['DEPENDS_ON'], relDirection: 'incoming', maxLen: 3, pathCount: 10, resultLimit: 10}) YIELD path RETURN path", { target: 1003 });
  await save("affected-roots", deriveAffectedRoots(paths));

  for (const [name, cypher, rows] of nodeQueries) await query(name + "-second", cypher, { rows });
  await query("insert-edges-second", edgeQuery, { rows: fixture.edges });
  await query("insert-security-edges-second", securityEdgeQuery, { rows: fixture.security_edges });
  await query("idempotency-node-count", "MATCH (n:DependencyNode) RETURN count(*) AS dependency_nodes");
  await query("idempotency-edge-count", "MATCH ()-[:DEPENDS_ON]->() RETURN count(*) AS dependency_edges");
  await query("idempotency-security-edge-count", "MATCH ()-[:COMPROMISED_DURING]->() RETURN count(*) AS security_edges");
  const readbackSecond = await query("readback-second", "MATCH (s)-[r:DEPENDS_ON]->(t) RETURN s.dep_id AS source, t.dep_id AS target, r.edge_key AS edge_key, r.t_valid_start AS t_valid_start, r.t_valid_end AS t_valid_end ORDER BY edge_key");
  const securityReadbackSecond = await query("security-temporal-readback-second", "MATCH (v:DependencyNode {dep_id: 'pkg:y@4.5.6'})-[r:COMPROMISED_DURING]->(s:DependencyNode {dep_id: 'status:compromised'}) RETURN v.dep_id AS package, s.name AS status, r.t_valid_start AS start, r.t_valid_end AS end");
  await save("idempotency-compare", {
    identical_rows_after_second_ingest: JSON.stringify(readbackFirst.rows) === JSON.stringify(readbackSecond.rows),
    identical_security_rows_after_second_ingest:
      JSON.stringify(securityReadbackFirst.rows) === JSON.stringify(securityReadbackSecond.rows),
    first_rows: readbackFirst.rows,
    second_rows: readbackSecond.rows,
  });

  console.log("local dependency fixture completed; see " + outputDir);
}

async function parseBody(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function save(name, value) {
  await writeFile(outputDir + "/" + name + ".json", JSON.stringify(value, null, 2) + "\n");
}

function deriveAffectedRoots(response) {
  const roots = [];
  for (const row of response?.rows || []) {
    const value = row?.[0];
    if (value?.type !== "path") continue;
    const nodes = value.value?.nodes || [];
    const root = nodes.at(-1);
    const props = root?.properties || {};
    if (scalar(props.kind) !== "application") continue;
    const reverseTraversal = nodes.map((node) => scalar(node?.properties?.dep_id));
    const relationships = value.value?.relationships || [];
    roots.push({
      application: scalar(props.name),
      dep_id: scalar(props.dep_id),
      exposure_path: reverseTraversal.toReversed(),
      predicates: relationships.map((relationship) => relationship.edge_type).toReversed(),
      sspath_traversal_order: reverseTraversal,
    });
  }
  return { affected_roots: roots };
}

function scalar(value) {
  if (!value || typeof value !== "object") return value;
  for (const key of ["String", "Integer", "Float", "Bool", "Boolean"]) {
    if (Object.hasOwn(value, key)) return value[key];
  }
  return undefined;
}
