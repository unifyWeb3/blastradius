The console's action control — `primary` is reserved for running the HydraDB analysis, one per screen.

```jsx
<Button variant="primary" icon="radar" block onClick={run}>Analyze blast radius</Button>
<Button variant="secondary" icon="search-check" block disabled={!analysis}>Check exposure</Button>
<Button variant="ghost" size="sm" icon="refresh-cw">Re-run</Button>
```

Variants: `primary` (red — analysis run / re-run), `secondary` (teal — supporting query such as the exposure check), `ghost` (hairline — toolbar actions), `quiet` (bare — dismiss). Use `loading` while a request is in flight; it swaps the leading glyph for a spinner and disables the control, matching the source's disabled-during-analysis contract. `block` is the sidebar default.
