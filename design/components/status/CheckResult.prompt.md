Renders one `POST /api/exposure/check` outcome in the sidebar.

```jsx
<CheckResult reason="supporting_dependency_path" hopCount={3} />
<CheckResult reason="no_common_overlap" />
<CheckResult reason="no_supporting_dependency_path" />
<CheckResult reason="missing_dependency_validity" />
```

Drive it from the DTO's `reason`, not its `status` — `reason` is what separates the two `not_exposed` cases. `missing_dependency_validity` gets the steel hatched treatment and the copy "Temporal result unresolved"; it must never fall through to the outside-window presentation. The raw reason code is printed under the message as evidence; hide it with `showReasonCode={false}` only in space-constrained embeds.
