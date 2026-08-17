import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:18443";
const token = process.env.TOKEN || "hydradb-investigation-token-32-bytes";
const namespace = process.env.NAMESPACE || "local";
const graphId = process.env.GRAPH_ID || "default";
const cellId = process.env.CELL_ID || "cell-0";
const outputDir =
  process.env.OUT || "investigation/results/http";

await mkdir(outputDir, { recursive: true });

async function query(name, cypher, parameters = {}, extraBody = {}) {
  const request = {
    cell_id: cellId,
    query_id: name,
    query: cypher,
    parameters,
    ...extraBody,
  };
  const started = performance.now();
  const response = await fetch(
    baseUrl + "/v1/graphs/" + graphId + "/query",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "X-Graph-Namespace": namespace,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(60_000),
    },
  );
  const durationMs = performance.now() - started;
  const text = await response.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  const record = {
    name,
    request,
    http_status: response.status,
    duration_ms: Number(durationMs.toFixed(3)),
    response: body,
  };
  await writeFile(
    outputDir + "/" + name + ".json",
    JSON.stringify(record, null, 2) + "\n",
  );
  const rows = Array.isArray(body?.rows) ? body.rows.length : "-";
  const error = body?.error?.message ? " error=" + body.error.message : "";
  console.log(
    name +
      " status=" +
      response.status +
      " rows=" +
      rows +
      " duration_ms=" +
      record.duration_ms +
      error,
  );
  return record;
}

async function section(name) {
  console.log("\n=== " + name + " ===");
}

await section("minimal graph and core operations");
await query(
  "core_create_1",
  "CREATE (a:Person {id: 10, name: 'Alice', team: 'Core'})-[:LINKS {kind: 'knows', since: 2024, confidence: 0.9}]->(b:Person {id: 11, name: 'Bob', team: 'Data'})",
);
await query(
  "core_create_2",
  "CREATE (b:Person {id: 11, name: 'Bob', team: 'Data'})-[:LINKS {kind: 'reports', since: 2023}]->(c:Person {id: 12, name: 'Carol', team: 'Platform'})",
);
await query(
  "core_create_3",
  "CREATE (c:Person {id: 12, name: 'Carol', team: 'Platform'})-[:LINKS {kind: 'owns', since: 2022}]->(d:Project {id: 13, name: 'Hydra', status: 'active'})",
);
await query(
  "direct_lookup",
  "MATCH (p:Person {id: 10}) RETURN p.name AS name, p.team AS team",
);
await query(
  "one_hop",
  "MATCH (p:Person {id: 10})-[:LINKS]->(q) RETURN q.id AS id, q.name AS name",
);
await query(
  "reverse_traversal",
  "MATCH (q)-[:LINKS]->(p:Person {id: 11}) RETURN q.id AS id, q.name AS name",
);
await query(
  "multi_hop",
  "MATCH (p {id: 10})-[:LINKS*1..3]->(q) RETURN q.id AS id ORDER BY id",
);
await query(
  "filtered_traversal",
  "MATCH (p:Person)-[r:LINKS {kind: 'knows'}]->(q) WHERE p.team = 'Core' AND r.confidence >= 0.9 RETURN p.id AS source, q.id AS target",
);
await query(
  "aggregate",
  "MATCH ()-[r:LINKS]->() RETURN count(*) AS total, sum(r.since) AS years",
);
await query(
  "optional",
  "OPTIONAL MATCH (p:Person {id: 10})-[:MISSING]->(q) RETURN p.id AS source, q.id AS target",
);
await query(
  "no_evidence",
  "MATCH (p:Person {name: 'Nobody'})-[:LINKS]->(q) RETURN q.id AS id",
);
await query(
  "pattern_match",
  "MATCH (a:Person {id: 10})-[:LINKS]->(b:Person)-[:LINKS]->(c:Person) RETURN a.name AS a, b.name AS b, c.name AS c",
);
await query(
  "path_sp",
  "CALL algo.SPpaths({sourceNode: 10, targetNode: 13, relTypes: ['LINKS'], relDirection: 'outgoing', maxLen: 3, pathCount: 3}) YIELD path, pathWeight RETURN path, pathWeight",
);
await query(
  "path_ms",
  "CALL algo.MSpaths({sourceLabel: 'Person', sourceProperty: 'name', sourceValues: ['Alice', 'Bob'], targetLabel: 'Project', targetProperty: 'name', targetValues: ['Hydra'], pairwise: false, relTypes: ['LINKS'], relDirection: 'outgoing', maxLen: 3, pathCount: 2}) YIELD path RETURN path",
);
const cursorQuery = "MATCH (p:Person) RETURN p.id AS id ORDER BY id";
const firstCursorPage = await query(
  "cursor_page",
  cursorQuery,
  {},
  { page_size: 1 },
);
if (firstCursorPage.response?.next_cursor !== null) {
  await query(
    "cursor_page",
    cursorQuery,
    {},
    {
      page_size: 1,
      cursor: firstCursorPage.response.next_cursor,
      read_epoch: firstCursorPage.response.read_epoch,
    },
  );
}
await query(
  "strong_consistency",
  "MATCH (p:Person {id: 10}) RETURN p.name AS name",
  {},
  { consistency: "strong" },
);

