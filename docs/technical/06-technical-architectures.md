# 06. Technical Architectures

These are reusable implementation patterns, not product choices.

## 1. Deterministic Dependency Blast-Radius Analyzer

**Core data model**

```text
Application -[:RESOLVES_TO]-> PackageVersion -[:DEPENDS_ON]-> PackageVersion
PackageVersion -[:VERSION_OF]-> Package
Advisory -[:AFFECTS]-> PackageVersion
Maintainer -[:MAINTAINS]-> Package
```

**Critical HydraDB operations**

- `UNWIND` batch upserts for lockfile rows;
- property lookup by exact version id;
- incoming `algo.SSpaths` for reverse transitive closure;
- hydrated path output for explanations;
- pagination/NDJSON for large result sets.

**Application responsibilities**

- parse lockfiles;
- resolve semver and exact versions;
- normalize package names;
- import advisories and maintainer metadata;
- format path explanations and severity.

**External dependencies**: lockfile parsers and advisory data only.

**Complexity/risk**: LOW-MEDIUM; the reverse `MATCH` limitation is the main
risk and is already mitigated by native paths.

**Strongest use case**: exact vulnerable-version blast radius with a reason path.

## 2. Provenance-Aware Enterprise Context Graph

**Core data model**

```text
Source -[:PRODUCED]-> Document -[:ASSERTS]-> Claim -[:ABOUT]-> Entity
Alias -[:ALIAS_OF]-> Entity
Person -[:MEMBER_OF]-> Team -[:WORKS_ON]-> Project
Claim -[:SUPPORTED_BY]-> Evidence
```

**Critical HydraDB operations**

- alias -> canonical -> organizational context traversal;
- claim/evidence path retrieval;
- property and source/time filters;
- explicit zero-row no-evidence query;
- strong read for a user-facing answer when freshness matters.

**Application responsibilities**

- source ingestion and chunk identity;
- entity resolution and ontology mapping;
- claim extraction and contradiction edges;
- trust/confidence policy;
- answer generation and abstention.

**External dependencies**: document parsers, optional lexical/vector candidate
retrieval, and possibly an LLM.

**Complexity/risk**: MEDIUM-HIGH; ingestion and 500k-scale behavior are not
validated. The graph query itself is straightforward when bounded.

**Strongest use case**: explainable organizational context with exact evidence
lineage.

## 3. Temporal Memory Graph with Explicit Policy

**Core data model**

```text
Session -[:ASSERTS {confidence}]-> Memory
Memory -[:ABOUT]-> Subject
NewMemory -[:SUPERSEDES]-> OldMemory
Session -[:REVOKES]-> Memory
Memory -[:SUPPORTED_BY]-> Utterance
```

**Critical HydraDB operations**

- append-only `UNWIND` writes;
- validity/confidence property filtering;
- direct fixed-id supersession/revision traversal, using native paths for longer
  chains;
- source-session provenance;
- causal bookmarks for chronological ingestion.

**Application responsibilities**

- fact extraction and canonical subject ids;
- revision/revocation edge creation;
- temporal selection rule;
- conflict handling and abstention;
- optional vector candidate generation.

**External dependencies**: transcript parser, embeddings/vector store only if
hybrid search is desired, and an answer model.

**Complexity/risk**: MEDIUM. The graph model is simple, but semantic correctness
depends on extraction and policy tests.

**Strongest use case**: answer with current fact, revision chain, and source
session instead of silently returning the nearest transcript chunk.

## 4. Hybrid Candidate Retrieval plus Graph Expansion

**Core data model**

HydraDB stores canonical entities, claims/memories/dependencies, relationships,
source records, and compact embedding/document ids. A separate vector index
stores chunks or candidate ids.

**Critical HydraDB operations**

- exact id/property lookups after vector candidate selection;
- bounded neighborhood expansion;
- provenance or dependency path retrieval;
- no-evidence check against graph facts;
- causal/strong read according to freshness needs.

**Application responsibilities**

- embedding generation and vector search;
- candidate-to-graph id mapping;
- graph query templating and result ranking;
- conflict/temporal policy;
- final response generation.

**External dependencies**: vector database or in-process ANN library, embedding
model, and likely an LLM.

**Complexity/risk**: MEDIUM-HIGH. More moving parts, but useful when raw text
recall is required. HydraDB remains the relationship/provenance authority.

**Strongest use case**: retrieve semantically relevant candidates, then prove
relationship context and evidence through HydraDB.

## 5. Single-Repository Code Impact Graph

**Core data model**

```text
Repository -[:CONTAINS]-> File -[:DECLARES]-> Symbol
Symbol -[:CALLS|IMPORTS|READS_CONFIG]-> Symbol/Config
Test -[:COVERS]-> Symbol
Service -[:STARTS]-> EntryPoint
```

**Critical HydraDB operations**

- bounded caller/callee traversal;
- reverse incoming native paths where closure is needed;
- path explanation from changed symbol to service/test;
- property filters for language, file, branch, or commit.

**Application responsibilities**

- AST/static analysis extraction;
- dynamic import/config heuristics;
- commit/version identity;
- query templates and code rendering.

**External dependencies**: one-language parser and optional test coverage data.

**Complexity/risk**: HIGH in four days because extraction quality and dynamic
language behavior dominate the work.

**Strongest use case**: explain the bounded call/config/test path affected by a
change in one known repository.

## Shared Operational Pattern

All five architectures should use the same integration shell:

1. Start one pinned HydraDB node with a local durable store.
2. Run a schema/data smoke test and save the returned bookmark.
3. Ingest deterministic batches using proven `UNWIND` forms.
4. Execute only parameterized query templates.
5. Apply application policy to graph rows.
6. Stream or paginate path results and cap output.
7. Retain a small fixture dataset that can be rebuilt in under a minute.

This shell isolates HydraDB-specific risk from the application domain logic.
