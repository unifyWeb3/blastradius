import { describe, expect, it } from "vitest";

import { uaParserJsIncidentFixture } from "./fixture.js";
import { projectFixtureForHydra } from "./projection.js";

describe("HydraDB fixture projection", () => {
  it("preserves deterministic identities and exact relationship predicates", () => {
    const projection = projectFixtureForHydra(uaParserJsIncidentFixture);

    expect(projection.baseNodes).toHaveLength(12);
    expect(projection.relationships.DEPENDS_ON).toHaveLength(6);
    expect(projection.relationships.HAS_VERSION).toHaveLength(1);
    expect(projection.relationships.AFFECTS).toHaveLength(1);
    expect(projection.baseNodes.find((row) => row.vertex === 102)).toMatchObject({
      entity_id: "pkg:npm/ua-parser-js@0.7.29",
      kind: "version",
    });
  });

  it("projects the exact half-open incident interval onto the compromised version and advisory edge", () => {
    const projection = projectFixtureForHydra(uaParserJsIncidentFixture);
    const expected = uaParserJsIncidentFixture.incidentWindow;

    expect(projection.compromisedVersions).toEqual([
      {
        vertex: 102,
        compromised_start: expected.start,
        compromised_end: expected.end,
        incident_role: "compromised",
      },
    ]);
    expect(projection.relationships.AFFECTS[0]).toMatchObject({
      t_valid_start: expected.start,
      t_valid_end: expected.end,
    });
  });
});
