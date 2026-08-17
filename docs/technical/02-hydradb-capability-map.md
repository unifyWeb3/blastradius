# 02. HydraDB Capability Map

Evidence priority in this document is execution, source inspection,
documentation, then inference.

## Verified Capability Matrix

| Capability | Verified? | Evidence | Relevant track(s) | Limitations | Risk |
|---|---|---|---|---|---|
| Direct vertex/property lookup | VERIFIED BY EXECUTION | `results/http/direct_lookup.json` | All | User-facing identity/schema remains application-defined | LOW |
| One-hop directed traversal | VERIFIED BY EXECUTION | `one_hop.json` | All | Directed patterns only | LOW |
| Direct reverse traversal | VERIFIED BY EXECUTION | `reverse_traversal.json` | 1, 2 | One-hop `MATCH` works | LOW |
| Bounded forward multi-hop `MATCH` | VERIFIED BY EXECUTION | `multi_hop.json` returned ids 11, 12, 13 | All | Requires a fixed source id; explicit upper hop bound | MEDIUM |
| Transitive reverse `MATCH` | NOT SUPPORTED for tested shape | `dep_reverse.json`, `dep_blast_radius.json` returned HTTP 400 | 2 | Error: `variable-length MATCH requires a fixed source id` | HIGH |
| Reverse transitive closure via native path | VERIFIED BY EXECUTION | scale experiment uses `algo.SSpaths` incoming through 2,100 edges | 2 | Use procedure-specific syntax and limits, not ordinary `MATCH` | MEDIUM |
| Filtered traversal | VERIFIED BY EXECUTION | `filtered_traversal.json` | All | OpenCypher predicate set is incomplete | MEDIUM |
| Relationship property filtering | VERIFIED BY EXECUTION | `LINKS {kind:'knows'}` plus confidence predicate | 1, 2 | Complex expressions/operators need compatibility checks | MEDIUM |
| Aggregation | VERIFIED BY EXECUTION | `aggregate.json` (`count`, `sum`) | All | Not a full Cypher aggregate surface | MEDIUM |
| Pattern matching | VERIFIED BY EXECUTION | `pattern_match.json` | 1, 2 | Directed, bounded, supported-clause subset | LOW |
| Optional match | VERIFIED BY EXECUTION | `optional.json` | 1, 3 | Mutations cannot be combined with optional match | MEDIUM |
| Native shortest/path procedures | VERIFIED BY EXECUTION | `path_sp.json`, `path_ms.json`, scale `SSpaths` | All | Custom HydraDB procedure syntax; bounded; result limits | LOW |
| Hydrated path output | VERIFIED BY EXECUTION | `path_sp.json` includes nodes, labels, relationships, and properties | All | Hydration cost grows with returned paths | MEDIUM |
| Provenance modeling/query | VERIFIED BY EXECUTION | `enterprise_provenance.json`, `mem_provenance.json` | 1, 3 | Provenance semantics are application schema, not built-in truth logic | LOW |
| Alias/entity-resolution representation | VERIFIED BY EXECUTION | `enterprise_alias_resolution.json` | 1 | Entity resolution itself must happen before/during ingestion | MEDIUM |
| Conflicting claims representation | VERIFIED BY EXECUTION | two claims returned with source and observed time | 1, 3 | No native contradiction adjudication | MEDIUM |
| Empty-result/no-evidence primitive | VERIFIED BY EXECUTION | `enterprise_no_evidence.json`, `mem_abstain.json` | 1, 3 | Application must convert empty evidence to explicit abstention | LOW |
| Temporal properties and revision edges | VERIFIED BY EXECUTION | memory history, `SUPERSEDES`, `REVOKES`, validity fields | 3 | No native bitemporal engine or automatic current-fact selection | MEDIUM |
| Guarded newer-only upsert | VERIFIED BY EXECUTION | `guarded_after_older.json`, `guarded_after_newer.json` | 1, 3 | Uses HydraDB-specific reserved properties; semantics need careful documentation | MEDIUM |
| Versioned nodes/relationships | VERIFIED BY EXECUTION as a model | dependency graph uses version vertices and typed edges | 2 | Version resolution and semver rules are application logic | LOW |
| Typed JSON HTTP API | VERIFIED BY EXECUTION | all `results/http/*.json` | All | Client must unwrap HydraDB tagged values | LOW |
| NDJSON streaming | VERIFIED BY EXECUTION | streamed blast-radius validation | All | Must parse header/rows/summary; keep output bounded | LOW |
| HTTP pagination/cursors | VERIFIED BY EXECUTION | `cursor_page.json` | All | Cursor must remain paired with its read epoch/query | LOW |
| Bearer authentication | VERIFIED BY EXECUTION and source | runtime auth checks; `src/client/http.rs`, `service.rs` | All | Static token model in tested setup; secret distribution remains operational work | LOW |
| Namespace authorization | VERIFIED BY EXECUTION and source | namespace grant/rejection tests | All | Header/database scope must be supplied correctly | LOW |
| Bolt 5.x reads | VERIFIED BY EXECUTION | `results/bolt/bolt.json`, driver 6.0.1 | All | Compatibility is incomplete at Cypher and error-framing layers | MEDIUM |
| Bolt authentication failure | VERIFIED BY EXECUTION as broken behavior | wrong credential caused driver `RangeError` | All | Not a clean Neo4j authentication exception | HIGH |
| Scalar query parameters | VERIFIED BY EXECUTION | Bolt `$id`, HTTP experiment parameters | All | Parameter types vary by entry point | LOW |
| Batched `UNWIND` ingestion | VERIFIED BY EXECUTION | scale script ingested 2,101 vertices/2,100 edges | All | Narrow grammar; matched endpoints need exactly one label | MEDIUM |
| Incremental writes | VERIFIED BY EXECUTION | sequential create/update experiments | All | Propagate causal bookmarks across dependent requests | LOW |
| User-managed index DDL | NOT SUPPORTED in tested build | `CREATE INDEX FOR ...` rejected | All | No application-controlled index lifecycle verified | MEDIUM |
| Automatic property index planning | VERIFIED IN SOURCE; behavior observed | planner/source inspection and property lookup latency | All | Exact cardinality/cost thresholds not benchmarked | MEDIUM |
| Causal bookmarks | VERIFIED BY EXECUTION | returned/propagated bookmarks | All | Omitting bookmarks can violate immediate read-your-writes expectations across nodes | MEDIUM |
| Strong read mode | VERIFIED BY EXECUTION | `strong_consistency.json` | All | Pays an object-store refresh cost; not scale-benchmarked | LOW |
| Snapshot-consistent query | VERIFIED IN SOURCE; read epoch observed | architecture, query responses | All | Historical arbitrary-epoch snapshots are explicitly not supported | MEDIUM |
| Restart persistence | VERIFIED BY EXECUTION | data visible after restart at epoch 22 | All | Only local object-store mode was exercised | LOW |
| One-writer/many-reader cell behavior | VERIFIED BY EXECUTION and source | second node read; write rejected with owner `node-0` | All | Direct HTTP clients need owner routing/retry | HIGH |
| Explicit multi-request transactions | NOT SUPPORTED / not exposed | compatibility/source inspection | All | Each request is an independent operation | MEDIUM |
| Bulk loader/importer | VERIFIED IN SOURCE, NOT EXECUTED | `examples/falkor_import.rs` | 1, 2 | Not validated for hackathon data; transformation still required | MEDIUM |
| Kubernetes/Helm deployment | VERIFIED IN SOURCE, NOT EXECUTED | `charts/hydradb/` | All | Excessive deployment complexity for a four-day demo unless infrastructure already exists | HIGH |
| Object-store/S3 deployment | DOCUMENTED BUT NOT VERIFIED | README, chart, architecture | All | Investigation ran local object-store mode only | MEDIUM |

