# Hack Hydra 2026 — Product Spec

## 1. Product Overview

**Name:** BlastRadius

**Track:** Track 02 — Repos, Dependencies + Code as Graphs

**Direction:** Supply-chain blast radius

**Primary user:** security/platform engineer responding to a compromised dependency

### Problem

Traditional dependency/security views often answer whether a package is vulnerable, but the incident-response question is relational:

> Which applications are transitively exposed, through what exact dependency chain, and during what period was the compromised version actually active?

This product makes that graph query the center of the experience.

---

## 2. Product Promise

A user selects a compromised package/version.

BlastRadius returns:

- affected application roots;
- exact dependency paths;
- exposure-window state;
- evidence used to classify the application as exposed.

The product must make the graph traversal visible and understandable.

---

## 3. User Flow

### Flow A — Investigate incident

1. Open BlastRadius.
2. Select an incident/advisory.
3. Select the compromised package/version.
4. Select or confirm an exposure window.
5. Run analysis.
6. View affected application count.
7. Select an affected application.
8. Inspect the hydrated dependency path.
9. Inspect evidence/metadata.
10. Optionally pivot to a related maintainer/package relationship.

### Flow B — Verify a clean application

1. Choose an application/root.
2. Run exposure analysis against the compromised version.
3. Receive:
   - exposed + path, or
   - not exposed / no supporting path.

The no-evidence state must be explicit.

---

## 4. Core Screens

### Screen 1 — Incident Overview

Purpose:
Make the security event understandable immediately.

Contains:
- compromised package/version;
- advisory/severity information where available;
- exposure window;
- affected application count;
- primary action: “Analyze blast radius”.

### Screen 2 — Blast-Radius View

Purpose:
Show the core HydraDB graph result.

Contains:
- compromised version node;
- expanding dependency graph;
- affected application/root nodes;
- count of affected roots;
- selected path details.

### Screen 3 — Path Evidence

Purpose:
Prove why an application is affected.

Contains:
- ordered dependency chain;
- relationship labels;
- version information;
- temporal evidence;
- source/advisory reference where applicable.

### Screen 4 — Application Exposure

Purpose:
Give a focused answer for one application.

Contains:
- application name;
- exposed/not-exposed status;
- dependency path;
- relevant versions;
- exposure interval;
- evidence.

### Optional Screen 5 — Relationship Pivot

Only build if the core is stable.

Contains:
- shared maintainer;
- related packages;
- or typosquat neighborhood.

---

## 5. Data Model

The minimum graph should represent exact dependency identity.

### Package

Suggested conceptual fields:
- package ID
- ecosystem
- package name

### Version

- version ID
- package ID
- version string
- publication/release metadata if available

### Application

- application ID
- application name
- repository/project identifier where available

### Advisory

- advisory ID
- source
- affected package/version
- disclosure/publication metadata

### Maintainer

Optional MVP-plus:
- maintainer ID
- maintainer identity

### Core relationships

`Package -> Version`

`Application -> Version/Package`

`Version -> Version` through dependency relationships

`Version -> Advisory`

Optional:

`Package -> Maintainer`

The actual storage schema must reflect the verified HydraDB API rather than this conceptual model verbatim.

---

## 6. Temporal Model

The product needs explicit temporal meaning.

At minimum distinguish:

- graph commit/storage time;
- dependency validity/exposure time;
- incident/compromise time.

Do not infer "current truth" from storage chronology alone.

Application code decides whether a path counts as exposed for a chosen window.

---

## 7. Core Queries

### Query 1 — Reverse blast radius

Input:
- compromised version
- hop/path constraints

Result:
- incoming affected roots;
- hydrated path(s).

### Query 2 — Temporal exposure

Input:
- compromised version;
- time window.

Result:
- paths whose relevant relationship interval overlaps the requested window.

### Query 3 — Evidence path

Input:
- affected root;
- compromised version.

Result:
- exact ordered chain.

### Query 4 — Negative case

Input:
- unaffected root;
- compromised version.

Result:
- explicit no-evidence/no-path outcome.

---

## 8. Backend Responsibilities

Backend must:

- load data;
- run validated HydraDB queries;
- enforce application-level temporal policy;
- normalize results;
- return stable frontend DTOs;
- expose only the small set of supported product operations.

Do not expose arbitrary database queries to the UI.

Prefer the verified HTTP integration path.

---

## 9. Frontend Responsibilities

Frontend must make the graph reasoning visible.

It should prioritize:

- incident context;
- affected count;
- graph/path visualization;
- evidence;
- temporal state;
- clear negative results.

Do not make an LLM chat box the primary experience.

---

## 10. Visual/Product Direction

Desired feel:

**security incident console**
rather than
**generic AI dashboard**.

The interface should feel:
- technical;
- calm under pressure;
- information-dense but readable;
- graph-first;
- evidence-first.

The graph is not decorative.

The graph is the explanation.

---

## 11. Acceptance Criteria

### Data
- [ ] deterministic fixture can be ingested twice without uncontrolled duplication;
- [ ] package/version identities remain exact;
- [ ] relationships remain queryable.

### Graph
- [ ] incoming `SSpaths` returns affected roots;
- [ ] hydrated paths are complete and ordered;
- [ ] path caps are explicit.

### Temporal
- [ ] validity/exposure intervals are stored;
- [ ] positive temporal case works;
- [ ] negative temporal case works;
- [ ] policy is enforced by application code.

### Product
- [ ] one-click incident analysis;
- [ ] affected count is visible;
- [ ] exact path is inspectable;
- [ ] negative/no-evidence result is explicit;
- [ ] graph is visible in the primary demo flow.

### Reliability
- [ ] clean restart succeeds;
- [ ] rebuild script succeeds;
- [ ] demo queries work from a fresh environment;
- [ ] no undocumented query syntax is required.

---

## 12. Demo Acceptance Criteria

A judge should be able to understand all of this in under three minutes:

1. what problem is being solved;
2. what was compromised;
3. which applications are exposed;
4. why those applications are exposed;
5. when they were exposed;
6. where HydraDB performed the core graph operation.

---

## 13. Non-Goals

This MVP does not attempt to:

- replace commercial SCA tooling;
- discover every package in every ecosystem;
- perform general vulnerability intelligence;
- provide autonomous remediation;
- produce a general-purpose dependency knowledge graph API;
- prove production-scale npm graph performance.
