# Responsive Behavior

The current responsive behavior is implemented in `src/client/styles.css` and
has two breakpoints. A redesign may improve composition while preserving the
same information priority and touch-safe interactions.

## Desktop (above 1100px)

- Top bar spans the viewport.
- Main layout is a two-column grid: approximately 285px incident sidebar and
  flexible analysis workspace.
- Summary metrics form one horizontal band.
- Graph row places the React Flow graph on the left and a roughly 270px root
  inventory on the right.
- Evidence row places path evidence beside the timeline.
- Graph canvas and pending state are 426px tall (490px row including toolbar).

## Intermediate Width (1100px and below)

- Sidebar narrows to 250px.
- Graph/root inventory columns narrow; root inventory remains alongside the
  graph.
- Evidence becomes a single column: path panel first, timeline below.

## Mobile (820px and below)

- Top bar keeps the mark and `BlastRadius` name; the descriptor and runtime
  HydraDB status are hidden.
- Sidebar becomes a full-width block above the analysis workspace.
- Scope note is hidden.
- Analysis workspace receives smaller horizontal padding.
- Summary metrics become a two-column grid and may wrap long values.
- Graph and pending canvas become a block 380px-tall region; root inventory
  stacks below it.
- Evidence path and timeline stack vertically.
- Dependency chain remains horizontally scrollable; node cards narrow to 135px.
- React Flow controls remain available for touch zoom/fit interaction.

## Responsive Invariants

- Incident identity, package/version, analysis action, graph, candidate roots,
  selected path, temporal evidence, and negative result remain reachable.
- Horizontal overflow in the ordered path is contained within the path region;
  it must not widen the page.
- Graph direction remains consumer/application -> dependency -> compromised
  version at every viewport.
- Error, loading, and no-evidence states remain visible and readable.
