# Hack Hydra Submission Draft

## Project

BlastRadius - Temporal Supply-Chain Blast-Radius Analysis

## Track

Track 02 - Repos, Dependencies + Code as Graphs

## Short Description

BlastRadius turns a compromised package version into an explainable incident graph. It uses HydraDB incoming path traversal to identify transitively affected applications, returns the exact dependency path behind every result, and applies an explicit temporal policy to determine whether each path was active during the incident window.

## How HydraDB Is Used

HydraDB is the authoritative property-graph store and traversal engine. The project deterministically ingests exact package/version/application nodes and exact dependency predicates through HydraDB's OSS HTTP interface. The core analysis invokes bounded incoming `algo.SSpaths` over `DEPENDS_ON` relationships and normalizes the returned hydrated paths for the UI. Relationship validity intervals are stored in HydraDB and evaluated by the application against the incident window.

## What Would Be Lost Without HydraDB

Without HydraDB, BlastRadius loses the core reverse transitive closure and hydrated path evidence that prove why each application is affected. A relational implementation would require recursive query machinery and manual path reconstruction; vector retrieval could find related advisory text but could not prove a directed, exact-version dependency chain.

## Evidence

- Real HydraDB clean ingestion and repeat ingestion passed.
- Incoming `SSpaths`, hydrated paths, temporal positive/negative cases, and no-path behavior passed.
- Restart persistence and re-query passed.
- Desktop and mobile browser smoke tests passed.
- A generated 10k graph measured 21.8 ms warm p50 and 36.0 ms warm p95 for the capped incoming traversal.

## Links To Fill Before Submission

- Public GitHub repository: PENDING
- Demo video: PENDING
- Deployed demo, if provided: PENDING
- Team member list: PENDING

## Honest Scope Statement

The submission demonstrates one curated npm incident and lockfile-shaped application graph. It is not a full package registry crawler or commercial SCA replacement. Advisory facts are grounded in OSV/GHSA/npm metadata; application paths are curated demonstration data.