await section("parser and capability boundaries");
await query(
  "reject_undirected",
  "MATCH (a)-[:LINKS]-(b) RETURN b.id AS id",
);
await query(
  "reject_unbounded",
  "MATCH (a {id: 10})-[:LINKS*]->(b) RETURN b.id AS id",
);
await query("reject_return_star", "MATCH (a {id: 10}) RETURN *");
await query(
  "reject_in",
  "MATCH (a:Person) WHERE a.name IN ['Alice'] RETURN a.id AS id",
);

await section("enterprise-shaped graph");
await query(
  "enterprise_create_1",
  "CREATE (alice:Person {id: 100, name: 'Alice', email: 'alice@example.com'})-[:MEMBER_OF]->(team:Team {id: 101, name: 'Data'})",
);
await query(
  "enterprise_create_2",
  "CREATE (team:Team {id: 101, name: 'Data'})-[:WORKS_ON]->(project:Project {id: 102, name: 'Atlas'})",
);
await query(
  "enterprise_create_3",
  "CREATE (doc:Document {id: 103, title: 'Atlas runbook', source: 'slack', observed_at: 20260816})-[:MENTIONS]->(project:Project {id: 102, name: 'Atlas'})",
);
await query(
  "enterprise_alias",
  "CREATE (alias:Alias {id: 104, value: 'A. Smith', canonical: 'Alice'})-[:ALIAS_OF]->(alice:Person {id: 100, name: 'Alice', email: 'alice@example.com'})",
);
await query(
  "enterprise_claim_1",
  "CREATE (claim1:Claim {id: 105, value: 'Atlas launches Friday', source: 'slack', observed_at: 20260815})-[:ABOUT]->(project:Project {id: 102, name: 'Atlas'})",
);
await query(
  "enterprise_claim_2",
  "CREATE (claim2:Claim {id: 106, value: 'Atlas launches Monday', source: 'email', observed_at: 20260816})-[:ABOUT]->(project:Project {id: 102, name: 'Atlas'})",
);
await query(
  "enterprise_reasoning",
  "MATCH (p:Person {id: 100})-[:MEMBER_OF]->(t:Team)-[:WORKS_ON]->(x:Project) RETURN p.name AS person, t.name AS team, x.name AS project",
);
await query(
  "enterprise_alias_resolution",
  "MATCH (a:Alias {value: 'A. Smith'})-[:ALIAS_OF]->(p:Person)-[:MEMBER_OF]->(t:Team) RETURN p.name AS canonical, t.name AS team",
);
await query(
  "enterprise_provenance",
  "MATCH (c:Claim)-[:ABOUT]->(x:Project {name: 'Atlas'}) RETURN c.value AS claim, c.source AS source, c.observed_at AS observed ORDER BY observed",
);
await query(
  "enterprise_no_evidence",
  "MATCH (c:Claim)-[:ABOUT]->(x:Project {name: 'Zeus'}) RETURN c.value AS claim",
);

await section("dependency-shaped graph");
await query(
  "dep_create_1",
  "CREATE (app:Application {id: 200, name: 'checkout'})-[:DEPENDS_ON {source: 'lockfile'}]->(v:Version {id: 202, name: 'lib-a', version: '1.2.0', vulnerable: true})",
);
await query(
  "dep_create_2",
  "CREATE (service:Application {id: 205, name: 'payments'})-[:DEPENDS_ON {source: 'lockfile'}]->(sdk:Version {id: 206, name: 'internal-sdk', version: '3.0.0', vulnerable: false})",
);
await query(
  "dep_create_3",
  "CREATE (sdk:Version {id: 206, name: 'internal-sdk', version: '3.0.0'})-[:DEPENDS_ON {source: 'package.json'}]->(v:Version {id: 202, name: 'lib-a', version: '1.2.0', vulnerable: true})",
);
await query(
  "dep_create_4",
  "CREATE (v:Version {id: 202, name: 'lib-a', version: '1.2.0'})-[:VERSION_OF]->(p:Package {id: 201, name: 'lib-a'})",
);
await query(
  "dep_create_5",
  "CREATE (m:Maintainer {id: 207, name: 'Dana'})-[:MAINTAINS]->(p:Package {id: 201, name: 'lib-a'})",
);
await query(
  "dep_forward",
  "MATCH (a:Application {name: 'payments'})-[:DEPENDS_ON*1..3]->(v:Version) RETURN v.name AS package, v.version AS version ORDER BY package",
);
await query(
  "dep_reverse",
  "MATCH (v:Version {vulnerable: true})<-[:DEPENDS_ON*1..3]-(a:Application) RETURN a.name AS app ORDER BY app",
);
await query(
  "dep_blast_radius",
  "MATCH (v:Version {name: 'lib-a', version: '1.2.0'})<-[:DEPENDS_ON*1..3]-(a:Application) RETURN a.name AS affected ORDER BY affected",
);
await query(
  "dep_explanation",
  "MATCH (a:Application {name: 'payments'})-[:DEPENDS_ON]->(sdk:Version)-[:DEPENDS_ON]->(v:Version {vulnerable: true}) RETURN a.name AS app, sdk.name AS through, v.name AS vulnerable_package, v.version AS version",
);
await query(
  "dep_maintainer",
  "MATCH (m:Maintainer)-[:MAINTAINS]->(p:Package)<-[:VERSION_OF]-(v:Version {vulnerable: true}) RETURN m.name AS maintainer, p.name AS package, v.version AS version",
);

