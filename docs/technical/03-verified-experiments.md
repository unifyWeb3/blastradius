# 03. Verified Experiments

## Runtime Setup

**VERIFIED BY EXECUTION.** The official prebuilt image was pinned at digest:

```text
ghcr.io/hydra-db/hydradb@sha256:db78309a233be54662db29744047e985a39b51c45a270d1a1f47c31a62cdb709
```

Because Docker and Rust were unavailable, the image filesystem was extracted to
`/tmp/hydradb-rootfs` and the included `graph-node` binary was run directly with
the image library directories on `LD_LIBRARY_PATH`. Local object-store and cache
directories were isolated under `/tmp`. The node was configured with one graph,
one cell, a bearer token, explicit plaintext development mode, and
`RUST_MIN_STACK=33554432`.

The exact Docker-equivalent environment is in the upstream README and the
investigation reproduction notes are in `investigation/README.md`.

## Interface Proofs

### HTTP

**VERIFIED BY EXECUTION.** Requests to
`POST /v1/graphs/default/query` accepted bearer authentication,
`X-Graph-Namespace`, JSON query text, parameters, pagination, bookmarks, and
consistency mode. Responses used tagged values such as:

```json
{"type":"vertex_id","value":11}
```

The server returned structured 400 errors for unsupported Cypher, 401/403-style
authorization failures for bad credentials/scope, and HTTP 421
`not_cell_writer` when a write reached a read-capable non-owner node.

NDJSON streaming was exercised for a complete reverse-path result. A full
2,100-edge graph yielded 2,100 path rows, with 2,102 lines including stream
header and summary, and `has_more: false`.

### Bolt

**VERIFIED BY EXECUTION.** `neo4j-driver` 6.0.1 connected to Bolt, reported
server agent `SlateDBGraph/0.1.0`, executed a parameterized bounded multi-hop
query, and returned persisted vertices 11, 12, and 13. A no-evidence query
returned zero rows.

Wrong credentials were rejected, but the JavaScript driver surfaced:

```text
RangeError [ERR_OUT_OF_RANGE]: The value of "offset" is out of range...
```

This proves rejection, but not clean Neo4j-compatible error framing.

## Minimal Graph Operations

The base graph had `Person` and `Project` vertices, directed `LINKS`
relationships, relationship properties, multiple hops, and mixed labels.

| Operation | Classification | Execution result |
|---|---|---|
| Direct lookup | SUPPORTED | Alice/Core returned by id |
| One-hop traversal | SUPPORTED | Alice -> Bob returned |
| Multi-hop traversal | SUPPORTED WITH LIMITATIONS | Bounded outgoing 1..3 returned Bob, Carol, Hydra; fixed source id required |
| Reverse traversal | SUPPORTED WITH LIMITATIONS | Direct incoming pattern returned Alice; reverse closure needs native paths |
| Filtered traversal | SUPPORTED | Node, relationship property, and numeric predicates matched |
| Relationship/property filtering | SUPPORTED | `kind` and `confidence` worked |
| Aggregation | SUPPORTED WITH LIMITATIONS | `count(*)` and `sum(...)` worked |
| Shortest/path-like query | SUPPORTED | `SPpaths`, `SSpaths`, and `MSpaths` executed |
| Graph pattern matching | SUPPORTED WITH LIMITATIONS | Explicit directed two-hop pattern worked |
| Provenance query | SUPPORTED AS A MODEL | Claims/sessions linked to source and subject were traversable |
| Temporal/version query | SUPPORTED AS A MODEL | Validity fields, revision, supersession, and revocation edges were queryable |

Native `SPpaths` returned a hydrated path with all four nodes and three
relationships, including labels and properties. `MSpaths` accepted indexed
source/target selectors. `SSpaths` accepted `incoming` direction and provided
the working substitute for reverse transitive `MATCH`.

## Experiment A: Enterprise Context Graph

Schema used:

```text
(Alias)-[:ALIAS_OF]->(Person)-[:MEMBER_OF]->(Team)-[:WORKS_ON]->(Project)
(Document)-[:MENTIONS]->(Project)
(Claim)-[:ABOUT]->(Project)
```

Claims carried `source` and `observed_at`. Two incompatible Atlas launch claims
were deliberately stored.

**VERIFIED BY EXECUTION:**

- alias `A. Smith` resolved through the canonical Alice vertex to the Data team;
- person -> team -> project multi-hop context returned Alice/Data/Atlas;
- both conflicting claims returned with their source and observation time;
- a query for project Zeus returned a successful response with zero rows.

