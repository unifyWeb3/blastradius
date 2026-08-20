A candidate root in the right-hand inventory. Clicking it selects the same path a graph-node click selects.

```jsx
{analysis.candidateRoots.map((c) => (
  <ApplicationRow
    key={c.application.entityId}
    name={c.application.name}
    status={c.status}
    hopCount={c.paths[0].hopCount}
    selected={c.application.entityId === selected}
    onSelect={() => setSelected(c.application.entityId)}
  />
))}
```

Render every candidate root, not just the exposed ones — the inventory is the difference between "topological candidate" and "exposed", and hiding candidates hides negative evidence. The selected row gets the raised surface plus a left rail in its own status colour.
