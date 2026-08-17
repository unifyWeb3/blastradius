# MVP Acceptance Evidence

Final acceptance sweep: 2026-08-17

## Static Gates

| Gate | Result |
|---|---|
| Fixture validation | PASS: 20 records, 12 nodes, 8 relationships |
| Unit/API tests | PASS: 21/21 |
| TypeScript | PASS |
| Production build | PASS |

## Real HydraDB Gates

Runtime:

```text
HydraDB OSS graph-node 0.1.0
single local node
HTTP property-graph API
fresh isolated object-store directory
```

| Gate | Result |
|---|---|
| Clean ingestion | PASS: 12 nodes, 8 relationships |
| Repeated ingestion | PASS: identical logical readback; counts remained 12/8 |
| Exact identities/predicates | PASS |
| Incoming reverse traversal | PASS: `algo.SSpaths`, `relDirection: incoming` |
| Hydrated paths | PASS |
| Temporal positive | PASS: Merchant Web exposed |
| Temporal negative | PASS: Admin Portal had no common overlap |
| No-path negative | PASS: Analytics Worker returned no supporting path |
| Restart and re-query | PASS against the same persisted store |

The acceptance query used explicit caps:

```text
maxLen: 6
pathCount: 50
resultLimit: 100
```

## Browser Gates

Desktop 1440x1000 and mobile 390x844 smoke tests passed against the clean HydraDB-backed server.

Verified states:

- incident loaded;
- empty analysis state;
- analysis loading message and disabled submit button;
- analysis action;
- visible six-node/five-edge graph result;
- affected count of one;
- selected Merchant Web path and temporal evidence;
- explicit HydraDB incoming traversal label;
- Analytics Worker no-evidence result;
- no browser console/runtime errors.

An intentional HydraDB transport outage was also tested. The API returned
`502`, the UI displayed `HydraDB could not complete the graph operation.` in an
accessible alert, and the graph remained empty. The browser logged the expected
failed `502` resource request but no uncaught runtime exception.

Artifacts:

- `docs/validation/browser-smoke-final/`
- `docs/validation/browser-smoke-mobile-final/`
- `docs/validation/browser-error-smoke/`

## Performance Gate

The 10k generated graph test passed. Results are recorded in `docs/validation/performance-10k/result.json`.

100k was not run because the 10k ingestion took 36 seconds and the remaining build time was better spent on correctness, restart, browser, and submission hardening. No 100k claim is made.

## Observed Risk

HydraDB emitted full-edge-scan planner warnings for several small count/readback queries. The critical `SSpaths` query still passed, and the 10k warm latency remained below 36 ms at p95 in the measured generated shape. Indexing and larger production shapes remain unverified.

The integration scripts assume a dedicated graph. If unrelated data already exists in the configured graph, the strict 12/8 clean-fixture count check fails intentionally. Use a fresh store or dedicated graph for acceptance and demos.
