# 20-Row Incident Fixture

## Purpose

This fixture is the first deterministic BlastRadius graph. It is deliberately
small enough to inspect and replay exactly, but exercises the core incident
flow:

- a real compromised npm version;
- two topological paths to that version;
- one path active during the incident window;
- one path that exists but was only active after the fixed release;
- one application with no path to the compromised version while sharing the
  same package family through a fixed version.

## Incident Ground Truth

Selected incident:

```text
GHSA-pjwm-rvh2-c87w
CVE-2021-4229
Embedded malware in ua-parser-js
Affected npm version: ua-parser-js@0.7.29
```

Read-only OSV query performed on 2026-08-17 confirmed that
`ua-parser-js@0.7.29` is listed as malicious and fixed in `0.7.30`.

Read-only npm registry query performed on 2026-08-17 returned:

```text
0.7.29 published: 2021-10-22T12:15:21.378Z
0.7.30 published: 2021-10-22T16:16:08.807Z
```

The fixture's compromise interval is the half-open release-to-fixed interval:

```text
[2021-10-22T12:15:21.378Z, 2021-10-22T16:16:08.807Z)
```

The exact raw data source is intentionally limited to the selected advisory;
the graph's application and lockfile relationships are curated demonstration
data, not a claim about a real production deployment.

## Exact Record Count

The fixture contains exactly 20 records:

| Record type | Count |
|---|---:|
| Nodes | 12 |
| Relationships | 8 |
| Total | 20 |

Source: `src/graph/fixture.ts`.

## Graph Shape

```text
Merchant Web
  -> @acme/commerce-sdk@3.4.0
  -> request-ip@2.1.3
  -> ua-parser-js@0.7.29 [compromised]

Admin Portal
  -> @acme/identity-sdk@2.7.1
  -> ua-parser-js@0.7.29 [topological path, active after the incident]

Analytics Worker
  -> @acme/analytics-sdk@1.8.0

ua-parser-js package
  -> ua-parser-js@0.7.29

GHSA-pjwm-rvh2-c87w
  -> ua-parser-js@0.7.29
```

`Analytics Worker` is the mandatory no-evidence fixture. It shares the same
incident domain but has no `DEPENDS_ON` path to the compromised version.

## Identity Rules

- HydraDB numeric node ID: fixed fixture value, used by the verified bulk
  grammar and incoming `SSpaths`.
- Application-owned entity ID: stable canonical string such as
  `pkg:npm/ua-parser-js@0.7.29`.
- HydraDB relationship ID: fixed numeric value.
- Application-owned edge ID: stable descriptive string.

The canonical string is the portable identity. Numeric graph IDs are part of
the deterministic local fixture/projection and are not exposed as product
identities.

## Initial Temporal Intent

- Merchant Web's full dependency chain overlaps the malicious release window.
- Admin Portal has a graph path but both of its dependencies begin one
  millisecond after the fixed release timestamp; it must be classified as not
  exposed for the incident window.
- Analytics Worker has no supporting dependency path and must never be
  classified as exposed.

The application-level temporal policy and boundary tests are implemented in the
next query-contract milestone.
