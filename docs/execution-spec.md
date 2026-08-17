# Hack Hydra 2026 — Execution Spec

## 0. Mission

Build the smallest polished product that proves this statement:

> **BlastRadius uses HydraDB to compute and explain the temporal transitive blast radius of a compromised package/version.**

Do not broaden the mission.

---

# 1. Definition of Done

The project is DONE only when:

- [ ] deterministic dependency data is ingested;
- [ ] HydraDB is the authoritative graph store;
- [ ] package/version relationships are preserved;
- [ ] compromised version is represented;
- [ ] reverse transitive blast radius works;
- [ ] complete hydrated paths are shown;
- [ ] temporal exposure filtering works;
- [ ] positive and negative cases work;
- [ ] UI exposes graph reasoning clearly;
- [ ] setup is reproducible;
- [ ] tests cover the critical graph contract;
- [ ] README explains HydraDB's role and what the project loses without it;
- [ ] repo is public and OSS licensed;
- [ ] demo script works end-to-end;
- [ ] final video is <=3 minutes;
- [ ] submission form is complete.

---

# 2. Engineering Rules

## Rule 1 — HydraDB first

Do not build UI around mocked graph results once the real query contract is known.

Freeze the real graph query contract first.

## Rule 2 — Verified interfaces only

Use only APIs/query forms proven in the technical investigation.

Do not assume unrestricted OpenCypher.

For reverse transitive closure use the verified `SSpaths` mechanism.

## Rule 3 — Single-node simplicity

Use a single-node local deployment unless an already-working environment makes another deployment path safer.

Do not introduce multi-node routing.

## Rule 4 — HTTP as default integration path

Use the verified HTTP JSON/NDJSON path unless there is a demonstrated reason to switch.

Bolt is optional.

## Rule 5 — Deterministic ingestion

The data pipeline must be:
- scripted;
- repeatable;
- idempotent or explicitly rebuildable;
- deterministic.

## Rule 6 — No feature before core

Nothing new is added until:
- ingestion works;
- blast radius works;
- path evidence works;
- temporal case works;
- negative case works.

## Rule 7 — No invented product behavior

Every feature must trace to this execution spec.

---

# 3. Implementation Order

## Phase 0 — Baseline

Before coding:

- inspect current repository;
- preserve hackathon-start compliance;
- record current commit;
- ensure no pre-August-12 participant-authored work is mixed into the submission;
- establish build/run commands.

Deliverable:
`docs/validation/baseline.md`

---

## Phase 1 — Graph Contract

Implement the minimum graph schema.

Create:

- Package
- Version
- Application
- Advisory

Use:
- exact IDs;
- deterministic relationship identifiers;
- explicit dependency direction;
- temporal metadata.

Do not add maintainers or typosquats yet.

### Exit criteria

A 20-row fixture can be loaded and read back exactly.

---

## Phase 2 — Ingestion

Build the smallest deterministic importer.

Input:

A curated dependency dataset sufficient to demonstrate the product.

The data source may combine:
- resolved dependency information;
- lockfile-derived application relationships;
- OSV/GHSA advisory information.

Do not build a broad crawler.

### Requirements

- deterministic IDs;
- batching;
- safe retry;
- duplicate-safe behavior;
- clear logs;
- reproducible configuration.

### Exit criteria

Repeated ingestion produces the same logical graph.

---

## Phase 3 — Query Contract

Implement fixed server-side operations:

### `analyzeBlastRadius`

Input:
- compromised version ID;
- optional time window.

Output:
- affected roots;
- exact paths;
- evidence metadata;
- query timing.

### `getExposurePath`

Input:
- root/application;
- compromised version.

Output:
- ordered path;
- relationship details;
- temporal details.

### `checkExposure`

Input:
- application;
- compromised version;
- time window.

Output:
- exposed;
- not exposed;
- unresolved/error.

Do not expose arbitrary Cypher.

---

# 4. Critical Query Behavior

## Blast radius

Use incoming `SSpaths`.

Never replace the verified implementation with reverse variable-length OpenCypher `MATCH` merely because it looks more familiar.

### Must return

For every affected root:

```text
root
↓
dependency version
↓
dependency version
↓
...
↓
compromised version
```

Ordering must be stable.

---

# 5. Temporal Logic

Store the temporal facts needed for exposure evaluation.

Application policy decides:

```text
path is exposed
IF
dependency relationship was active
AND
compromised version was active/compromised
AND
requested window overlaps both
```

Do not hide this policy.

Document it.

Add tests for:

- overlap;
- before window;
- after window;
- open/closed boundary as chosen;
- conflicting temporal records if applicable.

---

# 6. Negative Case

This is mandatory.

Construct an application that:

- shares some packages with the exposed applications;
- does not have a path to the compromised version.

The UI must explicitly say:

**No supporting dependency path found.**

Do not convert empty evidence into a guessed answer.

---

# 7. Ground Truth

Use authoritative advisory information where practical.

Compare the system's affected set against the available ground truth.

At minimum record:

- expected affected set;
- returned affected set;
- false positives;
- false negatives.

