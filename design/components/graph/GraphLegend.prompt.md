Key for the graph's node and edge semantics — sits in the graph toolbar or under the canvas.

```jsx
<GraphLegend keys={["compromised", "exposed", "not_exposed", "selected", "edge"]} />
<GraphLegend direction="column" />
```

Show only the keys the current result actually contains: a legend entry for a state that is not on screen implies the analysis found something it did not.
