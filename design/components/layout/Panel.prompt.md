Wraps a workspace region — graph, root inventory, evidence, timeline.

```jsx
<Panel kicker="Incident graph" title="Transitive blast radius" meta="6 nodes · 5 edges">
  <GraphCanvas … />
</Panel>
<Panel kicker="Selected evidence path" title="Merchant Web" padded>…</Panel>
```

Panels are chassis: square corners, hairline borders, no shadow. Radius belongs to the objects inside them. Use `meta` for machine facts only (counts, timings) — never for prose.
