import { describe, expect, it } from "vitest";

import {
  fixtureNodes,
  fixtureRecords,
  fixtureRelationships,
  nodeByEntityId,
  uaParserJsIncidentFixture,
} from "./fixture.js";

describe("ua-parser-js incident fixture", () => {
  it("contains exactly 20 deterministic graph records", () => {
    expect(fixtureRecords()).toHaveLength(20);
    expect(fixtureNodes()).toHaveLength(12);
    expect(fixtureRelationships()).toHaveLength(8);
  });

  it("uses unique numeric node, relationship, and application identities", () => {
    const nodeIds = fixtureNodes().map((node) => node.id);
    const entityIds = fixtureNodes().map((node) => node.entityId);
    const relationshipIds = fixtureRelationships().map((relationship) => relationship.id);
    const edgeIds = fixtureRelationships().map((relationship) => relationship.edgeId);

    expect(new Set(nodeIds).size).toBe(nodeIds.length);
    expect(new Set(entityIds).size).toBe(entityIds.length);
    expect(new Set(relationshipIds).size).toBe(relationshipIds.length);
    expect(new Set(edgeIds).size).toBe(edgeIds.length);
  });

  it("references only fixture nodes from every relationship", () => {
    const nodeIds = new Set(fixtureNodes().map((node) => node.id));

    for (const relationship of fixtureRelationships()) {
      expect(nodeIds.has(relationship.sourceId)).toBe(true);
      expect(nodeIds.has(relationship.targetId)).toBe(true);
      expect(relationship.validWindow?.start ?? 0).toBeLessThanOrEqual(
        relationship.validWindow?.end ?? Number.MAX_SAFE_INTEGER,
      );
    }
  });

  it("preserves the OSV-backed compromised version and its exact incident window", () => {
    const compromised = nodeByEntityId(uaParserJsIncidentFixture.compromisedVersionEntityId);

    expect(compromised).toMatchObject({
      kind: "version",
      packageName: "ua-parser-js",
      version: "0.7.29",
      metadata: { incidentRole: "compromised" },
    });
    expect(compromised?.compromisedWindow).toEqual(uaParserJsIncidentFixture.incidentWindow);
    expect(uaParserJsIncidentFixture.advisoryId).toBe("GHSA-pjwm-rvh2-c87w");
  });

  it("contains two graph paths to the compromised version and one no-path application", () => {
    const dependencyEdges = fixtureRelationships().filter(
      (relationship) => relationship.relationshipType === "DEPENDS_ON",
    );

    expect(dependencyEdges.map((edge) => edge.edgeId)).toEqual([
      "merchant-web-depends-on-commerce-sdk-3.4.0",
      "commerce-sdk-depends-on-request-ip-2.1.3",
      "request-ip-depends-on-ua-parser-js-0.7.29",
      "admin-portal-depends-on-identity-sdk-2.7.1",
      "identity-sdk-depends-on-ua-parser-js-0.7.29",
      "analytics-worker-depends-on-analytics-sdk-1.8.0",
    ]);
  });
});
