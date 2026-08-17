# Interaction And State Contract

This document describes observable states that a redesign must preserve.

## State Table

| State | User sees | Available actions | Must remain true |
|---|---|---|---|
| Initial loading | Full-screen spinner, `Loading incident` | None | Do not display fabricated incident data. |
| Incident unavailable | Full-screen danger state and error text | None currently | Preserve the actual failure message. |
| Analysis pending | Incident sidebar, em dash metrics, `Analysis pending`, `No graph result`, `No path selected` | Edit window, open advisory links, analyze | No graph/result is implied before a query. |
| Analysis loading | Disabled analyze button, `Querying HydraDB`, `Incoming SSpaths traversal` | No duplicate submit | Loading is visibly attributable to the real HydraDB query. |
| Analysis success | Metrics, graph, candidate list, selected path when available | Select row/node, re-run, check application, graph zoom controls | Counts and paths come only from the returned DTO. |
| Exposed path selected | `Exposed in window`, ordered chain, evidence rows, effective timeline | Select another application | The compromised node and selected path remain distinguishable. |
| Outside-window path | `Outside window`, evidence path, `No overlap` timeline duration | Select another application, re-run | A topological path is not presented as active exposure. |
| Application check exposed | Sidebar status `Exposed`, hop count | Choose another application, check again | The returned path is the supporting evidence. |
| Application check temporal negative | `Not exposed in window`, no-common-overlap explanation | Check again | Do not collapse this into no-path. |
| Application check unresolved | The backend can return `unresolved`, but the current local renderer falls through to the outside-window presentation | Check again | This is an existing presentation gap; do not fake certainty or discard `missing_dependency_validity`. |
| Application check no path | `Not exposed`, `No supporting dependency path found.` | Check again | Never invent a path from shared package names. |
| Backend/HydraDB error | Alert banner, stable error text; failed graph remains empty | Dismiss, retry | Preserve the controlled 502/error state and do not show stale fabricated results. |
| Empty dataset/catalog | Current implementation falls into incident-unavailable state | None | Do not add an invented empty incident browser. |

## Input Rules

- Start and end are `datetime-local` controls rendered as UTC values.
- The client enables analysis only when both parse to finite epoch values and
  `start < end`.
- The backend also validates a non-empty half-open `[start, end)` interval.
- The application selector is populated from the incident catalog.
- Exposure check is disabled until a blast-radius analysis has completed.

## Selection Rules

- A successful analysis selects the first exposed root, or the first candidate
  if there is no exposed root.
- Clicking a candidate row or an application graph node changes the selected
  path.
- Graph nodes are not draggable or connectable.
- Selected path edges are animated/highlighted; unrelated graph edges remain
  neutral.

## Error Rules

The API exposes structured `{ error: { code, message, details? } }` JSON. A
HydraDB client failure maps to status 502 and a controlled user-facing message.
The UI displays the message in an accessible alert and provides dismissal; a
redesign must retain retryability through the relevant existing action.

The domain contract distinguishes `unresolved` from `not_exposed`, but the
current `ExposureCheckResult` component does not yet give `unresolved` distinct
copy. A visual handoff must reserve a truthful uncertain state without changing
the underlying status/reason fields.