## OpenCypher Boundary

**VERIFIED BY EXECUTION and source compatibility document.** The following are
safe to rely on for the tested graph shapes: directed `MATCH`, labels and
properties, `WHERE` with basic comparisons/boolean logic, explicit projections,
ordering, `CREATE`, constrained `MERGE`, `SET`, `DELETE`, narrow `UNWIND`, and
native path procedure calls.

Do not design a demo around the following without a fresh isolated probe:

- unbounded variable-length traversal;
- undirected relationship patterns;
- `RETURN *`;
- `IN`, `IS NULL`, `CONTAINS`, or `ENDS WITH`;
- arbitrary `WITH`, `MERGE`, or `UNWIND` forms;
- transitive reverse variable-length `MATCH` from a property-selected target;
- user-created indexes;
- cross-request transactions.

The safest application pattern is to keep queries short, explicit, directed,
bounded, parameterized, and covered by a startup smoke test.

## Database Capability Versus Application Logic

HydraDB provides graph storage, directed relationships, bounded traversal,
paths, snapshot-scoped reads, provenance-friendly records, and transport
interfaces. It does not provide domain semantics for:

- entity extraction or deduplication;
- ontology mapping;
- contradiction detection or trust ranking;
- semver/lockfile resolution;
- vulnerability matching;
- temporal truth selection;
- confidence calibration;
- language-model answer generation;
- abstention policy.

Those responsibilities must be kept explicit in the ingestion/query layer so
the demo does not imply database behavior that is actually application policy.
