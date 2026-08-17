# 04. Track Feasibility

This document evaluates technical feasibility only. It does not select a final
product.

## Track 1: Enterprise Context and Ontology

### Natural Graph Model

```text
(SourceSystem)-[:PRODUCED]->(Document)-[:ASSERTS]->(Claim)
(Claim)-[:ABOUT]->(Entity)
(Alias)-[:ALIAS_OF {confidence, method}]->(Entity)
(Person)-[:MEMBER_OF]->(Team)-[:PART_OF]->(Organization)
(Team)-[:WORKS_ON]->(Project)
(Claim)-[:SUPPORTED_BY]->(Evidence)
(Claim)-[:CONTRADICTS]->(Claim)
```

Keep source records and claims as first-class vertices rather than overwriting
entity properties. This preserves provenance and makes contradiction explicit.

### Technical Strengths

- **VERIFIED BY EXECUTION:** alias-to-canonical traversal, multi-hop
  person/team/project context, conflicting claim retrieval, and no-evidence rows.
- **VERIFIED IN SOURCE:** snapshot-consistent queries, property lookup planning,
  directed reverse adjacency, and native path procedures.
- Provenance paths are natural: an answer can return the exact document/claim/
  entity chain that supported it.
- Ontology edges can coexist with operational edges without join-table code.

### Weaknesses and Application Responsibilities

- Entity extraction, deduplication, fuzzy alias matching, and ontology alignment
  must happen before or during ingestion.
- Contradiction detection and trust/ranking policy are not database features.
- A 500,000-document corpus was not tested. Only 2,101 vertices/2,100 edges were
  measured locally.
- Full-text and vector retrieval were not verified as native HydraDB features.
  Document discovery may need an external text/vector component before graph
  neighborhood expansion.
- Broad analyst-authored Cypher is risky because the supported language is a
  deliberate subset.

### Graph-Native Advantage

Strong query pattern:

```text
alias -> canonical entity -> team -> project <- claim <- source document
```

This is stronger than vector similarity when the question depends on exact
organizational ownership and evidence lineage rather than textual resemblance.
A vector index might find documents mentioning Atlas, but it cannot by itself
prove that `A. Smith` maps to Alice, Alice belongs to Data, Data owns Atlas, and
the launch-date claim came from a specific source. A relational model can express
the joins, but evolving entity types and repeated provenance traversals require
more join tables and query-specific joins. HydraDB handled the explicit bounded
path well in the experiment.

### Fastest Credible Demo

**CORE**

- 5-8 vertex labels: source, document, claim, alias, person, team, project,
  organization.
- One deterministic JSON/CSV ingestion script using idempotent `UNWIND` batches.
- Three fixed parameterized queries: alias resolution, multi-hop ownership, and
  claim/provenance retrieval.
- API response that includes evidence paths and explicitly returns `no_evidence`
  when the graph returns zero supporting rows.
- A minimal graph/path view or table showing the returned chain.

**NICE-TO-HAVE**

- Precomputed contradiction edges.
- Confidence/source filters.
- External lexical/vector candidate retrieval followed by graph expansion.
- A small ontology browser.

**DO NOT BUILD**

- General-purpose enterprise ingestion connectors.
- Automatic ontology learning.
- Production-scale 500k document validation during the hackathon.
- Autonomous truth adjudication.
- A free-form Cypher console as the primary UX.

**Strongest demo query:** resolve an alias, traverse to the owned project, return
two conflicting claims with distinct sources, then visibly abstain from choosing
between them unless a declared policy applies.

**Wow moment:** the answer is accompanied by the exact multi-hop evidence path,
and an absent project produces an explicit no-evidence result rather than a
similar-looking document.

## Track 2: Repositories, Dependencies, and Code as Graphs

### Natural Dependency Model

```text
(Application)-[:RESOLVES_TO {lockfile, observed_at}]->(PackageVersion)
(PackageVersion)-[:DEPENDS_ON {range, source}]->(PackageVersion)
(PackageVersion)-[:VERSION_OF]->(Package)
(Advisory)-[:AFFECTS]->(PackageVersion)
(Maintainer)-[:MAINTAINS]->(Package)
(Repository)-[:BUILDS]->(Application)
```

