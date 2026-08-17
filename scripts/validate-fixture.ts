import { fixtureNodes, fixtureRelationships, uaParserJsIncidentFixture } from "../src/graph/fixture.js";

const nodes = fixtureNodes();
const relationships = fixtureRelationships();
const nodeIds = new Set(nodes.map((node) => node.id));

if (uaParserJsIncidentFixture.records.length !== 20) {
  throw new Error(`Expected 20 fixture records, received ${uaParserJsIncidentFixture.records.length}.`);
}

for (const relationship of relationships) {
  if (!nodeIds.has(relationship.sourceId) || !nodeIds.has(relationship.targetId)) {
    throw new Error(`Relationship ${relationship.edgeId} references a missing node.`);
  }
}

console.log(
  JSON.stringify(
    {
      incident: uaParserJsIncidentFixture.id,
      advisory: uaParserJsIncidentFixture.advisoryId,
      records: uaParserJsIncidentFixture.records.length,
      nodes: nodes.length,
      relationships: relationships.length,
      compromisedVersion: uaParserJsIncidentFixture.compromisedVersionEntityId,
    },
    null,
    2,
  ),
);
