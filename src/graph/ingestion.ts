import type { HydraDbClient } from "../hydradb/client.js";
import { hydraScalar, requireNumber, requireString } from "../hydradb/values.js";
import { projectFixtureForHydra } from "./projection.js";
import type { IncidentFixture, RelationshipType } from "./types.js";

const BASE_NODE_QUERY =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.entity_id = row.entity_id, n.kind = row.kind, n.name = row.name";
const PACKAGE_NODE_QUERY =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.ecosystem = row.ecosystem, n.package_name = row.package_name";
const VERSION_NODE_QUERY =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.ecosystem = row.ecosystem, n.package_name = row.package_name, n.version = row.version";
const COMPROMISED_VERSION_QUERY =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.compromised_start = row.compromised_start, n.compromised_end = row.compromised_end, n.incident_role = row.incident_role";
const APPLICATION_NODE_QUERY =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.repository = row.repository, n.environment = row.environment";
const ADVISORY_NODE_QUERY =
  "UNWIND $rows AS row MERGE (n {id: row.vertex}) SET n:DependencyNode, n.advisory_id = row.advisory_id, n.severity = row.severity, n.cve = row.cve, n.osv = row.osv, n.published_at = row.published_at";

const RELATIONSHIP_QUERIES: Record<RelationshipType, string> = {
  DEPENDS_ON:
    "UNWIND $rows AS row MATCH (s:DependencyNode {id: row.source}), (t:DependencyNode {id: row.target}) MERGE (s)-[r:DEPENDS_ON {id: row.relationship_vertex}]->(t) SET r.edge_id = row.edge_id, r.evidence = row.evidence, r.t_valid_start = row.t_valid_start, r.t_valid_end = row.t_valid_end",
  HAS_VERSION:
    "UNWIND $rows AS row MATCH (s:DependencyNode {id: row.source}), (t:DependencyNode {id: row.target}) MERGE (s)-[r:HAS_VERSION {id: row.relationship_vertex}]->(t) SET r.edge_id = row.edge_id, r.evidence = row.evidence",
  AFFECTS:
    "UNWIND $rows AS row MATCH (s:DependencyNode {id: row.source}), (t:DependencyNode {id: row.target}) MERGE (s)-[r:AFFECTS {id: row.relationship_vertex}]->(t) SET r.edge_id = row.edge_id, r.evidence = row.evidence, r.t_valid_start = row.t_valid_start, r.t_valid_end = row.t_valid_end",
};

export interface IngestionSummary {
  nodeCount: number;
  relationshipCount: number;
  relationshipCounts: Record<RelationshipType, number>;
  bookmark?: string;
}

export interface LogicalGraphReadback {
  nodes: Array<{ entityId: string; kind: string; name: string }>;
  versions: Array<{ entityId: string; packageName: string; version: string }>;
  relationships: Array<{
    relationshipType: RelationshipType;
    edgeId: string;
    sourceEntityId: string;
    targetEntityId: string;
    evidence: string;
    validStart: number | null;
    validEnd: number | null;
  }>;
}

export const ingestIncidentFixture = async (
  client: HydraDbClient,
  fixture: IncidentFixture,
): Promise<IngestionSummary> => {
  const projection = projectFixtureForHydra(fixture);

  await client.query("ingest-base-nodes", BASE_NODE_QUERY, { rows: projection.baseNodes });
  await ingestRows(client, "ingest-package-details", PACKAGE_NODE_QUERY, projection.packageNodes);
  await ingestRows(client, "ingest-version-details", VERSION_NODE_QUERY, projection.versionNodes);
  await ingestRows(
    client,
    "ingest-compromised-version-details",
    COMPROMISED_VERSION_QUERY,
    projection.compromisedVersions,
  );
  await ingestRows(client, "ingest-application-details", APPLICATION_NODE_QUERY, projection.applicationNodes);
  await ingestRows(client, "ingest-advisory-details", ADVISORY_NODE_QUERY, projection.advisoryNodes);

  for (const relationshipType of ["DEPENDS_ON", "HAS_VERSION", "AFFECTS"] as const) {
    await ingestRows(
      client,
      `ingest-${relationshipType.toLowerCase()}`,
      RELATIONSHIP_QUERIES[relationshipType],
      projection.relationships[relationshipType],
    );
  }

  return readIngestionSummary(client);
};

