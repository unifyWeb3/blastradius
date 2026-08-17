# 01. Repository Recon

## Scope and State

**VERIFIED IN SOURCE / EXECUTION.** The workspace root contains only the
investigation directory; it is not itself a participant Git checkout. The
preserved upstream checkout is `investigation/upstream/hydradb` and is clean:

| Field | Value |
|---|---|
| Branch | `main` |
| Commit | `6a2fbb192f37f51a93690a2ae2d2f5e27e6e4219` |
| Describe | `v0.1.1-2-g6a2fbb1` |
| Uncommitted source changes | None |
| License | AGPL-3.0 |

No participant-authored application code was overwritten. All work is under
`investigation/` and `docs/technical/`. Files created for the investigation are
dated August 16, 2026; no pre-August-12 participant work was present in the
workspace root.

## Architecture

**VERIFIED IN SOURCE.** HydraDB is a Rust graph database built around SlateDB.
The durable source of truth is an S3-compatible object store (a local directory
in development). Local memory and SSD/NVMe are caches. The source separates:

| Component | Responsibility | Source evidence |
|---|---|---|
| `graph-node` | HTTP/Bolt query service, canonical graph reads and writes | `README.md:14-19`, `src/bin/graph-node.rs` |
| `graph-indexer` | Asynchronous immutable CSC/GraphBLAS index generation | `README.md:16-18,80-83`, `src/bin/graph-indexer.rs` |
| `src/shard/` | Graph lifecycle, snapshot reads, writes, query execution | repository layout and module tree |
| `src/query/` | OpenCypher lowering, algebra, planning, transport types | `README.md:464-475` |
| `src/engine/` | Placement, routing, index store, GC, traversal | `architecture.md` and module tree |
| `src/client/` | HTTP API, Bolt protocol, authentication, quotas, cursors | `README.md:464-475` |
| `src/sparse_kernel/` | Sparse traversal and SuiteSparse GraphBLAS FFI | module tree |
| `crates/placement/` | Cell placement, heartbeats, writer ownership | source module |
| `crates/telemetry/` | Metrics, tracing, optional OTLP | source module |

The graph model stores vertices and directed relationships in SlateDB records.
Reverse adjacency is available to the planner, and immutable CSC generations are
published by indexers. Queries pin one SlateDB snapshot; when an index is absent
or behind, the query path can combine an indexed base with the visible WAL tail
or fall back to canonical snapshot adjacency. These are source/documentation
claims; the investigation directly verified the resulting query behavior, not
the full distributed index lifecycle.

## Storage, Snapshots, and Coordination

**VERIFIED IN SOURCE; selected behavior VERIFIED BY EXECUTION.** The source and
architecture document describe:

- object-store durability for graph records, WALs, manifests, leases, and CSC
  generations;
- one active SlateDB writer per cell plus any number of readers;
- object-store CAS placement leases and SlateDB writer epochs to fence stale
  writers;
- causal reads from the current durable reader view and strong reads that refresh
  from object storage before pinning a snapshot;
- query-scoped read epochs and bookmarks for causal positioning;
- restartable, disposable caches.

The experiments verified causal bookmarks, explicit strong reads, a durable
restart (data visible at read epoch 22 after restart), and a non-owner write
being rejected with HTTP 421 `not_cell_writer`. They did not run a multi-node
failure or Jepsen-style test.

## Query and Indexing Architecture

**VERIFIED IN SOURCE.** OpenCypher is parsed through `libcypher-parser` and
lowered into HydraDB's query algebra. The planner has property lookup,
relationship metadata, reverse adjacency, and GraphBLAS-compatible sparse
traversal paths. The native path procedures are implemented in
`src/query/path_procedure.rs` and execute snapshot-scoped `SPpaths`, `SSpaths`,
and `MSpaths`.

Property indexes are maintained internally by storage/index structures and can
be selected by the planner. There is no verified public DDL for creating or
managing them: an executed `CREATE INDEX FOR ...` request was rejected. The
indexer is a separate runtime and does not expose a client listener.

## Public Interfaces

**VERIFIED BY EXECUTION.** Practical application interfaces are:

1. HTTPS `POST /v1/graphs/{graph_id}/query` with typed JSON responses.
2. HTTPS NDJSON streaming for larger result sets.
3. Neo4j-compatible Bolt 5.x, exercised with `neo4j-driver` 6.0.1.
4. Admin `GET /healthz`, `/readyz`, and `/metrics` endpoints.

The HTTP request accepts query text, scalar/list parameters where supported,
cell and graph identifiers, page size/cursor, consistency mode, and causal
bookmark. Bearer authentication and `X-Graph-Namespace` scope authorization
were exercised. TLS is required by default in source configuration; plaintext
must be explicitly enabled for local development.

No first-party Node, Python, or Java SDK directory exists in the checkout. The
expected integration choices are HTTP/JSON or a Neo4j driver. This is a source
inspection finding, not a claim that no third-party client exists.

| Interface | Connect/create/query path | Auth and result format | Main limitation | Hackathon difficulty |
|---|---|---|---|---|
| HTTP | POST OpenCypher to `/v1/graphs/{graph}/query` | Bearer token + namespace header; typed JSON or NDJSON | Client unwraps tagged values and propagates bookmarks | LOW |
| Bolt | Neo4j driver to Bolt 5.x listener; use `session.run` | Basic credentials map to the configured token; driver records | Wrong-auth framing failed in JS driver; Cypher subset remains | MEDIUM |
| Batch ingestion | Parameterized `UNWIND` through HTTP/Bolt client service | Same transport auth; normal query response/bookmark | Narrow syntax and one-label matched endpoints | LOW-MEDIUM |
| Falkor importer | Rust example in source | In-process/example-specific | Present in source but not executed | MEDIUM/UNKNOWN |
| General query CLI | None found | N/A | Service binaries and examples are not a user query shell | N/A |
| First-party language SDK | None found in checkout | N/A | Use HTTP or a Neo4j driver | LOW with HTTP |

## Build and Deployment

**DOCUMENTED BUT NOT EXECUTED LOCALLY.** The official source workflow requires
Rust 1.91+, a C/C++ toolchain, `libcypher-parser`, SuiteSparse GraphBLAS, and
`RUST_MIN_STACK=33554432`. The `justfile` exports the native library paths and
provides smoke, test, benchmark, and runtime recipes. The source README gives a
Docker path and a local `cargo run --locked --features server-runtime --bin
graph-node` path. The Helm chart deploys query nodes, independent indexers,
object-store configuration, TLS, auth, network policy, and cache volumes.

The investigation could not compile from source because this environment had no
Rust/Cargo or native libraries and its Docker CLI was not connected to a daemon.
It instead ran the pinned published image filesystem directly. The runtime path
is therefore execution-verified; source build reproducibility remains
documented-but-unverified here.

## Benchmarks, Tests, and Extension Points

**VERIFIED IN SOURCE.** The repository includes OpenCypher compatibility/TCK
reporting, query correctness tests, Bolt and query benchmarks, object-store
smoke tests, a fencing worker, a Falkor importer, Helm deployment templates,
and runtime scripts. Extension points for a hackathon application are:

- graph schema and ingestion code outside HydraDB;
- HTTP or Bolt client integration;
- application-side ranking, conflict resolution, temporal policy, and abstention;
- optional use of native path procedures for bounded path retrieval;
- optional application-side vector/LLM components, with HydraDB retaining the
  relationship and provenance layer.

The application should treat HydraDB as a running service rather than embedding
the Rust kernel during a four-day build.
