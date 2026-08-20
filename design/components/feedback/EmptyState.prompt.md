Fills the graph canvas before and during an analysis.

```jsx
<EmptyState label="Analysis pending" sublabel="No graph result" />
<EmptyState busy label="Querying HydraDB" sublabel="Incoming SSpaths traversal" />
<EmptyState icon="circle-slash-2" label="No path selected" height={180} grid={false} />
```

The pending and querying states must stay distinguishable: pending is faint and static, querying spins in teal and names the real traversal. Neither may show a graph, a count, or a placeholder shape that could be mistaken for a result.
