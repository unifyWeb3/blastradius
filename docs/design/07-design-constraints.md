# Design Constraints

This is a structural handoff, not permission to expand the product.

## MUST PRESERVE

- BlastRadius's incident-response purpose and narrow Track 02A scope.
- The one-step core flow: incident -> window -> analysis -> graph -> exact path
  -> temporal decision.
- Exact compromised package/version identity.
- Affected-root count and separate topological-candidate count.
- HydraDB attribution, including incoming `algo.SSpaths` and explicit query
  timing/caps.
- Directed graph semantics: consumer/application points toward the dependency
  it resolved.
- Compromised, exposed, outside-window, selected, and neutral visual states.
- Hydrated path order, relationship labels, source evidence, and validity
  intervals.
- Half-open interval policy and the distinction between exposed,
  not-exposed-by-time, unresolved, and no-supporting-path.
- Loading, incident-unavailable, HydraDB error/502, empty, and retry states.
- Desktop and mobile access to the graph and evidence.

## MAY CHANGE

- Typography, color palette, spacing, borders, icon treatment, and density.
- Panel composition and visual hierarchy within the existing information
  architecture.
- Graph node/edge styling, labels, legends, and non-semantic animation.
- Responsive breakpoint choices if all current content and interactions remain
  usable.
- Presentational controls/tooltips, provided they do not imply unsupported graph
  editing or query functionality.

## MUST NOT CHANGE

- Backend routes, request fields, response DTO names, or error meanings.
- HydraDB query semantics or replacement of real traversal with mock/static data.
- Temporal policy, interval boundary behavior, or insertion-order assumptions.
- Graph direction, relationship meaning, path ordering, or exact identities.
- The fact that the graph is read-only: no editing, node creation, edge creation,
  drag-to-connect, or arbitrary Cypher.
- Product scope: no chat-first UX, crawler, PyPI support, IDE plugin, remediation
  workflow, generic package explorer, or unrequested secondary feature.
- The curated-data limitation or evidence provenance.

## Design Review Questions

Before accepting a redesign, verify that a user can still identify the
compromised version, trigger analysis, see affected roots, select a root, read
the complete path, understand the time overlap, and receive an explicit
no-evidence answer without opening a chat or hidden panel.
