/* Real values from the BlastRadius curated fixture (src/graph/fixture.ts) and the
   verified smoke run (docs/validation/browser-smoke-final/result.json).
   Nothing here is invented: entity IDs, evidence strings, intervals and timings
   are the ones the running product returns. */
const ms = (iso) => Date.parse(iso);

const maliciousWindow = { start: ms("2021-10-22T12:15:21.378Z"), end: ms("2021-10-22T16:16:08.807Z") };
const activeDuringIncident = { start: ms("2021-10-01T00:00:00.000Z"), end: ms("2021-10-23T00:00:00.000Z") };
const activeAfterFix = { start: ms("2021-10-22T16:16:09.000Z"), end: ms("2021-11-30T00:00:00.000Z") };

const incident = {
  id: "incident:ghsa-pjwm-rvh2-c87w",
  title: "Embedded malware in ua-parser-js@0.7.29",
  status: "active investigation",
  advisory: {
    id: "GHSA-pjwm-rvh2-c87w",
    cve: "CVE-2021-4229",
    severity: "critical",
    sourceUrl: "https://github.com/advisories/GHSA-pjwm-rvh2-c87w",
    osvUrl: "https://osv.dev/vulnerability/GHSA-pjwm-rvh2-c87w",
  },
  compromisedVersion: {
    entityId: "pkg:npm/ua-parser-js@0.7.29",
    ecosystem: "npm",
    packageName: "ua-parser-js",
    version: "0.7.29",
  },
  compromiseWindow: maliciousWindow,
  applications: [
    { entityId: "app:admin-portal", name: "Admin Portal" },
    { entityId: "app:analytics-worker", name: "Analytics Worker" },
    { entityId: "app:merchant-web", name: "Merchant Web" },
  ],
  dataScope: "curated demonstration fixture",
};

const node = (entityId, kind, name, extra) => ({ entityId, kind, name, ...extra });

const nodes = {
  adminPortal: node("app:admin-portal", "application", "Admin Portal", {
    repository: "github.com/acme/admin-portal",
    environment: "production",
  }),
  merchantWeb: node("app:merchant-web", "application", "Merchant Web", {
    repository: "github.com/acme/merchant-web",
    environment: "production",
  }),
  identitySdk: node("pkg:npm/@acme/identity-sdk@2.7.1", "version", "@acme/identity-sdk@2.7.1", {
    packageName: "@acme/identity-sdk",
    version: "2.7.1",
  }),
  commerceSdk: node("pkg:npm/@acme/commerce-sdk@3.4.0", "version", "@acme/commerce-sdk@3.4.0", {
    packageName: "@acme/commerce-sdk",
    version: "3.4.0",
  }),
  requestIp: node("pkg:npm/request-ip@2.1.3", "version", "request-ip@2.1.3", {
    packageName: "request-ip",
    version: "2.1.3",
  }),
  uaParser: node("pkg:npm/ua-parser-js@0.7.29", "version", "ua-parser-js@0.7.29", {
    packageName: "ua-parser-js",
    version: "0.7.29",
  }),
};

const edge = (edgeId, source, target, evidence, validWindow) => ({
  edgeId,
  relationshipType: "DEPENDS_ON",
  sourceEntityId: source,
  targetEntityId: target,
  evidence,
  validWindow: validWindow || null,
});

const adminPath = {
  pathId: "path:admin-portal",
  application: nodes.adminPortal,
  compromisedVersion: nodes.uaParser,
  nodes: [nodes.adminPortal, nodes.identitySdk, nodes.uaParser],
  relationships: [
    edge(
      "admin-portal-depends-on-identity-sdk-2.7.1",
      "app:admin-portal",
      "pkg:npm/@acme/identity-sdk@2.7.1",
      "admin-portal package-lock.json resolved @acme/identity-sdk@2.7.1 after the fixed release.",
      activeAfterFix,
    ),
    edge(
      "identity-sdk-depends-on-ua-parser-js-0.7.29",
      "pkg:npm/@acme/identity-sdk@2.7.1",
      "pkg:npm/ua-parser-js@0.7.29",
      "@acme/identity-sdk@2.7.1 retained a dependency edge after the compromise window.",
      activeAfterFix,
    ),
  ],
  hopCount: 2,
  temporal: {
    status: "not_exposed",
    reason: "no_common_overlap",
    requestedWindow: maliciousWindow,
    compromisedWindow: maliciousWindow,
    effectiveWindow: null,
  },
};

