One node of the ordered evidence chain, laid out left→right with arrows between.

```jsx
<ChainNode index={1} role="application" name="Merchant Web" detail="github.com/acme/merchant-web" />
<ChainNode index={2} name="@acme/commerce-sdk@3.4.0" detail="pkg:npm/@acme/commerce-sdk@3.4.0" />
<ChainNode index={4} role="compromised" name="ua-parser-js@0.7.29" detail="pkg:npm/ua-parser-js@0.7.29" />
```

Order is fixed: application → dependency versions → compromised version. The compromised node is the only filled-red node in the chain. Keep `detail` as the raw entity ID for package versions and the repository for applications — exact identity must stay recoverable.
