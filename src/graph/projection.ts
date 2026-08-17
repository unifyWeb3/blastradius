import type {
  GraphNodeFixture,
  GraphRelationshipFixture,
  IncidentFixture,
  RelationshipType,
} from "./types.js";

export interface HydraBaseNodeRow {
  vertex: number;
  entity_id: string;
  kind: string;
  name: string;
}

export interface HydraPackageNodeRow {
  vertex: number;
  ecosystem: string;
  package_name: string;
}

export interface HydraVersionNodeRow extends HydraPackageNodeRow {
  version: string;
}

export interface HydraCompromisedVersionRow {
  vertex: number;
  compromised_start: number;
  compromised_end: number;
  incident_role: string;
}

export interface HydraApplicationNodeRow {
  vertex: number;
  repository: string;
  environment: string;
}

export interface HydraAdvisoryNodeRow {
  vertex: number;
  advisory_id: string;
  severity: string;
  cve: string;
  osv: string;
  published_at: string;
}

export interface HydraRelationshipRow {
  relationship_vertex: number;
  edge_id: string;
  source: number;
  target: number;
  evidence: string;
  t_valid_start?: number;
  t_valid_end?: number;
}

export interface HydraFixtureProjection {
  baseNodes: HydraBaseNodeRow[];
  packageNodes: HydraPackageNodeRow[];
  versionNodes: HydraVersionNodeRow[];
  compromisedVersions: HydraCompromisedVersionRow[];
  applicationNodes: HydraApplicationNodeRow[];
  advisoryNodes: HydraAdvisoryNodeRow[];
  relationships: Record<RelationshipType, HydraRelationshipRow[]>;
}

export const projectFixtureForHydra = (fixture: IncidentFixture): HydraFixtureProjection => {
  const nodes = fixture.records.filter((record): record is GraphNodeFixture => record.recordType === "node");
  const relationships = fixture.records.filter(
    (record): record is GraphRelationshipFixture => record.recordType === "relationship",
  );

  return {
    baseNodes: nodes.map((node) => ({
      vertex: node.id,
      entity_id: node.entityId,
      kind: node.kind,
      name: node.name,
    })),
    packageNodes: nodes
      .filter((node) => node.kind === "package")
      .map((node) => ({
        vertex: node.id,
        ecosystem: required(node.ecosystem, node.entityId, "ecosystem"),
        package_name: required(node.packageName, node.entityId, "packageName"),
      })),
    versionNodes: nodes
      .filter((node) => node.kind === "version")
      .map((node) => ({
        vertex: node.id,
        ecosystem: required(node.ecosystem, node.entityId, "ecosystem"),
        package_name: required(node.packageName, node.entityId, "packageName"),
        version: required(node.version, node.entityId, "version"),
      })),
    compromisedVersions: nodes
      .filter((node) => node.compromisedWindow)
      .map((node) => ({
        vertex: node.id,
        compromised_start: node.compromisedWindow!.start,
        compromised_end: node.compromisedWindow!.end,
        incident_role: required(node.metadata?.incidentRole, node.entityId, "metadata.incidentRole"),
      })),
    applicationNodes: nodes
      .filter((node) => node.kind === "application")
      .map((node) => ({
        vertex: node.id,
        repository: required(node.metadata?.repository, node.entityId, "metadata.repository"),
        environment: required(node.metadata?.environment, node.entityId, "metadata.environment"),
      })),
    advisoryNodes: nodes
      .filter((node) => node.kind === "advisory")
      .map((node) => ({
        vertex: node.id,
        advisory_id: required(node.advisoryId, node.entityId, "advisoryId"),
        severity: required(node.severity, node.entityId, "severity"),
        cve: required(node.metadata?.cve, node.entityId, "metadata.cve"),
        osv: required(node.metadata?.osv, node.entityId, "metadata.osv"),
        published_at: required(node.metadata?.publishedAt, node.entityId, "metadata.publishedAt"),
      })),
    relationships: {
      DEPENDS_ON: relationshipRows(relationships, "DEPENDS_ON"),
      HAS_VERSION: relationshipRows(relationships, "HAS_VERSION"),
      AFFECTS: relationshipRows(relationships, "AFFECTS"),
    },
  };
};

const relationshipRows = (
  relationships: GraphRelationshipFixture[],
  relationshipType: RelationshipType,
): HydraRelationshipRow[] =>
  relationships
    .filter((relationship) => relationship.relationshipType === relationshipType)
    .map((relationship) => ({
      relationship_vertex: relationship.id,
      edge_id: relationship.edgeId,
      source: relationship.sourceId,
      target: relationship.targetId,
      evidence: relationship.evidence,
      ...(relationship.validWindow
        ? {
            t_valid_start: relationship.validWindow.start,
            t_valid_end: relationship.validWindow.end,
          }
        : {}),
    }));

const required = (value: string | undefined, entityId: string, field: string): string => {
  if (!value) {
    throw new Error(`Fixture entity ${entityId} is missing ${field}.`);
  }
  return value;
};
