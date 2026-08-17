import { describe, expect, it } from "vitest";

import { hydraProperty, hydraScalar } from "./values.js";

describe("HydraDB value decoding", () => {
  it("decodes tagged query scalars", () => {
    expect(hydraScalar({ type: "string", value: "DEPENDS_ON" })).toBe("DEPENDS_ON");
    expect(hydraScalar({ type: "integer", value: 12 })).toBe(12);
  });

  it("decodes hydrated property maps", () => {
    expect(hydraProperty({ edge_id: { String: "merchant-web-commerce" } }, "edge_id")).toBe(
      "merchant-web-commerce",
    );
    expect(hydraProperty({}, "missing")).toBeNull();
  });
});
