Labelled input for the UTC exposure-window fields.

```jsx
<Field label="UTC start" inputProps={{ type: "datetime-local", step: "0.001", value: start, onChange: onStart }} />
<Field label="UTC end" invalid hint="End must be after start" inputProps={{ type: "datetime-local", value: end }} />
```

Values are monospace by default. `invalid` + `hint` covers the one client validation the product has: the window must parse and `start < end`. Wrap a custom control by passing `children` instead of `inputProps`.
