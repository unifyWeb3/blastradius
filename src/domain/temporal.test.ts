import { describe, expect, it } from "vitest";

import { evaluateTemporalExposure, intersectTimeWindows } from "./temporal.js";

describe("half-open temporal exposure policy", () => {
  it("returns the common overlap across the request, compromise, and every dependency edge", () => {
    expect(
      evaluateTemporalExposure(
        { start: 10, end: 30 },
        { start: 15, end: 25 },
        [
          { start: 0, end: 22 },
          { start: 20, end: 40 },
        ],
      ),
    ).toEqual({ status: "exposed", effectiveWindow: { start: 20, end: 22 } });
  });

  it("treats touching half-open boundaries as no overlap", () => {
    expect(intersectTimeWindows([{ start: 10, end: 20 }, { start: 20, end: 30 }])).toBeNull();
  });

  it.each([
    [{ start: 0, end: 10 }],
    [{ start: 30, end: 40 }],
  ])("rejects dependency validity wholly before or after the incident", (dependencyWindow) => {
    expect(
      evaluateTemporalExposure({ start: 10, end: 30 }, { start: 10, end: 30 }, [dependencyWindow]),
    ).toEqual({ status: "not_exposed", reason: "no_common_overlap" });
  });

  it("reports unresolved when any dependency edge lacks validity evidence", () => {
    expect(evaluateTemporalExposure({ start: 10, end: 30 }, { start: 10, end: 30 }, [null])).toEqual({
      status: "unresolved",
      reason: "missing_dependency_validity",
    });
  });
});
