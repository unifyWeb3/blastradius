Live-state dot with an uppercase label.

```jsx
<StatusDot tone="active" label="Active investigation" />
<StatusDot tone="healthy" label="Connected" pulse={false} />
```

`tone="active"` (red) is the incident's catalog status. `tone="healthy"` (teal) is the HydraDB runtime state in the top bar. Turn `pulse` off for anything historical — a pulsing dot claims the state is live.