export const readLogicalGraph = async (client: HydraDbClient): Promise<LogicalGraphReadback> => {
  const nodesResult = await client.query(
    "readback-nodes",
    "MATCH (n:DependencyNode) RETURN n.entity_id AS entity_id, n.kind AS kind, n.name AS name ORDER BY entity_id",
  );
  const versionsResult = await client.query(
    "readback-versions",
    "MATCH (n:DependencyNode) WHERE n.kind = 'version' RETURN n.entity_id AS entity_id, n.package_name AS package_name, n.version AS version ORDER BY entity_id",
  );

  const relationships: LogicalGraphReadback["relationships"] = [];
  for (const relationshipType of ["DEPENDS_ON", "HAS_VERSION", "AFFECTS"] as const) {
    const result = await client.query(
      `readback-${relationshipType.toLowerCase()}`,
      relationshipReadbackQuery(relationshipType),
    );
    for (const row of result.response.rows) {
      const temporal = relationshipType === "HAS_VERSION" ? { validStart: null, validEnd: null } : {
        validStart: numberOrNull(hydraScalar(row[4]), "t_valid_start"),
        validEnd: numberOrNull(hydraScalar(row[5]), "t_valid_end"),
      };
      relationships.push({
        relationshipType,
        sourceEntityId: requireString(hydraScalar(row[0]), "source_entity_id"),
        targetEntityId: requireString(hydraScalar(row[1]), "target_entity_id"),
        edgeId: requireString(hydraScalar(row[2]), "edge_id"),
        evidence: requireString(hydraScalar(row[3]), "evidence"),
        ...temporal,
      });
    }
  }

  return {
    nodes: nodesResult.response.rows.map((row) => ({
      entityId: requireString(hydraScalar(row[0]), "entity_id"),
      kind: requireString(hydraScalar(row[1]), "kind"),
      name: requireString(hydraScalar(row[2]), "name"),
    })),
    versions: versionsResult.response.rows.map((row) => ({
      entityId: requireString(hydraScalar(row[0]), "entity_id"),
      packageName: requireString(hydraScalar(row[1]), "package_name"),
      version: requireString(hydraScalar(row[2]), "version"),
    })),
    relationships: relationships.sort((left, right) => left.edgeId.localeCompare(right.edgeId)),
  };
};

const readIngestionSummary = async (client: HydraDbClient): Promise<IngestionSummary> => {
  const nodeCount = await readCount(
    client,
    "count-nodes",
    "MATCH (n:DependencyNode) RETURN count(*) AS count",
  );
  const relationshipCounts = {
    DEPENDS_ON: await readCount(
      client,
      "count-depends-on",
      "MATCH ()-[:DEPENDS_ON]->() RETURN count(*) AS count",
    ),
    HAS_VERSION: await readCount(
      client,
      "count-has-version",
      "MATCH ()-[:HAS_VERSION]->() RETURN count(*) AS count",
    ),
    AFFECTS: await readCount(client, "count-affects", "MATCH ()-[:AFFECTS]->() RETURN count(*) AS count"),
  };

  return {
    nodeCount,
    relationshipCount: Object.values(relationshipCounts).reduce((sum, count) => sum + count, 0),
    relationshipCounts,
    bookmark: client.lastBookmark,
  };
};

const readCount = async (client: HydraDbClient, operation: string, query: string): Promise<number> => {
  const result = await client.query(operation, query);
  return requireNumber(hydraScalar(result.response.rows[0]?.[0]), `${operation}.count`);
};

const ingestRows = async (
  client: HydraDbClient,
  operation: string,
  query: string,
  rows: unknown[],
): Promise<void> => {
  if (rows.length > 0) {
    await client.query(operation, query, { rows });
  }
};

const relationshipReadbackQuery = (relationshipType: RelationshipType): string => {
  const temporalProjection =
    relationshipType === "HAS_VERSION"
      ? "RETURN s.entity_id AS source_entity_id, t.entity_id AS target_entity_id, r.edge_id AS edge_id, r.evidence AS evidence"
      : "RETURN s.entity_id AS source_entity_id, t.entity_id AS target_entity_id, r.edge_id AS edge_id, r.evidence AS evidence, r.t_valid_start AS t_valid_start, r.t_valid_end AS t_valid_end";
  return `MATCH (s:DependencyNode)-[r:${relationshipType}]->(t:DependencyNode) ${temporalProjection} ORDER BY edge_id`;
};

const numberOrNull = (value: string | number | boolean | null, field: string): number | null =>
  value === null ? null : requireNumber(value, field);
