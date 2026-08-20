import { describe, expect, it, vi } from "vitest";

import type { HydraDbClient } from "../hydradb/client.js";
import { bootstrapIncidentFixture, bootstrapOptionsFromEnv } from "./bootstrap.js";

describe("production fixture bootstrap", () => {
  it("is disabled unless explicitly configured", async () => {
    const client = { query: vi.fn() } as unknown as HydraDbClient;

    await expect(
      bootstrapIncidentFixture(client, bootstrapOptionsFromEnv({}), vi.fn()),
    ).resolves.toBeNull();
    expect(client.query).not.toHaveBeenCalled();
  });

  it("validates retry configuration", () => {
    expect(() => bootstrapOptionsFromEnv({ BLASTRADIUS_INGEST_ATTEMPTS: "0" })).toThrow(
      "BLASTRADIUS_INGEST_ATTEMPTS must be a positive integer.",
    );
    expect(() => bootstrapOptionsFromEnv({ BLASTRADIUS_INGEST_RETRY_MS: "-1" })).toThrow(
      "BLASTRADIUS_INGEST_RETRY_MS must be a non-negative integer.",
    );
  });
});