**LIMITATION:** HydraDB represents aliases, ontology edges, claims, and evidence
well, but it did not merge identities, detect contradiction, choose a trusted
claim, or formulate an abstaining answer. Those are ingestion/query-layer jobs.

## Experiment B: Dependency Graph

Schema used:

```text
(Application)-[:DEPENDS_ON {source}]->(Version)
(Version)-[:DEPENDS_ON {source}]->(Version)
(Version)-[:VERSION_OF]->(Package)
(Maintainer)-[:MAINTAINS]->(Package)
```

Version vertices carried exact package/version identity and a vulnerability
flag.

**VERIFIED BY EXECUTION:**

- fixed-id forward bounded traversal worked in the scale graph; the
  property-selected `dep_forward` query was rejected with the same fixed-source
  limitation;
- direct reverse traversal worked;
- an explicit two-hop explanation returned payments -> internal-sdk -> lib-a;
- maintainer lookup traversed vulnerable version -> package -> maintainer;
- native incoming `SSpaths` performed reverse closure on the scale graph.

**VERIFIED FAILURE:** both reverse variable-length `MATCH` queries returned HTTP
400 with `variable-length MATCH requires a fixed source id`. This is the most
important Track 2 query-language limitation. Use the native path procedure or
materialize a query-friendly direction; do not assume Neo4j syntax will work.

## Experiment C: Temporal Memory Graph

Schema used:

```text
(Session)-[:ASSERTS {confidence}]->(Memory)
(newer Memory)-[:SUPERSEDES]->(older Memory)
(Session)-[:REVOKES {reason}]->(Memory)
```

Memories carried subject, value, `valid_from`, `valid_to`, and confidence.

**VERIFIED BY EXECUTION:**

- chronological history returned Friday, Monday, and Tuesday assertions;
- the current-validity filter returned the two still-open conflicting values,
  ordered by confidence;
- single-hop supersession and revocation relationships were stored and queried;
- session provenance returned source time and assertion confidence;
- an unsupported subject (`budget`) returned zero rows;
- a guarded upsert ignored an older replay and accepted a newer update while
  preserving create time.

**LIMITATION:** HydraDB did not infer that Monday is true, resolve the Monday vs
Tuesday conflict, apply revocation automatically, or convert no rows into an
abstaining answer. The application must define deterministic temporal and
evidence policy. The property-selected variable-length revision-chain query was
also rejected; longer chains need a fixed-id/native-path query.

## Small Scale Measurements

**VERIFIED BY EXECUTION.** These are local development measurements from one
isolated node. They are not production benchmarks and do not validate the
500,000-document target.

| Graph size | Incremental ingestion | Property lookup warm p50 | Reverse 2-hop `SSpaths` warm p50 |
|---:|---:|---:|---:|
| 201 vertices / 200 edges | 1,670.7 rows/s | 9.854 ms | 9.574 ms |
| 601 vertices / 600 edges | 2,687.7 rows/s | 7.682 ms | 11.666 ms |
| 2,101 vertices / 2,100 edges | 2,403.1 rows/s | 13.961 ms | 49.969 ms |

Each warm statistic is based on five measurements after one cold request.
Ingestion used parameterized `UNWIND` batches of at most 250 rows and causal
bookmarks. The largest incoming path query had a cold time of 924.187 ms and
warm p95 of 78.575 ms.

Memory usage, durable-store bytes, index generation time, and the isolated
latency effect of internal indexes were not measured. Any claim about those is
**UNVERIFIED**.

## Persistence and Concurrency

**VERIFIED BY EXECUTION.** After stopping and restarting a node over the same
local object-store directory, the graph remained readable at epoch 22. A second
node could read the same store but refused a direct write because `node-0` held
the writer lease. This matches the source's one-writer/many-reader model.

During one long-lived partial bulk workload, the original writer produced an
internal edge-mutation failure and one 20-second mutation timeout. The same
workload completed on a fresh isolated node. This does not establish a general
data-corruption bug, but it is enough to justify restarting from a clean test
store before the demo and keeping ingestion retryable/idempotent.

## Evidence Files

- HTTP: `investigation/results/http/*.json`
- Bolt: `investigation/results/bolt/bolt.json`
- Scale: `investigation/results/scale/summary.json`
- Runtime metadata: `investigation/results/runtime/metadata.json`
- Reproduction scripts: `investigation/experiments/`
