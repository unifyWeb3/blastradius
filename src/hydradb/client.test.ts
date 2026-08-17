import { describe, expect, it, vi } from "vitest";

import { HydraDbClient, HydraDbError, type HydraDbConfig } from "./client.js";

const config: HydraDbConfig = {
  baseUrl: "http://127.0.0.1:29999",
  token: "test-token",
  namespace: "test",
  graphId: "default",
  cellId: "cell-0",
  requestTimeoutMs: 100,
  queryPrefix: "client-test",
};

describe("HydraDbClient", () => {
  it("wraps transport failures as HydraDbError instead of leaking fetch errors", async () => {
    const fetchImplementation = vi.fn<typeof fetch>(async () => {
      throw new TypeError("fetch failed");
    });
    const client = new HydraDbClient(config, fetchImplementation);

    await expect(client.query("transport-check", "MATCH (n) RETURN n")).rejects.toMatchObject({
      name: "HydraDbError",
      status: 0,
      responseBody: { cause: "fetch failed" },
    } satisfies Partial<HydraDbError>);
  });
});
