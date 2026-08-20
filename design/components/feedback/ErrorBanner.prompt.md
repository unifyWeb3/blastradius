The controlled failure banner at the top of the analysis workspace.

```jsx
{error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}
```

Print the API's stable message verbatim — a HydraDB client failure is HTTP 502 with "HydraDB could not complete the graph operation." Never soften it, never retry silently, and never leave a stale result on screen behind it: the failed analysis stays empty and the user retries through the existing action.
