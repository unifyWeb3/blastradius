import { describe, expect, it, vi } from "vitest";

import type { BlastRadiusAnalysisDto, ExposureCheckDto } from "../domain/blast-radius.js";
import { HydraDbError } from "../hydradb/client.js";
import { handleApiRequest, type BlastRadiusOperations } from "./api.js";

const service = (): BlastRadiusOperations => ({
  analyzeBlastRadius: vi.fn(async () => ({ affectedRootCount: 1 }) as BlastRadiusAnalysisDto),
  getExposurePath: vi.fn(async () => null),
  checkExposure: vi.fn(async () => ({
    status: "not_exposed",
    reason: "no_supporting_dependency_path",
    application: { entityId: "app:analytics-worker", kind: "application", name: "Analytics Worker" },
    path: null,
  }) as ExposureCheckDto),
});

describe("BlastRadius API", () => {
  it("lists the locked incident without accepting a graph query", async () => {
    const response = await handleApiRequest(new Request("http://localhost/api/incidents"), {
      blastRadius: service(),
    });
    const body = (await response.json()) as { incidents: Array<{ id: string }> };

    expect(response.status).toBe(200);
    expect(body.incidents[0].id).toBe("incident:ghsa-pjwm-rvh2-c87w");
  });

  it("runs the fixed blast-radius operation", async () => {
    const blastRadius = service();
    const response = await handleApiRequest(
      new Request("http://localhost/api/incidents/incident%3Aghsa-pjwm-rvh2-c87w/blast-radius", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
      { blastRadius },
    );

    expect(response.status).toBe(200);
    expect(blastRadius.analyzeBlastRadius).toHaveBeenCalledWith("pkg:npm/ua-parser-js@0.7.29", undefined);
  });

  it("returns the explicit no-evidence result from exposure check", async () => {
    const response = await handleApiRequest(
      new Request("http://localhost/api/exposure/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application: "app:analytics-worker",
          compromisedVersion: "pkg:npm/ua-parser-js@0.7.29",
        }),
      }),
      { blastRadius: service() },
    );
    const body = (await response.json()) as { result: ExposureCheckDto };

    expect(body.result).toMatchObject({
      status: "not_exposed",
      reason: "no_supporting_dependency_path",
      path: null,
    });
  });

  it("maps HydraDB transport failures to a generic 502 response", async () => {
    const blastRadius = service();
    blastRadius.analyzeBlastRadius = vi.fn(async () => {
      throw new HydraDbError("transport details", 0, { cause: "fetch failed" });
    });
    const response = await handleApiRequest(
      new Request("http://localhost/api/incidents/incident%3Aghsa-pjwm-rvh2-c87w/blast-radius", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
      { blastRadius },
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "hydradb_query_failed",
        message: "HydraDB could not complete the graph operation.",
        details: { status: 0 },
      },
    });
  });
});