For code graphs, add file, symbol, test, config, and service vertices with
`CALLS`, `IMPORTS`, `CONFIGURES`, `STARTS`, and `COVERED_BY` edges. Do not mix
package versions into one package vertex; blast radius is version-specific.

### Technical Strengths

- **VERIFIED BY EXECUTION:** version-specific nodes, fixed-id forward traversal,
  explicit two-hop explanations, maintainer relationships, and incoming native
  path traversal. A property-selected variable-length forward query was
  rejected, so query templates must resolve ids first.
- Dependency closure, shared maintainers, and explanation paths are graph-native
  and easy to show.
- Structured package metadata and lockfiles map cleanly to deterministic batch
  ingestion.
- No LLM is required for the dependency direction, reducing integration risk.

### Weaknesses and Application Responsibilities

- **HIGH:** transitive reverse variable-length `MATCH` failed. Blast-radius code
  must use `algo.SSpaths(... relDirection:'incoming' ...)` or store a deliberate
  reverse edge direction.
- Package registry APIs, lockfile parsers, semver range resolution, advisory
  matching, typosquat heuristics, and maintainer identity are external logic.
- Native paths can return many rows; `resultLimit`, hop bounds, and streaming are
  mandatory.
- The source supports a Cypher subset, so generated/ad-hoc coding-agent queries
  would require templates and validation.

### Graph-Native Advantage

Strong query pattern:

```text
vulnerable package version <- dependency* <- applications/services
```

The task is transitive reverse closure plus path explanation, not nearest-neighbor
retrieval. Vector similarity cannot determine whether an exact resolved version
is in a dependency chain or enumerate all affected roots. Relational recursive
CTEs can do it, but path hydration, multiple relationship types, version nodes,
maintainer/infrastructure expansion, and repeated neighborhood queries become
more cumbersome. HydraDB handled the critical closure through incoming
`SSpaths`, but not through the expected reverse OpenCypher `MATCH` syntax.

### Fastest Credible Dependency Demo

**CORE**

- Parse one or more real lockfiles plus a small pinned advisory list.
- Store application, package-version, advisory, and maintainer vertices.
- Use incoming `SSpaths` for affected-root discovery.
- Return every affected application with the exact dependency path.
- One small API endpoint and a path/list visualization.

**NICE-TO-HAVE**

- Shared maintainer or shared infrastructure expansion.
- Compare two lockfile snapshots.
- Typosquat candidate relationships computed outside HydraDB.
- Incremental re-ingestion of changed lockfiles.

**DO NOT BUILD**

- A complete npm/PyPI crawler.
- A new semver or lockfile resolver.
- Whole-repository AST/call graph extraction across many languages.
- An autonomous coding agent.
- Unbounded traversal or unrestricted user Cypher.

**Strongest demo query:** select a vulnerable exact version and enumerate all
affected applications with fully hydrated introduction paths.

**Wow moment:** one advisory expands through shared transitive dependencies into
an exact blast radius and explains why each application is affected.

### Fastest Credible Code-Graph Variant

Use one repository and one language with an existing parser. Extract only
symbols, imports/calls, tests, and startup/config edges. The strongest query is a
bounded change-impact path from a symbol through callers/services to tests. This
variant is credible but has more ingestion risk than lockfiles because AST and
dynamic-language resolution quality can consume the hackathon window.

## Track 3: Memory and Context Retrieval

### Natural Temporal Memory Model

```text
(Session)-[:ASSERTS {confidence, extracted_at}]->(Memory)
(Memory)-[:ABOUT]->(Subject)
(new Memory)-[:SUPERSEDES]->(old Memory)
(Session)-[:REVOKES {reason}]->(Memory)
(Memory)-[:SUPPORTED_BY]->(Utterance)
(Memory)-[:CONTRADICTS]->(Memory)
```

Store immutable assertions. Derive current truth through a declared query policy
instead of overwriting a single property.

### Technical Strengths

- **VERIFIED BY EXECUTION:** session provenance, validity periods, single-hop
  supersession/revocation relationships, conflicting current candidates,
  confidence ordering, guarded newer-only upsert, and empty evidence.
- Single-hop revision edges and source-session paths are easy to inspect and
  demo; longer chains need fixed-id/native-path queries.
- Retrieval can expand around people/projects/topics rather than relying only on
  semantically similar transcript chunks.
- The graph can return the evidence needed to justify an answer or abstention.

### Weaknesses and Application Responsibilities

