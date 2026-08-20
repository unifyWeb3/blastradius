The temporal verdict for a path. Four meanings that must stay visually distinct.

```jsx
<StatusPill status="exposed" />                 {/* red — "Exposed in window" */}
<StatusPill status="not_exposed" />             {/* amber — "Outside window" */}
<StatusPill status="unresolved" />              {/* steel + hatch — "Temporal evidence incomplete" */}
<StatusPill status="no_path" size="sm" />       {/* teal — "No supporting path" */}
```

Default copy is the contract wording; only override `label` when the surrounding sentence already carries the meaning. The `unresolved` pill is hatched on purpose — it is the one state the current implementation conflates with outside-window, and hatching plus the question glyph make "unknown" unmistakable at a glance and in greyscale.
