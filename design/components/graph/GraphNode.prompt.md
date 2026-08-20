A node on the blast-radius canvas.

```jsx
<GraphNode kind="application" status="exposed" name="Merchant Web" detail="production" clickable onSelect={select} selected />
<GraphNode name="request-ip@2.1.3" detail="v2.1.3" />
<GraphNode kind="compromised" name="ua-parser-js@0.7.29" detail="v0.7.29" />
<GraphNode name="agent-base@6.0.2" detail="v6.0.2" dimmed />
```

Visual hierarchy, in order: the compromised node is the only filled node; affected applications carry a status rail; intermediate dependencies are plain raised slabs; unrelated nodes are `dimmed`. Only application nodes are `clickable` — the graph is read-only, so never render a control that implies editing, expanding or connecting.
