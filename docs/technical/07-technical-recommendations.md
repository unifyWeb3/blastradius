# 07. Technical Recommendations

## Executive Technical Summary

**VERIFIED BY EXECUTION.** HydraDB is strongest here as a persistent,
snapshot-aware property graph for explicit directed relationships, bounded
multi-hop traversal, hydrated path explanations, provenance, and reverse
closure through its native path procedures. The HTTP interface is the shortest
integration path: typed JSON, NDJSON streaming, bearer authentication,
namespaces, bookmarks, consistency modes, pagination, and structured query
errors all worked.

With roughly four days remaining, a team can reliably build a single-node demo
that:

- transforms a bounded real dataset into deterministic vertices/relationships;
- ingests it with parameterized, idempotent `UNWIND` batches;
- exposes 3-6 fixed graph queries through a small backend;
- returns exact multi-hop paths and provenance;
- distinguishes no evidence from a positive result;
- optionally adds vector/LLM behavior outside HydraDB after the graph path is
  stable.

The core technical advantage should be an operation whose result is a path or
relationship-aware neighborhood, not merely key/value storage behind an LLM.
The most defensible examples are incoming dependency closure with explanation,
alias-to-organization-to-evidence traversal, and temporal revision/provenance
retrieval.

Do not rely on unrestricted OpenCypher, reverse transitive `MATCH`, user-managed
indexes, implicit write routing, automatic temporal truth, or automatic
abstention. These were either rejected, not exposed, or belong to application
logic.

## Repository Findings

**VERIFIED IN SOURCE.** HydraDB is a Rust/SlateDB graph database with object
storage as durable truth, disposable compute/cache nodes, one active writer per
cell, independent background indexers, snapshot-scoped queries, internal
property/reverse-adjacency planning, GraphBLAS-compatible sparse traversal, Bolt
5.x, and HTTP JSON/NDJSON.

The codebase is active and operationally ambitious, with a Helm chart,
observability, TCK/compatibility tooling, benchmarks, correctness tests, writer
fencing, and index lifecycle code. It is also early-stage: the source package
and runtime report `0.1.0`, while the image and Git tags are around `0.1.1`.
OpenCypher support is intentionally incomplete.

The tested source checkout is clean at commit
`6a2fbb192f37f51a93690a2ae2d2f5e27e6e4219`. The runtime image was pinned by
digest. No production app code existed or was modified.

## Verified Capabilities

**VERIFIED BY EXECUTION:**

- direct, one-hop, reverse one-hop, filtered, pattern, and bounded forward
  multi-hop queries;
- relationship properties, basic predicates, ordering, aggregation, optional
  match, and explicit projections;
- native `SPpaths`, `SSpaths`, and `MSpaths` with hydrated paths;
- alias/canonical and ontology-style relationships;
- conflicting claims with provenance;
- package-version dependency paths and maintainer relationships;
- validity, confidence, single-hop supersession/revocation, and source-session
  modeling;
- typed HTTP, NDJSON, pagination, bearer auth, namespace authorization,
  bookmarks, causal/strong reads, and restart persistence;
- normal Bolt reads through `neo4j-driver` 6.0.1;
- `UNWIND` batch ingestion and modest-scale reverse path queries.

**VERIFIED IN SOURCE:** internal property indexes/planner paths, snapshot pinning,
one-writer/many-reader coordination, object-store persistence, background CSC
index generation, Helm deployment, metrics/tracing, and benchmark tooling.

**NOT SUPPORTED OR VERIFIED AS LIMITED:** reverse transitive variable-length
`MATCH`, unbounded traversal, undirected patterns, `RETURN *`, several common
predicates, arbitrary `WITH`/`MERGE`/`UNWIND`, explicit cross-request
transactions, user-created indexes, native temporal conflict resolution, and
native abstention.

## Capability Matrix

The full evidence matrix is in `02-hydradb-capability-map.md`. The decision
subset is:

| Capability | Status | Decision consequence |
|---|---|---|
| Bounded forward traversal | VERIFIED BY EXECUTION | Safe core primitive when source id and hop cap are explicit |
| Incoming transitive closure | VERIFIED BY EXECUTION through `SSpaths` | Strong Track 2 primitive; do not use reverse variable-length `MATCH` |
| Hydrated path explanations | VERIFIED BY EXECUTION | Strong Best Use of HydraDB evidence |
| Provenance/claim modeling | VERIFIED BY EXECUTION | Strong Tracks 1 and 3 primitive |
| Temporal revision modeling | VERIFIED BY EXECUTION | Useful, but truth selection remains app logic |
| Empty-result evidence check | VERIFIED BY EXECUTION | Supports abstention, but app must enforce it |
| HTTP API | VERIFIED BY EXECUTION | Recommended hackathon integration interface |
| Bolt | VERIFIED BY EXECUTION with auth-error limitation | Optional; keep HTTP fallback |
| Batch ingestion | VERIFIED BY EXECUTION with narrow grammar | Credible for curated/medium demo data |
| Internal indexing | VERIFIED IN SOURCE | Measure exact queries; no index DDL plan |
| 500k-document scale | UNKNOWN | Do not claim without a new targeted run |
| Cloud/Kubernetes deployment | DOCUMENTED/SOURCE-VERIFIED, NOT EXECUTED | Avoid unless already operational |

## Track 1 Feasibility

**Technical strengths:** natural modeling of entities, aliases, teams, projects,
documents, claims, contradictions, and source evidence; explicit multi-hop
organizational context and provenance paths worked.

**Weaknesses:** entity resolution, ontology alignment, extraction, contradiction
policy, text retrieval, and 500k scale are outside the verified database path.

**Risk:** MEDIUM-HIGH. A curated evidence graph is credible; a broad enterprise
knowledge ingestion platform is not credible in four days.

**Smallest technically credible implementation:** ingest a bounded mixed-source
fixture, resolve deterministic aliases, store claims separately, run one
ownership/context traversal and one provenance query, and explicitly return
no-evidence for an absent subject.

## Track 2 Feasibility

**Technical strengths:** lockfiles/advisories are structured, package versions
map cleanly to vertices, incoming native paths provide exact blast radius, and
hydrated paths explain each affected application.

**Weaknesses:** reverse `MATCH` does not work for the expected query; semver,
registry ingestion, advisories, and typosquat logic are application concerns.

**Risk:** LOW-MEDIUM for a lockfile dependency analyzer; HIGH for a multi-language
repository/code graph.

**Smallest technically credible implementation:** parse a few real lockfiles,
ingest exact version edges, attach a small advisory set, run incoming `SSpaths`,
and show the affected roots plus each dependency path.

## Track 3 Feasibility

**Technical strengths:** immutable assertions, source sessions, confidence,
validity, supersession, revocation, conflict, and no-evidence behavior all map
cleanly and were queried.

**Weaknesses:** fact extraction, entity linking, current-truth selection,
conflict resolution, token-context assembly, and abstention are not automatic.

**Risk:** MEDIUM. The graph portion is straightforward; semantic evaluation
quality depends on the application layer.

**Smallest technically credible implementation:** ingest session-derived
assertions with source utterances, precompute revision/revocation edges, query
current candidates and evidence, and use a deterministic rule to abstain on
missing or unresolved conflicting evidence.

## Graph-Native Opportunities

### Exact Dependency Closure

Model exact versions and dependency edges, start at the vulnerable version, and
traverse incoming relationships to all roots. Vector similarity cannot prove
reachability or exact version resolution. HydraDB handled this well through
`SSpaths`, including path hydration and streaming.

### Relationship-Aware Enterprise Context

Traverse alias -> canonical person -> team -> project -> claim/document. Vector
retrieval can find mentions but cannot establish this exact ownership/evidence
chain. HydraDB handled the bounded pattern and provenance retrieval well.

### Temporal Revision and Evidence Chains

Traverse a subject's memories through `SUPERSEDES`, `REVOKES`, and source-session
edges. Vector search tends to retrieve old and new statements together without
their replacement semantics. HydraDB can return the explicit revision/evidence
graph; policy still decides which fact is current.

These are stronger technical uses than storing text chunks as disconnected
vertices and doing ordinary semantic search elsewhere.

## Integration Risks

The most dangerous issues are:

1. OpenCypher subset surprises breaking the headline query.
2. Reverse blast radius requiring native `SSpaths`, not reverse `MATCH`.
3. Single-writer ownership causing HTTP 421 on a non-owner node.
4. Runtime/toolchain setup, especially Rust/native dependencies and
   `RUST_MIN_STACK`.
5. One observed long-lived writer failure during partial bulk ingestion.
6. Bolt wrong-auth framing causing a driver `RangeError`.
7. Unverified enterprise scale and unexecuted S3/Kubernetes deployment.
8. Confusing application policy with database capability.

Mitigation is simple enough for a demo: pin the image, use one node and HTTP,
preload an idempotent fixture, propagate bookmarks, use only tested queries, cap
paths, preserve a rebuild script, and make policy visible.

## Recommended Technical Architectures

Five viable patterns are detailed in `06-technical-architectures.md`:

