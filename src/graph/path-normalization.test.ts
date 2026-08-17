import { describe, expect, it } from "vitest";

import type { HydraPath } from "../hydradb/types.js";
import { normalizeApplicationPath } from "./path-normalization.js";

const hydratedPath = (edgeWindow: { start: number; end: number }): HydraPath => ({
  nodes: [
    {
      id: 2,
      labels: ["DependencyNode"],
      properties: {
        entity_id: { String: "pkg:npm/target@1.0.0" },
        kind: { String: "version" },
        name: { String: "target@1.0.0" },
        package_name: { String: "target" },
        version: { String: "1.0.0" },
        compromised_start: { Integer: 10 },
        compromised_end: { Integer: 20 },
      },
    },
    {
      id: 1,
      labels: ["DependencyNode"],
      properties: {
        entity_id: { String: "app:demo" },
        kind: { String: "application" },
        name: { String: "Demo" },
        repository: { String: "github.com/acme/demo" },
        environment: { String: "production" },
      },
    },
  ],
  relationships: [
    {
      id: 1,
      edge_type: "DEPENDS_ON",
      src: 1,
      dst: 2,
      properties: {
        edge_id: { String: "demo-target" },
        evidence: { String: "demo lockfile" },
        t_valid_start: { Integer: edgeWindow.start },
        t_valid_end: { Integer: edgeWindow.end },
      },
    },
  ],
});

describe("incoming SSpaths normalization", () => {
  it("reverses HydraDB traversal order into application-to-compromised order", () => {
    const path = normalizeApplicationPath(hydratedPath({ start: 0, end: 30 }), { start: 10, end: 20 });

    expect(path?.nodes.map((node) => node.entityId)).toEqual(["app:demo", "pkg:npm/target@1.0.0"]);
    expect(path?.relationships[0]).toMatchObject({
      sourceEntityId: "app:demo",
      targetEntityId: "pkg:npm/target@1.0.0",
    });
    expect(path?.temporal).toMatchObject({ status: "exposed", effectiveWindow: { start: 10, end: 20 } });
  });

  it("keeps a topological path while marking a boundary-disjoint edge not exposed", () => {
    const path = normalizeApplicationPath(hydratedPath({ start: 20, end: 30 }), { start: 10, end: 20 });

    expect(path?.temporal).toEqual({
      status: "not_exposed",
      requestedWindow: { start: 10, end: 20 },
      compromisedWindow: { start: 10, end: 20 },
      reason: "no_common_overlap",
    });
  });
});