const merchantPath = {
  pathId: "path:merchant-web",
  application: nodes.merchantWeb,
  compromisedVersion: nodes.uaParser,
  nodes: [nodes.merchantWeb, nodes.commerceSdk, nodes.requestIp, nodes.uaParser],
  relationships: [
    edge(
      "merchant-web-depends-on-commerce-sdk-3.4.0",
      "app:merchant-web",
      "pkg:npm/@acme/commerce-sdk@3.4.0",
      "merchant-web package-lock.json resolved @acme/commerce-sdk@3.4.0",
      activeDuringIncident,
    ),
    edge(
      "commerce-sdk-depends-on-request-ip-2.1.3",
      "pkg:npm/@acme/commerce-sdk@3.4.0",
      "pkg:npm/request-ip@2.1.3",
      "@acme/commerce-sdk@3.4.0 package-lock.json resolved request-ip@2.1.3",
      activeDuringIncident,
    ),
    edge(
      "request-ip-depends-on-ua-parser-js-0.7.29",
      "pkg:npm/request-ip@2.1.3",
      "pkg:npm/ua-parser-js@0.7.29",
      "request-ip@2.1.3 lockfile resolution resolved ua-parser-js@0.7.29",
      activeDuringIncident,
    ),
  ],
  hopCount: 3,
  temporal: {
    status: "exposed",
    reason: null,
    requestedWindow: maliciousWindow,
    compromisedWindow: maliciousWindow,
    effectiveWindow: maliciousWindow,
  },
};

const analysis = {
  compromisedVersion: nodes.uaParser,
  requestedWindow: maliciousWindow,
  affectedRootCount: 1,
  candidateRootCount: 2,
  candidateRoots: [
    { application: nodes.adminPortal, status: "not_exposed", paths: [adminPath] },
    { application: nodes.merchantWeb, status: "exposed", paths: [merchantPath] },
  ],
  graph: {
    nodes: [
      nodes.adminPortal,
      nodes.identitySdk,
      nodes.uaParser,
      nodes.merchantWeb,
      nodes.commerceSdk,
      nodes.requestIp,
    ],
    relationships: [...adminPath.relationships, ...merchantPath.relationships],
  },
  traversal: { engine: "HydraDB algo.SSpaths", direction: "incoming", maxLength: 6, relationshipTypes: ["DEPENDS_ON"] },
  timing: { hydraQueryMs: 50, totalMs: 63 },
};

/* Exposure-check outcomes exactly as the running backend answers them for this fixture. */
const checkOutcomes = {
  "app:merchant-web": { status: "exposed", reason: "supporting_dependency_path", hopCount: 3 },
  "app:admin-portal": { status: "not_exposed", reason: "no_common_overlap", hopCount: 2 },
  "app:analytics-worker": { status: "not_exposed", reason: "no_supporting_dependency_path", hopCount: 0 },
};

/* ---- formatting, ported from src/client/format.ts ---- */
const formatUtc = (t) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(t);

const formatDuration = (w) => {
  const hours = (w.end - w.start) / 3600000;
  return hours >= 1 ? `${hours.toFixed(hours >= 10 ? 0 : 1)}h` : `${Math.round((w.end - w.start) / 60000)}m`;
};

const formatLatency = (v) => (v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${v.toFixed(0)}ms`);

const toDateTimeInput = (t) => new Date(t).toISOString().slice(0, 23);

Object.assign(window, {
  brIncident: incident,
  brAnalysis: analysis,
  brCheckOutcomes: checkOutcomes,
  brFormatUtc: formatUtc,
  brFormatDuration: formatDuration,
  brFormatLatency: formatLatency,
  brToDateTimeInput: toDateTimeInput,
});
