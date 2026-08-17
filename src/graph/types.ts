export type NodeKind = "package" | "version" | "application" | "advisory";

export type RelationshipType = "DEPENDS_ON" | "HAS_VERSION" | "AFFECTS";

export interface TemporalInterval {
  start: number;
  end: number;
}

export interface GraphNodeFixture {
  recordType: "node";
  id: number;
  entityId: string;
  kind: NodeKind;
  name: string;
  ecosystem?: "npm";
  packageName?: string;
  version?: string;
  advisoryId?: string;
  severity?: "critical" | "high" | "medium" | "low";
  compromisedWindow?: TemporalInterval;
  metadata?: Record<string, string>;
}

export interface GraphRelationshipFixture {
  recordType: "relationship";
  id: number;
  relationshipType: RelationshipType;
  edgeId: string;
  sourceId: number;
  targetId: number;
  validWindow?: TemporalInterval;
  evidence: string;
}

export type GraphFixtureRecord = GraphNodeFixture | GraphRelationshipFixture;

export interface IncidentFixture {
  id: string;
  title: string;
  advisoryId: string;
  compromisedVersionEntityId: string;
  incidentWindow: TemporalInterval;
  records: readonly GraphFixtureRecord[];
}
