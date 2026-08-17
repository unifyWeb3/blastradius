# Screen Inventory

The application has one route (`/`). The entries below are implemented states
within that route, not separate routes or inferred future screens.

## 1. Initial Incident Loading

- **Location:** `/`, before `/api/incidents` resolves.
- **Purpose/user goal:** establish that the incident workspace is loading.
- **Visible content:** centered spinner and `Loading incident` label.
- **Actions/navigation:** none.
- **Backend dependency:** `GET /api/incidents`.
- **Responsive behavior:** full viewport state at every width.

## 2. Incident Unavailable

- **Location:** `/`, when incident loading fails or the catalog is empty.
- **Purpose:** communicate that the workspace cannot be used.
- **Visible content:** centered danger icon and the API/error message (or
  `Incident unavailable`).
- **Actions:** none in the current implementation.
- **Backend dependency:** failed `GET /api/incidents` or empty response.

## 3. Incident Workspace Before Analysis

- **Location:** `/` after incident load and before analysis.
- **Purpose:** review the incident and choose the analysis window.
- **Sidebar:** severity `Critical`, active status, advisory ID, package/version,
  incident title, CVE and OSV links; UTC start/end datetime inputs; analyze
  button; application selector/check button; data-scope note.
- **Workspace:** four summary metrics show em dashes; graph panel shows
  `Analysis pending` / `No graph result`; root inventory says `No analysis
  result`; evidence area says `No path selected`.
- **Primary action:** `Analyze blast radius`.
- **Secondary actions:** edit window, choose application, open advisory links.
- **Backend dependency:** incident catalog only until analysis is submitted.

## 4. Analysis Loading

- **Location:** same workspace while the blast-radius request is pending.
- **Visible content:** analyze button is disabled and changes to a spinner;
  graph empty state reads `Querying HydraDB` / `Incoming SSpaths traversal`.
- **Actions:** controls are disabled only where the current implementation
  disables them; no result is shown until the request resolves.
- **Backend dependency:** `POST /api/incidents/:id/blast-radius`.

## 5. Successful Analysis / Blast-Radius Workspace

- **Location:** `/` after a successful analysis.
- **Summary:** exposed application count, topological candidate count, HydraDB
  query latency, and `incoming · 6 hops` traversal summary.
- **Graph:** React Flow canvas with fixture nodes and edges in the demonstrated
  result; application roots, dependency versions, and the compromised version
  are visible.
- **Root inventory:** candidate application rows with status icon, name, hop
  count, and either `active exposure` or `outside window`.
- **Primary interactions:** select a row or application node; re-run analysis;
  use graph controls.
- **Backend dependency:** analysis DTO returned by the blast-radius endpoint.

## 6. Selected Path Evidence

- **Location:** lower evidence area after an application is selected (the first
  affected/candidate application is selected automatically when possible).
- **Path panel:** application name, temporal status label, horizontally
  scrollable ordered nodes, arrows, and one evidence row per `DEPENDS_ON`
  relationship with evidence text and interval.
- **Timeline panel:** compromise interval, each dependency interval, effective
  overlap when present, UTC axis, and duration/no-overlap label.
- **Actions:** select another candidate; horizontal scroll on narrow widths.
- **Backend dependency:** `candidateRoots[].paths[]` in the analysis response.

## 7. Application Exposure Check Result

- **Location:** application-check block in the left sidebar after **Check
  exposure**.
- **Positive:** `Exposed` and hop count.
- **Temporal negative:** `Not exposed in window` and no-common-overlap message.
- **No-path negative:** `Not exposed` and `No supporting dependency path found.`
- **Backend dependency:** `POST /api/exposure/check`; the button is disabled
  until an analysis exists.

## 8. Error Banner / HydraDB Outage

- **Location:** top of the analysis workspace after a failed request.
- **Visible content:** accessible `role="alert"` banner with the API's stable
  message and a dismiss `×` button. The graph/result remains empty when the
  analysis failed.
- **HydraDB behavior:** a HydraDB client failure maps to HTTP 502 and the
  message `HydraDB could not complete the graph operation.` The intentional
  browser smoke test verifies this state.
- **Actions:** dismiss the banner and retry the relevant action.

## Navigation

There is no route navigation, breadcrumb, modal, or separate detail page. The
only external navigation is opening the CVE and OSV advisory links in a new
browser tab.
