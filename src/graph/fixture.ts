import type {
  GraphFixtureRecord,
  GraphNodeFixture,
  GraphRelationshipFixture,
  IncidentFixture,
  TemporalInterval,
} from "./types.js";

const utcMillis = (value: string): number => Date.parse(value);

const maliciousWindow: TemporalInterval = {
  start: utcMillis("2021-10-22T12:15:21.378Z"),
  end: utcMillis("2021-10-22T16:16:08.807Z"),
};

const activeDuringIncident: TemporalInterval = {
  start: utcMillis("2021-10-01T00:00:00.000Z"),
  end: utcMillis("2021-10-23T00:00:00.000Z"),
};

const activeAfterFix: TemporalInterval = {
  start: utcMillis("2021-10-22T16:16:09.000Z"),
  end: utcMillis("2021-11-30T00:00:00.000Z"),
};

const nodes: readonly GraphNodeFixture[] = [
  {
    recordType: "node",
    id: 101,
    entityId: "pkg:npm/ua-parser-js",
    kind: "package",
    name: "ua-parser-js",
    ecosystem: "npm",
    packageName: "ua-parser-js",
  },
  {
    recordType: "node",
    id: 102,
    entityId: "pkg:npm/ua-parser-js@0.7.29",
    kind: "version",
    name: "ua-parser-js@0.7.29",
    ecosystem: "npm",
    packageName: "ua-parser-js",
    version: "0.7.29",
    compromisedWindow: maliciousWindow,
    metadata: { incidentRole: "compromised" },
  },
  {
    recordType: "node",
    id: 103,
    entityId: "pkg:npm/ua-parser-js@0.7.30",
    kind: "version",
    name: "ua-parser-js@0.7.30",
    ecosystem: "npm",
    packageName: "ua-parser-js",
    version: "0.7.30",
    metadata: { incidentRole: "fixed" },
  },
  {
    recordType: "node",
    id: 104,
    entityId: "advisory:GHSA-pjwm-rvh2-c87w",
    kind: "advisory",
    name: "Embedded malware in ua-parser-js",
    advisoryId: "GHSA-pjwm-rvh2-c87w",
    severity: "critical",
    metadata: {
      cve: "CVE-2021-4229",
      osv: "GHSA-pjwm-rvh2-c87w",
      publishedAt: "2021-10-22T20:38:14Z",
    },
  },
  {
    recordType: "node",
    id: 105,
    entityId: "app:merchant-web",
    kind: "application",
    name: "Merchant Web",
    metadata: { repository: "github.com/acme/merchant-web", environment: "production" },
  },
  {
    recordType: "node",
    id: 106,
    entityId: "pkg:npm/@acme/commerce-sdk@3.4.0",
    kind: "version",
    name: "@acme/commerce-sdk@3.4.0",
    ecosystem: "npm",
    packageName: "@acme/commerce-sdk",
    version: "3.4.0",
  },
  {
    recordType: "node",
    id: 107,
    entityId: "pkg:npm/request-ip@2.1.3",
    kind: "version",
    name: "request-ip@2.1.3",
    ecosystem: "npm",
    packageName: "request-ip",
    version: "2.1.3",
  },
  {
    recordType: "node",
    id: 108,
    entityId: "app:admin-portal",
    kind: "application",
    name: "Admin Portal",
    metadata: { repository: "github.com/acme/admin-portal", environment: "production" },
  },
  {
    recordType: "node",
    id: 109,
    entityId: "pkg:npm/@acme/identity-sdk@2.7.1",
    kind: "version",
    name: "@acme/identity-sdk@2.7.1",
    ecosystem: "npm",
    packageName: "@acme/identity-sdk",
    version: "2.7.1",
  },
  {
    recordType: "node",
    id: 110,
    entityId: "app:analytics-worker",
    kind: "application",
    name: "Analytics Worker",
    metadata: { repository: "github.com/acme/analytics-worker", environment: "production" },
  },
  {
    recordType: "node",
    id: 111,
    entityId: "pkg:npm/@acme/analytics-sdk@1.8.0",
    kind: "version",
    name: "@acme/analytics-sdk@1.8.0",
    ecosystem: "npm",
    packageName: "@acme/analytics-sdk",
    version: "1.8.0",
  },
  {
    recordType: "node",
    id: 112,
    entityId: "pkg:npm/agent-base@6.0.2",
    kind: "version",
    name: "agent-base@6.0.2",
    ecosystem: "npm",
    packageName: "agent-base",
    version: "6.0.2",
  },
];

