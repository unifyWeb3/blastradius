Whole-viewport state for the two moments where there is no workspace to show.

```jsx
<FullScreenState busy icon="loader-circle" label="Loading incident" detail="GET /api/incidents" />
<FullScreenState tone="danger" icon="triangle-alert" label="Incident unavailable" detail="No incident fixture is available." />
```

Show the real failure text, not a friendly rewrite — and no fabricated incident data behind it.
