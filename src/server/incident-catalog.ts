import { fixtureNodes, uaParserJsIncidentFixture } from "../graph/fixture.js";

export interface IncidentCatalogEntry {
  id: string;
  title: string;
  status: "active investigation";
  advisory: {
    id: string;
    cve: string;
    severity: "critical";
    sourceUrl: string;
    osvUrl: string;
  };
  compromisedVersion: {
    entityId: string;
    ecosystem: "npm";
    packageName: string;
    version: string;
  };
  compromiseWindow: { start: number; end: number };
  applications: Array<{ entityId: string; name: string }>;
  dataScope: "curated demonstration fixture";
}

export const incidentCatalog: readonly IncidentCatalogEntry[] = [
  {
    id: uaParserJsIncidentFixture.id,
    title: uaParserJsIncidentFixture.title,
    status: "active investigation",
    advisory: {
      id: "GHSA-pjwm-rvh2-c87w",
      cve: "CVE-2021-4229",
      severity: "critical",
      sourceUrl: "https://github.com/advisories/GHSA-pjwm-rvh2-c87w",
      osvUrl: "https://osv.dev/vulnerability/GHSA-pjwm-rvh2-c87w",
    },
    compromisedVersion: {
      entityId: uaParserJsIncidentFixture.compromisedVersionEntityId,
      ecosystem: "npm",
      packageName: "ua-parser-js",
      version: "0.7.29",
    },
    compromiseWindow: uaParserJsIncidentFixture.incidentWindow,
    applications: fixtureNodes()
      .filter((node) => node.kind === "application")
      .map((node) => ({ entityId: node.entityId, name: node.name }))
      .sort((left, right) => left.name.localeCompare(right.name)),
    dataScope: "curated demonstration fixture",
  },
];

export const incidentById = (incidentId: string): IncidentCatalogEntry | undefined =>
  incidentCatalog.find((incident) => incident.id === incidentId);
