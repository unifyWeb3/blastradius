# Component Inventory

Locations and behavior below reflect the current source tree. Restyling is
safe only where noted; data flow and interaction semantics remain functional
contracts.

## Core Functional

### `App`

- **Location:** `src/client/App.tsx`.
- **Responsibility:** owns incident loading, window input state, analysis state,
  selected application, exposure-check state, error state, and composition of
  every visible workspace section.
- **Important state:** `incident`, `analysis`, `selectedApplication`,
  `windowStart`, `windowEnd`, `analyzing`, `checking`, `checkResult`, `error`.
- **Dependencies:** `loadIncidents`, `analyzeIncident`,
  `checkApplicationExposure`; `BlastRadiusGraph`, `DependencyPath`,
  `ExposureTimeline`.
- **Restyle safety:** layout and visual treatment are safe to change; preserve
  handlers, disabled conditions, default selection, endpoint calls, and state
  transitions.

### `BlastRadiusGraph`

- **Location:** `src/client/components/BlastRadiusGraph.tsx`.
- **Props:** `analysis`, `selectedPath`, `onSelectApplication`.
- **Responsibility:** renders the analysis graph through React Flow and routes
  clicks on application nodes to selection.
- **Dependencies:** `buildGraphLayout`, `@xyflow/react`.
- **Core sensitivity:** node/edge direction, selected path highlighting,
  compromised styling, and application click behavior must remain intact.
- **Not implemented:** dragging, connecting, expanding, collapsing, editing,
  or user-created edges.

### `DependencyPath`

- **Location:** `src/client/components/DependencyPath.tsx`.
- **Props:** one `ExposurePathDto`.
- **Responsibility:** renders the ordered path and relationship evidence.
- **Core sensitivity:** node order is application -> dependency versions ->
  compromised version; each relationship row and validity interval is evidence.

### `ExposureTimeline`

- **Location:** `src/client/components/ExposureTimeline.tsx`.
- **Props:** one `ExposurePathDto`.
- **Responsibility:** renders compromise, dependency, and effective-overlap
  bars on a computed UTC time domain.
- **Core sensitivity:** effective exposure and no-overlap semantics must not be
  replaced by a decorative or inferred timeline.

## Layout / State Feedback

### `SummaryMetric` (local)

Displays a label/value pair for exposed roots, candidates, HydraDB latency, and
traversal. It accepts an optional danger tone.

### `WorkspaceEmpty` (local)

Displays either the pending-analysis state or the HydraDB-query loading state.
The `analyzing` prop controls icon, label, and sublabel.

### `FullScreenState` (local)

Used for initial loading and incident-unavailable failure. It accepts an icon,
label, and optional danger tone.

### `ExposureCheckResult` (local)

Maps the typed exposure-check union to three visible outcomes: exposed,
outside-window, and no-supporting-path. The no-path wording is an explicit
negative-evidence contract.

## Data / Presentation Helpers

### `buildGraphLayout`

- **Location:** `src/client/graph-layout.tsx`.
- **Responsibility:** maps DTO nodes/edges into React Flow nodes and edges,
  positions candidate paths in rows, and marks selected nodes/edges.
- **Sensitive semantics:** source/target direction, `DEPENDS_ON` labels,
  compromised node, candidate status classes, and selected path animation.

### Formatting helpers

- **Location:** `src/client/format.ts`.
- `formatUtc` renders UTC timestamps; `formatDuration` renders effective
  overlap length; datetime input helpers convert epoch milliseconds; latency is
  rendered as milliseconds or seconds.

### API client

- **Location:** `src/client/api.ts`.
- **Responsibility:** fetches incident catalog, submits analysis and exposure
  checks, parses stable JSON error bodies into `ApiError`.
- **Safe restyling:** none needed; do not rename endpoint payload fields.

## Functional Classification

Core functional: `App`, `BlastRadiusGraph`, `DependencyPath`,
`ExposureTimeline`, `buildGraphLayout`, API client.

Visual/presentational: `SummaryMetric`, icon choices, status badges, typography,
spacing, and CSS classes.

State/feedback: `WorkspaceEmpty`, `FullScreenState`, `ExposureCheckResult`, and
the error banner in `App`.