Then calculate practical precision/recall where the fixture makes that meaningful.

Do not claim ecosystem-scale benchmark performance.

---

# 8. Backend Shape

Keep backend small.

Suggested responsibilities:

```text
/api/incidents
/api/incidents/:id/blast-radius
/api/exposure/check
/api/exposure/:application/:version
```

Exact routes may change, but the interface should remain narrow.

The backend owns:
- HydraDB connection;
- query execution;
- result normalization;
- temporal policy.

---

# 9. Frontend Shape

Minimum pages/views:

### `/`
Incident list / selected incident overview.

### `/incident/:id`
Blast-radius analysis.

### `/incident/:id/path/:app`
Evidence path view.

Keep navigation shallow.

---

# 10. UI Components

Minimum:

- IncidentHeader
- ExposureSummary
- BlastRadiusGraph
- AffectedApplications
- DependencyPath
- ExposureTimeline
- EvidencePanel
- EmptyEvidenceState
- QueryLatency

Do not create a massive design system.

Use simple reusable primitives.

---

# 11. Graph Visualization

The visualization must communicate:

- compromised node;
- dependency direction;
- affected roots;
- path selection;
- temporal state.

The graph should remain legible with the curated dataset.

Prefer:
- progressive expansion;
- selected-path highlighting;
- counts;
- compact labels.

Do not attempt to visualize thousands of nodes at once.

---

# 12. Optional Secondary Feature Gate

Only after the MVP is stable choose ONE:

- shared-maintainer pivot
- typosquat neighborhood

Never both unless implementation is effectively free.

The chosen feature must reuse the same graph and demonstrate another relationship traversal.

---

# 13. Testing

### Unit tests

- ID normalization
- graph transformation
- temporal overlap policy
- result normalization

### Integration tests

- fixture ingestion;
- reverse `SSpaths`;
- hydrated paths;
- negative case;
- restart/requery;
- repeat ingestion.

### UI checks

- incident loads;
- blast radius renders;
- selected path renders;
- no-evidence state renders;
- loading/error states render.

---

# 14. Performance Validation

Do not optimize blindly.

After the critical query is stable:

1. run the 10k target shape;
2. run the 100k target shape if practical;
3. record:
   - ingestion duration;
   - cold query latency;
   - warm p50;
   - warm p95;
   - restart behavior.

Report actual numbers.

If scale is not tested, say so.

---

# 15. Documentation

README must contain:

1. What BlastRadius is.
2. The threat/problem.
3. Why this is a graph problem.
4. How HydraDB is used.
5. What HydraDB does that is core to the product.
6. Architecture.
7. Setup.
8. Data ingestion.
9. Example analysis.
10. Test commands.
11. Limitations.
12. License.
13. Attribution.

Use a diagram showing:

```text
data sources
   ↓
normalization
   ↓
HydraDB graph
   ↓
SSpaths / temporal policy
   ↓
backend
   ↓
BlastRadius UI
```

---

# 16. Demo Script

Target 2:20–2:45, leaving safety margin under the 3-minute limit.

### 0:00–0:15
State the problem.

### 0:15–0:35
Introduce a compromised package/version.

### 0:35–1:20
Run blast-radius analysis.

Show:
- affected count;
- expanding graph;
- exact application path.

### 1:20–1:50
Show temporal exposure.

Answer:
"Which applications were exposed while the compromised version was active?"

### 1:50–2:10
Show negative/no-evidence case.

### 2:10–2:30
Show HydraDB query/path evidence.

### 2:30–2:45
Close with why HydraDB is essential.

Do not spend demo time on generic UI navigation.

---

# 17. Submission Hardening

Before submission:

- [ ] public GitHub repo;
- [ ] open-source license;
- [ ] no inaccessible dependencies;
- [ ] setup works from clean environment;
- [ ] demo URL works;
- [ ] deployed link works if provided;
- [ ] README complete;
- [ ] HydraDB usage clearly explained;
- [ ] all team members correctly listed;
- [ ] no participant-authored pre-August-12 work;
- [ ] final demo <=3 minutes;
- [ ] form submitted before August 20, 11:59 PM PT.

---

# 18. Time Budget Rules

The strategic report assumes roughly four days remain.

Treat the time budget as a hard constraint.

Priority order:

1. Core graph correctness
2. Temporal correctness
3. Path explanation
4. Product usability
5. Ground-truth validation
6. Visual polish
7. Secondary relationship feature
8. Anything else

When time becomes tight, cut in reverse order.

---

# 19. Stop Conditions

STOP FEATURE DEVELOPMENT when:

- core flow works end-to-end;
- restart works;
- negative case works;
- README is usable;
- demo can be recorded.

At that point switch to:

- bug fixing;
- test stabilization;
- UX cleanup;
- demo recording;
- submission.

Do not chase novelty at the expense of reliability.

---

# 20. Final Engineer Handoff

The implementation agent must report:

### BUILT
What now works.

### VERIFIED
What was tested against a real HydraDB instance.

### UNVERIFIED
What remains unproven.

### RISKS
What could still break.

### NEXT
The single highest-value next action.

No vague status reports.
