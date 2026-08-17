# Hack Hydra 2026 — Product Decision

## Status

**LOCKED — Track 02, Direction A: Repos, Dependencies + Code as Graphs**

### Product
**BlastRadius — Temporal Supply-Chain Blast-Radius Analysis**

### Core thesis

A security tool that answers:

> **Which applications are transitively exposed to a compromised package/version, during what exposure window, and through exactly which dependency paths?**

The defining capability is **temporal + explainable dependency traversal**, not generic package search.

---

## Why this direction won

The strategic research independently ranked Track 02A first, ahead of Track 01 and Track 03, because it combines strong graph necessity, objective evaluation, demo impact, originality potential, and feasible scope. The technical investigation independently identified Track 2's lockfile dependency-graph direction as the easiest track and transitive blast radius as the strongest deep-HydraDB opportunity.

### Verified HydraDB fit

The HydraDB investigation proved, on the OSS property-graph interface:

- exact package/version identities can be represented;
- relationship predicates survive round-trip;
- incoming `SSpaths` can return complete hydrated dependency paths;
- structured validity intervals can be stored and filtered;
- repeated ingestion is predictable/idempotent for the tested fixture;
- HTTP JSON/NDJSON is a practical integration path.

These are the primitives the product will depend on.

### Critical architectural decision

**Do not use Context Graph `graph_payload` as the authoritative dependency-graph write path.**

The go/no-go spike found that it transforms identities, supports only free-form temporal text for the tested use case, and has no proven bridge to the verified `SSpaths` path.

The authoritative graph will therefore use the **verified OSS property-graph interface**.

---

## Product positioning

### We are NOT building

- a generic npm explorer;
- another dependency visualizer;
- a chatbot over package documentation;
- a full SCA replacement;
- a real-time ecosystem crawler;
- a full npm/PyPI graph;
- an autonomous security agent.

### We ARE building

A focused incident-analysis console where a security/platform engineer can select a compromised package version and immediately see:

1. affected application/root nodes;
2. exact dependency paths to each root;
3. whether the path was active during a defined time window;
4. supporting graph evidence;
5. optional relationship pivots such as maintainers/packages, only after the core is stable.

---

## MVP promise

A judge should be able to understand the product in one sentence:

> **“Give us a compromised dependency version; we compute the exact transitive blast radius and show the graph path that proves every affected application.”**

Temporal exposure is the differentiator:

> **“We can also ask which applications were exposed while that version was actually active.”**

---

## Core user

Primary:
- security engineer
- platform engineer
- developer-infrastructure / supply-chain defender

The product is optimized for incident response, not general dependency browsing.

---

## Core graph model

Minimum intended entities:

### Nodes
- `Package`
- `Version`
- `Application`
- `Maintainer` (optional for MVP-plus)
- `Advisory` (recommended)
- `Lockfile` (optional if time permits)

### Core edges
- `DEPENDS_ON`
- `RESOLVES_TO`
- `MAINTAINED_BY`
- `AFFECTED_BY`
- `COMPROMISED_IN` / equivalent explicit compromise relation

Exact final property names must follow the verified implementation and should not be invented before the execution spike validates them.

---

## Core graph property requirements

For dependency edges, preserve enough information to identify:

- package identity;
- exact version identity;
- dependency direction;
- source application/root;
- validity/exposure interval where available;
- source evidence / advisory reference where useful.

Temporal modeling must remain explicit.

The database does not automatically decide temporal truth; application policy does.

---

## Primary query

### Reverse transitive blast radius

Input:

- compromised package/version
- optional time window

Output:

- affected application/root nodes
- complete hydrated dependency path for each
- exposure evidence
- query timing

The implementation MUST use the verified incoming `SSpaths` mechanism for reverse transitive closure rather than relying on the tested-but-unsupported reverse variable-length OpenCypher `MATCH` shape.

---

## Secondary queries

Only after the primary query is stable:

### 1. Temporal exposure

> Which applications resolved/depended on the compromised version during the active window?

### 2. Evidence path

> Why is this application considered exposed?

Return the exact graph chain.

### 3. Shared-maintainer pivot

> Which related packages share a maintainer with the compromised package?

Only if the data and query are cheap to add.

### 4. Typosquat pivot

Only if inexpensive and clearly useful in the demo.

This is **not MVP-critical**.

---

## Success criteria

The product is successful when all of the following work on a clean machine:

- deterministic graph ingestion;
- exact package/version identities;
- exact dependency relationships;
- compromised-version selection;
- incoming transitive closure;
- hydrated explanation paths;
- temporal filtering;
- positive case;
- negative/no-exposure case;
- repeatable rebuild;
- clear UI/API representation;
- reproducible setup.

---

## Evaluation strategy

We should demonstrate quality against objective ground truth where practical, particularly OSV/GHSA advisory data.

The purpose is not to maximize benchmark complexity.

The purpose is to show:

- correctness;
- exact graph reasoning;
- explainability;
- useful latency;
- a product that is visibly impossible to replace with a simple vector similarity lookup.

---

## Demo thesis

The strongest demo should feel like incident response.

### Opening
A package/version is known to be compromised.

### Action
Select the compromised version.

### Core reveal
The graph expands from that version through incoming dependency relationships.

### Result
Affected applications are listed with exact paths.

### Temporal reveal
Move/select the relevant exposure window.

### Proof
Show the graph traversal/path evidence and the HydraDB query behind it.

### Optional wow moment
Pivot to shared maintainers or another relationship-based discovery.

---

## Scope lock

### MUST BUILD

- dependency graph ingestion;
- exact package/version model;
- compromised-version representation;
- reverse blast-radius query;
- path hydration/explanations;
- temporal representation/filtering;
- positive/negative cases;
- minimal but polished security console;
- reproducible setup;
- README;
- open-source license;
- demo video;
- submission package.

### SHOULD BUILD

- ground-truth comparison;
- latency display;
- graph visualization;
- advisory metadata;
- one secondary relationship pivot.

### MAY BUILD

- shared-maintainer pivot;
- typosquat neighborhood;
- richer incident timeline.

### MUST NOT BUILD

- full npm ecosystem;
- PyPI support before npm is complete;
- real-time registry streaming;
- autonomous agent;
- full IDE integration;
- broad crawler/connectors;
- multi-node/cloud deployment unless already operational;
- unrestricted Cypher interface;
- generic LLM chat as the primary UI;
- custom vector engine.

---

## Fallback

If a later implementation change breaks the verified property-graph path, do not silently redesign around an unverified mechanism.

Escalate the exact failure.

The strategic fallback is Track 01, but the default project remains locked to Track 02A unless a genuine technical blocker appears.
