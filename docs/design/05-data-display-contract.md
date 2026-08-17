# Data Display Contract

The frontend consumes the typed DTOs in `src/domain/blast-radius.ts`. Visual
changes must not rename, reinterpret, or silently omit these fields.

## Incident Catalog

`GET /api/incidents` returns `{ incidents: IncidentCatalogEntry[] }`.

| Field | Meaning | Required/display use |
|---|---|---|
| `id` | Curated incident identifier | Required for analysis route. |
| `title` | Incident title | Sidebar incident context. |
| `status` | Current catalog status (`active investigation`) | Status indicator. |
| `advisory.id` | Advisory identifier | Sidebar eyebrow. |
| `advisory.cve` | CVE label | External advisory link label. |
| `advisory.severity` | Current severity (`critical`) | Severity badge. |
| `advisory.sourceUrl`, `osvUrl` | Evidence links | External links; open in new tab. |
| `compromisedVersion.entityId` | Exact graph entity ID | Request payload and identity. |
| `ecosystem`, `packageName`, `version` | Exact compromised package/version | Primary incident heading. |
| `compromiseWindow.start/end` | UTC epoch-ms incident interval | Initial datetime values. |
| `applications[]` | Catalog application IDs/names | Exposure-check selector. |
| `dataScope` | Fixture scope statement | Sidebar scope note. |

## Analysis DTO

`POST /api/incidents/:id/blast-radius` accepts `compromisedVersion` and
`timeWindow`; it returns `{ analysis: BlastRadiusAnalysisDto }`.

| Field | Meaning | Required/display use |
|---|---|---|
| `compromisedVersion` | Hydrated exact target node | Graph target and incident identity. |
| `requestedWindow` | Window used for this analysis | Temporal context. |
| `affectedRoots` | Roots classified exposed | Count and status semantics. |
| `candidateRoots` | All roots with a supporting topological path, each with paths/status | Root inventory and selection. |
| `affectedRootCount` | Count of temporally exposed roots | Primary summary metric. |
| `candidateRootCount` | Count of topological candidates | Secondary summary metric. |
| `graph.nodes` | Hydrated nodes returned for visualization | Graph node labels/details. |
| `graph.relationships` | Hydrated edges returned for visualization | Graph direction/labels/evidence. |
| `traversal.engine` | `HydraDB algo.SSpaths` | Visible HydraDB attribution. |
| `traversal.direction` | `incoming` | Visible traversal contract. |
| `relationshipTypes` | `DEPENDS_ON` | Graph label/filter semantics. |
| `maxLength`, `pathCount`, `resultLimit` | Explicit query caps | Avoid implying unbounded search. |
| `timing.hydraQueryMs`, `totalMs` | Query and total timings | Latency metric/evidence. |

## Path DTO

Each `ExposurePathDto` contains:

- `pathId`: stable path identity;
- `application`: root node;
- `compromisedVersion`: exact target node;
- `nodes[]`: ordered application-to-target hydrated nodes;
- `relationships[]`: ordered `DEPENDS_ON` edges aligned to the path;
- `hopCount`: number of relationships;
- `temporal.status`: `exposed`, `not_exposed`, or `unresolved`;
- `temporal.requestedWindow`, `compromisedWindow`, optional `effectiveWindow`;
- `temporal.reason`: `no_common_overlap` or
  `missing_dependency_validity` when applicable.

## Node And Edge Fields

`DependencyNodeDto` fields are `entityId`, `kind`, `name`, optional `ecosystem`,
`packageName`, `version`, `repository`, and `environment`. The UI may choose a
compact label, but exact version identity and application metadata must remain
recoverable.

`DependencyEdgeDto` fields are `edgeId`, `relationshipType` (currently only
`DEPENDS_ON`), `sourceEntityId`, `targetEntityId`, `evidence`, and nullable
`validWindow`. A null validity interval is meaningful: temporal evaluation is
`unresolved`, not automatically exposed or not exposed.

## Exposure Check DTO

`POST /api/exposure/check` accepts `application`, `compromisedVersion`, and
`timeWindow`; it returns `{ result: ExposureCheckDto }`.

- `status: exposed` includes `reason: supporting_dependency_path` and a path.
- `status: not_exposed` includes either `no_supporting_dependency_path` with a
  null path or `no_common_overlap` with the topological path.
- `status: unresolved` includes `missing_dependency_validity` and a path.

These three negative/uncertain meanings must remain visually distinct.

The current `ExposureCheckResult` presentation does not yet distinguish
`unresolved` from the outside-window fallback. Treat that as a known rendering
gap, not permission to reinterpret `missing_dependency_validity` as temporal
non-overlap.

## Other Fixed API Endpoints

- `GET /api/incidents/:id` returns one catalog incident or a structured 404.
- `POST /api/exposure/path` accepts `application`, `compromisedVersion`, and an
  optional `timeWindow`, returning `{ path: ExposurePathDto | null }`.

The current SPA does not call these two endpoints directly. They remain part of
the implemented backend contract and must not be repurposed by a visual change.

## Formatting

Epoch milliseconds are formatted in UTC. Intervals are half-open `[start,end)`;
touching boundaries do not overlap. Latency is shown in milliseconds below one
second and seconds above it. Relationship evidence is source/lockfile-shaped
text and should not be rewritten as a generic confidence score.
