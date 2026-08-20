A `DEPENDS_ON` relationship rendered as evidence, one per hop.

```jsx
<EvidenceRow
  evidence="merchant-web package-lock.json resolved @acme/commerce-sdk@3.4.0"
  interval="Oct 01, 2021, 12:00:00 AM UTC → Oct 23, 2021, 12:00:00 AM UTC"
/>
<EvidenceRow evidence="@acme/identity-sdk@2.7.1 retained a dependency edge" />  {/* validWindow: null */}
```

Evidence text is source/lockfile-shaped and is printed in mono, verbatim — never paraphrased and never replaced by a confidence score. Omitting `interval` is meaningful, not lazy: it renders the hatched steel "validWindow: null" callout that tells the analyst why the temporal verdict is unresolved.
