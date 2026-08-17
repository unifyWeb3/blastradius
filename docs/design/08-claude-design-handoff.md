# Claude Design Handoff

Use this document as the structural reference for a visual redesign of the
existing BlastRadius implementation. Improve clarity, hierarchy, polish, and
responsive composition without inventing functionality or changing the data
contract.

## Product

BlastRadius is a graph-first temporal supply-chain incident console. It answers
which application roots can reach a compromised exact package/version, shows the
hydrated dependency path returned by HydraDB, and evaluates whether all path
intervals overlap the selected incident window.

Current incident: `ua-parser-js@0.7.29`, advisory `GHSA-pjwm-rvh2-c87w` /
`CVE-2021-4229`. The application graph is a curated demonstration fixture; it
is not an ecosystem-scale crawler.

## User

Security, platform, or developer-infrastructure engineers responding to a
dependency compromise. They value a fast, defensible answer and need to see
the graph evidence rather than a similarity score or opaque assistant response.

## Core Workflow

1. The single `/` route loads the curated incident automatically.
2. The user reviews/edits UTC start and end fields.
3. The user runs **Analyze blast radius**.
4. The backend invokes HydraDB incoming bounded `algo.SSpaths` over `DEPENDS_ON`.
5. The UI shows exposed roots, topological candidates, graph nodes/edges, and
   query timing.
6. The user selects an application row or graph node.
7. The UI shows the ordered application-to-compromised-version path, every edge's
   evidence, and the exposure timeline/effective overlap.
8. The user may select an application and run **Check exposure** for an explicit
   exposed, outside-window, unresolved, or no-supporting-path result.

## Screen Map

There is one route and no router. Meaningful states are documented in
`02-screen-inventory.md` and include:

- initial loading;
- incident unavailable;
- pre-analysis workspace;
- analysis loading;
- successful graph workspace;
- selected path/timeline evidence;
- application-check results;
- controlled API/HydraDB error banner.

The incident overview is the sidebar of the same workspace, not a separate
screen. Do not add an incident picker or detail route unless separately
authorized.

## Component Map

Functional components:

- `App` (`src/client/App.tsx`) owns all state and endpoint calls;
- `BlastRadiusGraph` renders read-only React Flow and application selection;
- `DependencyPath` renders ordered nodes and evidence rows;
- `ExposureTimeline` renders interval bars and effective exposure;
- `buildGraphLayout` maps DTO graph semantics to visual nodes/edges.

Presentational/state helpers are `SummaryMetric`, `WorkspaceEmpty`,
`FullScreenState`, and `ExposureCheckResult`. Full details and safe restyling
boundaries are in `03-component-inventory.md`.

## Data Map

Keep the DTO contract in `05-data-display-contract.md` verbatim. In particular,
preserve:

- exact compromised package/version;
- affected roots versus topological candidates;
- ordered `nodes[]` and `relationships[]`;
- `DEPENDS_ON` direction and evidence;
- nullable dependency validity;
- requested, compromised, and effective windows;
- temporal status/reason;
- HydraDB engine/direction/caps and query timing;
- structured error codes/messages.

## Interaction Map

- Analyze is disabled during loading and when the window is invalid.
- A successful analysis auto-selects the first exposed root, otherwise the first
  candidate.
- Application rows and application graph nodes select the same path.
- Selected path edges are highlighted/animated; graph nodes are not draggable or
  connectable.
- Exposure check is disabled until analysis exists and returns three distinct
  domain outcomes. The current renderer visually conflates `unresolved` with
  outside-window; reserve a truthful uncertain treatment without changing the
  DTO or inventing evidence.
- Advisory links open external CVE/OSV sources in a new tab.
- HydraDB/API failures show an accessible dismissible alert and preserve the
  controlled empty-result behavior.

## Responsive Requirements

Preserve the existing desktop two-column workspace, intermediate evidence
stacking, and mobile sidebar-first layout. On mobile, summary metrics are a
two-column grid, graph/root inventory stack, and ordered paths scroll
horizontally inside their region. See `06-responsive-behavior.md`.

## Visual Priorities

1. Exact incident/package/version and current analysis action.
2. Exposed count, candidate count, and the graph showing direction/path.
3. Selected path evidence and temporal overlap/no-overlap decision.
4. HydraDB traversal attribution and timing.
5. Secondary metadata, scope note, and external references.

The graph and path evidence must be visually stronger than generic dashboard
decoration. Negative evidence must be as legible as positive exposure.

## Functional Constraints

Do not change API routes, DTOs, temporal rules, graph meaning, path order,
HydraDB traversal, product scope, or error/loading behavior. Do not replace the
graph with a table, hide it behind chat, or use static/mock data in place of the
HydraDB result. Do not add unsupported editing or query controls.

## Allowed Design Exploration

You may rethink typography, palette, spacing, panel grouping, graph styling,
status hierarchy, iconography, responsive composition, and subtle non-semantic
motion. Any new visual affordance must map to an existing action or state and
must not imply a capability the backend does not provide.

## Handoff Instructions

Start from the existing source and these documents. Produce a visual redesign
that is a drop-in presentation layer for the current product. Keep functional
components and contracts intact, validate every state listed in
`04-interaction-states.md`, and compare desktop/mobile behavior before handing
back implementation changes. If a proposed visual change requires changing a
DTO, endpoint, graph query, or temporal rule, stop and surface it as a product
decision rather than silently changing implementation semantics.