await section("temporal-memory-shaped graph");
await query(
  "mem_create_1",
  "CREATE (s1:Session {id: 300, started_at: 20260814})-[:ASSERTS {confidence: 0.7}]->(m1:Memory {id: 301, subject: 'deploy', value: 'Friday', valid_from: 20260814, valid_to: 20260815, confidence: 0.7})",
);
await query(
  "mem_create_2",
  "CREATE (s2:Session {id: 302, started_at: 20260816})-[:ASSERTS {confidence: 0.9}]->(m2:Memory {id: 303, subject: 'deploy', value: 'Monday', valid_from: 20260816, valid_to: 0, confidence: 0.9})",
);
await query(
  "mem_create_3",
  "CREATE (s3:Session {id: 304, started_at: 20260816})-[:ASSERTS {confidence: 0.4}]->(m3:Memory {id: 305, subject: 'deploy', value: 'Tuesday', valid_from: 20260816, valid_to: 0, confidence: 0.4})",
);
await query(
  "mem_supersedes",
  "CREATE (m2:Memory {id: 303, subject: 'deploy', value: 'Monday'})-[:SUPERSEDES]->(m1:Memory {id: 301, subject: 'deploy', value: 'Friday'})",
);
await query(
  "mem_revoke",
  "CREATE (s3:Session {id: 304, started_at: 20260816})-[:REVOKES {reason: 'corrected'}]->(m1:Memory {id: 301, subject: 'deploy', value: 'Friday'})",
);
await query(
  "mem_current",
  "MATCH (m:Memory {subject: 'deploy'}) WHERE m.valid_to > 20260816 OR m.valid_to = 0 RETURN m.value AS value, m.confidence AS confidence ORDER BY confidence DESC",
);
await query(
  "mem_history",
  "MATCH (m:Memory {subject: 'deploy'}) RETURN m.value AS value, m.valid_from AS valid_from, m.valid_to AS valid_to ORDER BY valid_from",
);
await query(
  "mem_revision_chain",
  "MATCH (newer:Memory)-[:SUPERSEDES*1..3]->(older:Memory) RETURN newer.value AS newer, older.value AS older",
);
await query(
  "mem_provenance",
  "MATCH (s:Session)-[r:ASSERTS]->(m:Memory {subject: 'deploy'}) RETURN s.started_at AS session, m.value AS value, r.confidence AS confidence ORDER BY session",
);
await query(
  "mem_abstain",
  "MATCH (m:Memory {subject: 'budget'}) RETURN m.value AS value",
);

await section("guarded temporal upsert");
const guardedUpsert =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) " +
  "SET n:TemporalEntity, n.value = row.value, n.updated_at = row.updated_at, " +
  "n.created_at = row.created_at, " +
  "n.__hydradb_update_if_newer_by = row.updated_at, " +
  "n.__hydradb_create_only_created_at = row.created_at";
await query("guarded_create", guardedUpsert, {
  rows: [
    {
      vertex: 350,
      value: "initial",
      updated_at: 202608160900,
      created_at: 202608160900,
    },
  ],
});
await query("guarded_older_replay", guardedUpsert, {
  rows: [
    {
      vertex: 350,
      value: "stale",
      updated_at: 202608160800,
      created_at: 999999999999,
    },
  ],
});
await query(
  "guarded_after_older",
  "MATCH (n:TemporalEntity {id: 350}) RETURN n.value AS value, n.updated_at AS updated_at, n.created_at AS created_at",
);
await query("guarded_newer_update", guardedUpsert, {
  rows: [
    {
      vertex: 350,
      value: "fresh",
      updated_at: 202608161000,
      created_at: 999999999999,
    },
  ],
});
await query(
  "guarded_after_newer",
  "MATCH (n:TemporalEntity {id: 350}) RETURN n.value AS value, n.updated_at AS updated_at, n.created_at AS created_at",
);

console.log("\nresults written to " + outputDir);