const relationships: readonly GraphRelationshipFixture[] = [
  {
    recordType: "relationship",
    id: 1001,
    relationshipType: "HAS_VERSION",
    edgeId: "pkg-ua-parser-js-has-0.7.29",
    sourceId: 101,
    targetId: 102,
    evidence: "npm package identity for ua-parser-js@0.7.29",
  },
  {
    recordType: "relationship",
    id: 1002,
    relationshipType: "AFFECTS",
    edgeId: "ghsa-pjwm-rvh2-c87w-affects-ua-parser-js-0.7.29",
    sourceId: 104,
    targetId: 102,
    validWindow: maliciousWindow,
    evidence: "OSV/GHSA-pjwm-rvh2-c87w lists ua-parser-js@0.7.29 as malicious.",
  },
  {
    recordType: "relationship",
    id: 1003,
    relationshipType: "DEPENDS_ON",
    edgeId: "merchant-web-depends-on-commerce-sdk-3.4.0",
    sourceId: 105,
    targetId: 106,
    validWindow: activeDuringIncident,
    evidence: "merchant-web package-lock.json resolved @acme/commerce-sdk@3.4.0",
  },
  {
    recordType: "relationship",
    id: 1004,
    relationshipType: "DEPENDS_ON",
    edgeId: "commerce-sdk-depends-on-request-ip-2.1.3",
    sourceId: 106,
    targetId: 107,
    validWindow: activeDuringIncident,
    evidence: "@acme/commerce-sdk@3.4.0 package-lock.json resolved request-ip@2.1.3",
  },
  {
    recordType: "relationship",
    id: 1005,
    relationshipType: "DEPENDS_ON",
    edgeId: "request-ip-depends-on-ua-parser-js-0.7.29",
    sourceId: 107,
    targetId: 102,
    validWindow: activeDuringIncident,
    evidence: "request-ip@2.1.3 lockfile resolution resolved ua-parser-js@0.7.29",
  },
  {
    recordType: "relationship",
    id: 1006,
    relationshipType: "DEPENDS_ON",
    edgeId: "admin-portal-depends-on-identity-sdk-2.7.1",
    sourceId: 108,
    targetId: 109,
    validWindow: activeAfterFix,
    evidence: "admin-portal package-lock.json resolved @acme/identity-sdk@2.7.1 after the fixed release.",
  },
  {
    recordType: "relationship",
    id: 1007,
    relationshipType: "DEPENDS_ON",
    edgeId: "identity-sdk-depends-on-ua-parser-js-0.7.29",
    sourceId: 109,
    targetId: 102,
    validWindow: activeAfterFix,
    evidence: "@acme/identity-sdk@2.7.1 retained a dependency edge after the compromise window.",
  },
  {
    recordType: "relationship",
    id: 1008,
    relationshipType: "DEPENDS_ON",
    edgeId: "analytics-worker-depends-on-analytics-sdk-1.8.0",
    sourceId: 110,
    targetId: 111,
    validWindow: activeDuringIncident,
    evidence: "analytics-worker package-lock.json resolved @acme/analytics-sdk@1.8.0",
  }
];

export const uaParserJsIncidentFixture: IncidentFixture = {
  id: "incident:ghsa-pjwm-rvh2-c87w",
  title: "Embedded malware in ua-parser-js@0.7.29",
  advisoryId: "GHSA-pjwm-rvh2-c87w",
  compromisedVersionEntityId: "pkg:npm/ua-parser-js@0.7.29",
  incidentWindow: maliciousWindow,
  records: [...nodes, ...relationships],
};

export const fixtureNodes = (): readonly GraphNodeFixture[] => nodes;

export const fixtureRelationships = (): readonly GraphRelationshipFixture[] => relationships;

export const fixtureRecords = (): readonly GraphFixtureRecord[] => uaParserJsIncidentFixture.records;

export const nodeByEntityId = (entityId: string): GraphNodeFixture | undefined =>
  nodes.find((node) => node.entityId === entityId);
