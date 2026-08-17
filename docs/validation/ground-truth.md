# Ground-Truth Validation

Captured: 2026-08-17

## Scope

The selected incident is `GHSA-pjwm-rvh2-c87w` / `CVE-2021-4229`, embedded malware in `ua-parser-js@0.7.29`.

OSV and GitHub Advisory data establish that the selected version is affected. npm publication metadata establishes the fixture interval from the malicious release to the fixed `0.7.30` release:

```text
[2021-10-22T12:15:21.378Z, 2021-10-22T16:16:08.807Z)
```

The application dependency graph is curated ground truth for this 20-record fixture. It is not a measurement of real npm deployments.

## Expected Result

For the incident window:

```text
exposed: app:merchant-web
not exposed by time: app:admin-portal
no path: app:analytics-worker
```

## Returned Result

The clean HydraDB acceptance run returned:

```text
affected roots: app:merchant-web
admin portal: not_exposed / no_common_overlap
analytics worker: not_exposed / no_supporting_dependency_path
```

The Merchant Web result included the ordered hydrated path:

```text
app:merchant-web
  -> pkg:npm/@acme/commerce-sdk@3.4.0
  -> pkg:npm/request-ip@2.1.3
  -> pkg:npm/ua-parser-js@0.7.29
```

## Fixture Metrics

| Metric | Value |
|---|---:|
| Expected exposed roots | 1 |
| Returned exposed roots | 1 |
| True positives | 1 |
| False positives | 0 |
| False negatives | 0 |
| Fixture precision | 1.00 |
| Fixture recall | 1.00 |

These figures only establish correctness against the curated fixture. They are not global precision or recall claims.

## Evidence Classification

- Affected package/version: verified from OSV/GHSA data.
- Release-to-fixed timestamps: verified from npm registry metadata during the technical investigation.
- HydraDB affected set and hydrated path: verified by execution.
- Temporal classification and no-path classification: verified by execution and unit tests.
- Ecosystem-scale accuracy: unverified.
