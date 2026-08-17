# 05. Integration Risks

## Risk Register

| Severity | Risk | Evidence | Likely impact | Mitigation / fallback |
|---|---|---|---|---|
| CRITICAL | Assuming Neo4j-complete OpenCypher | Executed unbounded, undirected, `RETURN *`, `IN`, and reverse variable-length queries failed; `cypher-compat.md` documents more gaps | Core demo query fails late | Freeze 3-6 explicit query templates, test them against the pinned image on startup, and avoid generated Cypher |
| HIGH | Reverse blast-radius syntax is not normal reverse variable-length `MATCH` | `dep_reverse.json` and `dep_blast_radius.json`: HTTP 400, fixed-source-id error | Track 2's headline feature can appear unsupported | Use `algo.SSpaths` with vulnerable vertex id as fixed source and `relDirection:'incoming'`; alternatively materialize reverse edges |
| HIGH | Direct writes can hit a non-owner node | Second node returned HTTP 421 `not_cell_writer`, owner `node-0` | Intermittent ingestion failure behind naive load balancing | For the demo use one node; otherwise parse owner/routing metadata and retry only idempotent mutations |
| HIGH | Build/runtime prerequisites can consume a day | No Rust/Cargo/native deps here; source requires Rust 1.91+, libcypher-parser, GraphBLAS, and 32 MiB thread stack | Team cannot reproduce locally or deploy | Pin the known image digest; run the official Docker path on the target machine; keep a startup smoke test and do not compile HydraDB as part of app build |
| HIGH | Long-lived writer instability was observed | One edge-mutation internal error and one 20-second timeout during a partial bulk workload; fresh node succeeded | Demo ingestion stalls or leaves partial data | Use a fresh isolated store, deterministic idempotent batches, causal bookmarks, bounded retries, and a prebuilt demo snapshot |
| HIGH | Bolt wrong-auth error framing is incompatible with tested JS driver | Wrong credentials produced `RangeError ERR_OUT_OF_RANGE` in `neo4j-driver` 6.0.1 | Confusing connection diagnostics; auth flow may crash app handler | Prefer HTTP for the hackathon backend; if Bolt is used, validate credentials at startup and wrap low-level errors |
| HIGH | Enterprise target scale is unverified | Largest local graph was 2,101 vertices/2,100 edges, far below 500k documents | Track 1 performance claims could be indefensible | Demo a representative subset; make no production-scale claim; run a targeted 10k-100k ingestion/query check after direction selection |
| HIGH | Dependent HTTP requests need bookmarks | Scale script propagated bookmarks; architecture distinguishes causal positions | Read-after-write can miss data across nodes/readers | Store the last bookmark per graph/cell and include it on dependent requests; or use one node during demo |
| MEDIUM | `UNWIND` grammar is narrow | Source compatibility document and executed scale batches | Ingestion query fails after transformation work is complete | Copy the proven forms exactly; endpoints use one label; batch at <=250 initially; validate one batch before full load |
| MEDIUM | No user-managed index DDL verified | `CREATE INDEX FOR ...` rejected; planner/indexes are internal | Team wastes time tuning nonexistent DDL | Model stable identifiers/properties and rely on internal indexes; measure the exact lookups instead of adding DDL |
| MEDIUM | No explicit multi-request transaction | Source/compatibility inspection | Multi-step ingestion can partially complete | Make each batch idempotent, use deterministic ids, record progress, and replay safely |
| MEDIUM | Temporal/conflict semantics are not native | Memory experiment returned multiple current candidates | Application can present stale or contradictory facts as truth | Keep assertions immutable; encode supersession/revocation; implement explicit selection and abstention policy with tests |
| MEDIUM | Version identity mismatch | OCI label `v0.1.1`, source package/runtime server `0.1.0` | Difficult debugging and accidental drift | Pin image digest and upstream commit in project docs; record `/healthz`/Bolt agent at startup |
| MEDIUM | TLS is default and plaintext is development-only | Source HTTP/Bolt config rejects plaintext unless enabled | Deployment fails at startup or demo uses insecure public exposure | Keep service local/private for demo; use explicit development flag only on loopback; do not expose plaintext publicly |
| MEDIUM | Native paths can explode result volume | Reverse closure returns one path per reachable node/path; full stream returned 2,100 rows | Latency, memory, and UI overload | Enforce `maxLen`, `pathCount`, `resultLimit`, pagination/NDJSON, and application caps |
| MEDIUM | S3/Kubernetes path was not executed | Only local object-store mode ran | Cloud deployment surprises | Use local mounted storage for demo unless cloud infra is already working; validate S3 separately after product choice |
| MEDIUM | Source build was not validated | Environmental blocker, not intrinsic failure | Cannot claim repository builds in this workspace | Report as documented-but-unverified; rely on published image for the hackathon |
| LOW | Static bearer-token ergonomics | Tested token file and namespace grants | Secret rotation and multi-user auth are limited | Keep backend-to-database connection server-side; do not build end-user auth around HydraDB |

## Detailed High-Risk Reproduction

### Reverse Variable-Length `MATCH`

Query:

```cypher
MATCH (v:Version {name: 'lib-a', version: '1.2.0'})
      <-[:DEPENDS_ON*1..3]-(a:Application)
RETURN a.name AS affected
```

Observed response:

```text
HTTP 400
OpenCypher query is not supported yet: variable-length MATCH requires a fixed source id
```

Working fallback:

```cypher
CALL algo.SSpaths({
  sourceNode: $vulnerable_id,
  relTypes: ['DEPENDS_ON'],
  relDirection: 'incoming',
  maxLen: 3,
  pathCount: $limit,
  resultLimit: $limit
}) YIELD path
RETURN path
```

### Writer Ownership

Reproduction: start a second query node over the same local store with a
different node id, read an existing graph, then send a mutation directly to that
node while `node-0` owns the cell.

Observed response: HTTP 421, code `not_cell_writer`, owner `node-0`.

Impact: random load balancing is not a transparent write strategy. The
hackathon-safe fallback is a single HydraDB query node.

### Long-Lived Writer Failure

Reproduction context: a previously used writer handled the full functional
suite and then a partial bulk workload. It emitted an internal edge-mutation
error followed by one request timing out at 20 seconds. The same scale script
completed from an empty store on a fresh isolated node.

Interpretation: **INFERENCE**, not a proven engine defect. The result may depend
on prior graph state or the interrupted workload. It is still an operational
warning: do not rely on a one-shot, non-idempotent live import immediately before
the demo.

### Bolt Authentication Error

Reproduction: connect `neo4j-driver` 6.0.1 with a wrong password/token and call
`verifyConnectivity()`.

Observed result: rejection surfaced as a buffer-offset `RangeError`, not a
Neo4j authentication code. Normal authenticated reads worked.

Fallback: use the HTTP API, whose error body is structured and easier to wrap.

## Day-Loss Prevention Checklist

1. Pin the HydraDB image digest and run the two-query smoke test first.
2. Use one node and local durable storage for the demo unless distributed
   behavior is itself required.
3. Select and execute the exact headline query before building UI or ingestion.
4. Test the chosen `UNWIND` statement on five rows, then 250, before full load.
5. Persist bookmarks and deterministic ids in the ingestion job.
6. Preload a verified dataset and retain an export/rebuild path.
7. Keep HTTP as the fallback even if Bolt is used initially.
8. Cap every path query and test the no-evidence branch.