1. Deterministic dependency blast-radius analyzer.
2. Provenance-aware enterprise context graph.
3. Temporal memory graph with explicit policy.
4. Hybrid candidate retrieval plus graph expansion.
5. Single-repository code impact graph.

The first three have directly matching executed experiments. The hybrid pattern
adds retrieval flexibility but more integration risk. The code graph pattern is
technically valid but extraction-heavy.

## Fastest Demo Paths

| Track | Core | Nice-to-have | Do not build | Strongest demo moment |
|---|---|---|---|---|
| Enterprise | Curated entities/claims/provenance, fixed paths, no-evidence | contradiction edges, hybrid retrieval | broad connectors, automatic ontology, 500k claim | exact alias-to-project-to-source evidence path |
| Dependency | Lockfiles, exact versions, advisories, incoming `SSpaths` | maintainer/shared-infra expansion | registry crawler, new resolver, unrestricted Cypher | one advisory expands to all affected apps with paths |
| Memory | session assertions, revisions, evidence, abstention rule | vector candidates, timeline | autonomous memory agent, implicit truth | changed fact shows replacement/source chain; missing fact abstains |

## Technical Unknowns

- Source compilation and full test suite in this environment.
- S3-compatible object-store behavior under the selected deployment.
- Helm/Kubernetes rollout and write routing in the team's infrastructure.
- 10k, 100k, or 500k-scale ingestion and representative query latency.
- Indexer catch-up behavior during sustained hackathon ingestion.
- Exact automatic property-index planner thresholds and memory footprint.
- Behavior of other Neo4j driver versions and clean auth-error compatibility.
- Weighted path behavior on domain-specific data.
- Concurrent write throughput and safe retry behavior after timeouts.
- Full-text/vector support, which should be treated as external unless separately
  proven.

## Recommended Validation Order

After a product direction is selected, validate in this order:

1. Write the exact headline schema and query using a 20-row fixture.
2. Prove the positive, conflicting, and no-evidence cases through HTTP.
3. Prove idempotent ingestion and bookmark propagation on a clean node.
4. Scale only the critical graph shape to 10k-100k vertices/edges and record
   ingestion, cold, warm p50, and warm p95.
5. Restart over the final dataset and rerun the demo queries.
6. Validate the chosen deployment machine from image pull through API smoke.
7. Add vector/LLM/UI layers only after the graph query contract is frozen.
8. If multi-node deployment is necessary, validate write routing and retry before
   any other distributed feature.

## Self-Audit

1. HydraDB was actually run: **yes**.
2. Meaningful graph queries were executed: **yes**.
3. HTTP and Bolt were exercised rather than only read about: **yes**.
4. All three problem patterns were tested: **yes**.
5. Unsupported and limited operations were identified: **yes**.
6. Database behavior is separated from application policy: **yes**.
7. Concrete graph-native advantages were identified: **yes**.
8. High-risk integration issues have reproduction and mitigation: **yes**.
9. No final product was selected or built: **yes**.
10. The next engineer has an ordered validation list: **yes**.

## HANDOFF TO PRODUCT DECISION

1. **What HydraDB capabilities are strongest?** Bounded directed multi-hop
   traversal, incoming native path closure, hydrated path explanations,
   provenance/revision modeling, snapshot-scoped reads, durable local/object-store
   persistence, and a practical HTTP JSON/NDJSON interface.

2. **Which track appears technically easiest to execute?** Track 2's lockfile
   dependency-graph direction, because the input is structured and the core
   closure/explanation query is proven with incoming `SSpaths`. This is a
   technical-effort assessment, not a product recommendation.

3. **Which track has the strongest potential for deep HydraDB usage?** Track 2
   has the clearest unavoidable graph traversal in transitive blast radius.
   Tracks 1 and 3 can be equally deep when provenance and revision paths are core
   rather than decorative, but their ingestion/semantic layers are riskier.

4. **Which technical problems are most dangerous?** OpenCypher compatibility
   assumptions, reverse-closure query shape, single-writer routing, source/runtime
   setup, idempotent ingestion/bookmarks, unverified scale, and silently treating
   application conflict/temporal policy as HydraDB behavior.

5. **What should the next agent validate before product commitment?** The exact
   headline query and no-evidence branch on a 20-row fixture, followed immediately
   by a 10k-100k critical-shape scale run and a clean restart on the intended demo
   machine.

6. **What should we absolutely avoid building?** A broad connector/crawler
   platform, a custom parser/resolver/vector engine, unrestricted Cypher or an
   autonomous agent, multi-node/cloud complexity without prior infrastructure,
   and any demo whose HydraDB use is merely storing disconnected text chunks.
