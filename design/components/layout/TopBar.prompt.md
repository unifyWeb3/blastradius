The console's top bar. One per app.

```jsx
<TopBar traversal="incoming SSpaths" />
<TopBar compact />               {/* below 820px */}
```

The right-hand badge is engine attribution, not decoration: it names the real query contract (`HydraDB` / `incoming SSpaths`) and must keep matching `analysis.traversal`. Below 820px the descriptor and badge drop out and only the mark plus product name remain.