- Transcript segmentation, fact extraction, entity linking, and embedding are
  outside HydraDB.
- HydraDB does not automatically select the latest valid fact, resolve equal-time
  conflicts, propagate revocation, or calibrate confidence.
- Chronological ordering is property-based application modeling, not a native
  temporal database feature.
- Testing did not approach 30-40 sessions or 115k tokens per question. Tokens
  belong to the LLM/retrieval layer, not the graph database.
- A memory system can look correct on hand-authored data and fail on extraction
  errors; the demo must keep source utterances visible.

### Graph-Native Advantage

Strong query pattern:

```text
question subject -> related memories -> revision/supersession chain
                 -> source sessions/utterances
```

Vector similarity can retrieve old and new statements together but does not
encode that one supersedes or revokes another. A graph query can retrieve the
revision chain and evidence lineage before ranking. Relational tables can model
this, but recursive revision paths and cross-entity neighborhood expansion are
less direct. HydraDB handled direct revision/evidence edges well; longer chains
must start from a fixed id or use a native path procedure. The application must
still implement temporal truth and abstention policy.

### Fastest Credible Demo

**CORE**

- 30-40 small sessions or a smaller transparent sample, transformed into
  immutable memory assertions with source links.
- Deterministic subject/entity identifiers.
- Explicit `SUPERSEDES`, `REVOKES`, and optional `CONTRADICTS` edges computed at
  ingestion time.
- Fixed retrieval queries for current candidates, full history, and evidence.
- Application rule: zero supporting rows or unresolved high-confidence conflict
  yields explicit abstention.

**NICE-TO-HAVE**

- Hybrid vector candidate search followed by graph temporal expansion.
- Confidence/source weighting.
- Timeline visualization.
- Evaluation questions with known missing answers.

**DO NOT BUILD**

- A general autonomous memory agent.
- Automatic truth inference without a visible rule.
- A custom embedding/vector engine.
- Large-scale token evaluation before the deterministic graph path works.
- Silent overwrite of previous memories.

**Strongest demo query:** ask for a fact that changed, return the latest valid
candidate plus its supersession/source path, then ask for a missing fact and
abstain.

**Wow moment:** the system explains not just what it remembers, but why an older
memory is no longer current and which session changed it.

## Relative Technical Feasibility

| Track shape | Smallest working ingestion | Critical HydraDB operation | Main risk | Technical execution difficulty |
|---|---|---|---|---|
| Enterprise context | Curated documents/claims/entities | Bounded pattern/provenance traversal | Entity resolution and corpus scale | MEDIUM-HIGH |
| Dependency graph | Lockfiles + small advisories | Incoming `SSpaths` closure | Query syntax and registry scope | LOW-MEDIUM |
| Repository code graph | One-language parser | Bounded impact paths | Static-analysis quality | HIGH |
| Temporal memory | Session-to-assertion transform | Revision/provenance traversal | Extraction and truth policy | MEDIUM |

This is feasibility, not a recommendation about market opportunity or judging
strategy.

## Cross-Track Ingestion Findings

| Track | Can insert directly | Must transform first | Bulk/incremental path | Main schema choice | Likely bottleneck |
|---|---|---|---|---|---|
| Enterprise | canonical entities, documents, claims, source metadata, explicit edges | parse records, extract/link entities, resolve aliases, identify claims/contradictions | proven `UNWIND` batches plus idempotent incremental upserts | immutable claims/source records versus mutable entity properties | extraction/entity resolution and volume, not the HTTP call itself |
| Dependency | normalized packages, exact versions, apps/services, advisories, maintainers | parse lockfiles, resolve exact versions/ranges, normalize ecosystems | proven `UNWIND` vertex then edge batches; replay by deterministic ids | package versus package-version identity and edge direction | registry/advisory acquisition and resolver correctness |
| Memory | sessions, utterances, extracted assertions, revision/source edges | segment transcripts, extract facts, link subjects, compute supersession/revocation | append assertions incrementally with bookmarks; guarded newer-only upsert is available | immutable assertion history and explicit current-truth policy | extraction quality and conflict policy |

Matched-endpoint edge batches should create vertices first, propagate the newest
bookmark, then create edges using the proven one-label `MATCH` form. The safest
recovery mechanism is deterministic ids plus replayable batches because no
cross-request transaction was verified.
