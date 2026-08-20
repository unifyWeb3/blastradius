Dropdown for the application-check selector, populated from the incident catalog.

```jsx
<Select
  value={application}
  onChange={(e) => setApplication(e.target.value)}
  options={incident.applications.map((a) => ({ value: a.entityId, label: a.name }))}
/>
```

The console has exactly one select. Do not introduce dropdowns for package search or incident switching — neither exists in the product.
