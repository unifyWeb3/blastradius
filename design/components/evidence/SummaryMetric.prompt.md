One reading in the four-up summary band above the graph.

```jsx
<SummaryMetric label="Exposed applications" value={analysis.affectedRootCount} tone="danger" hint="affectedRoots[]" />
<SummaryMetric label="HydraDB query" value="50" unit="ms" hint="timing.hydraQueryMs" />
<SummaryMetric label="Traversal" value="incoming" hint="6 hop cap · algo.SSpaths" />
<SummaryMetric label="Exposed applications" value="—" />   {/* before analysis */}
```

Before an analysis exists every metric shows an em dash in faint grey — never a zero, which would read as a real negative result. `hint` carries the DTO field or query cap behind the number so the reading stays attributable.
