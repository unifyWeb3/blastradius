import { performance } from "node:perf_hooks";

import type { HydraQueryResponse, HydraQueryResult } from "./types.js";

export interface HydraDbConfig {
  baseUrl: string;
  token: string;
  namespace: string;
  graphId: string;
  cellId: string;
  requestTimeoutMs: number;
  queryPrefix: string;
}

export interface HydraQueryOptions {
  consistency?: "eventual" | "strong";
  pageSize?: number;
}

export class HydraDbError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly responseBody: unknown,
  ) {
    super(message);
    this.name = "HydraDbError";
  }
}

export const hydraDbConfigFromEnv = (): HydraDbConfig => ({
  baseUrl: process.env.HYDRADB_URL ?? "http://127.0.0.1:18443",
  token: process.env.HYDRADB_TOKEN ?? "hydradb-investigation-token-32-bytes",
  namespace: process.env.HYDRADB_NAMESPACE ?? "local",
  graphId: process.env.HYDRADB_GRAPH_ID ?? "default",
  cellId: process.env.HYDRADB_CELL_ID ?? "cell-0",
  requestTimeoutMs: Number(process.env.HYDRADB_TIMEOUT_MS ?? 60_000),
  queryPrefix: process.env.HYDRADB_QUERY_PREFIX ?? `blastradius-${process.pid}`,
});

export class HydraDbClient {
  private bookmark: string | undefined;
  private sequence = 0;

  constructor(
    private readonly config: HydraDbConfig,
    private readonly fetchImplementation: typeof fetch = fetch,
  ) {}

  get lastBookmark(): string | undefined {
    return this.bookmark;
  }

  async query(
    operation: string,
    cypher: string,
    parameters: Record<string, unknown> = {},
    options: HydraQueryOptions = {},
  ): Promise<HydraQueryResult> {
    const queryId = `${this.config.queryPrefix}-${++this.sequence}-${operation}`;
    const startedAt = performance.now();
    let response: Response;
    try {
      response = await this.fetchImplementation(
        `${this.config.baseUrl}/v1/graphs/${encodeURIComponent(this.config.graphId)}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.config.token}`,
            "Content-Type": "application/json",
            "X-Graph-Namespace": this.config.namespace,
          },
          body: JSON.stringify({
            cell_id: this.config.cellId,
            query_id: queryId,
            query: cypher,
            parameters,
            ...(this.bookmark ? { bookmark: this.bookmark } : {}),
            ...(options.consistency ? { consistency: options.consistency } : {}),
            ...(options.pageSize ? { page_size: options.pageSize } : {}),
          }),
          signal: AbortSignal.timeout(this.config.requestTimeoutMs),
        },
      );
    } catch (error) {
      throw new HydraDbError(
        `HydraDB operation ${operation} could not reach the configured server.`,
        0,
        { cause: error instanceof Error ? error.message : String(error) },
      );
    }
    const durationMs = performance.now() - startedAt;
    const body = await parseResponseBody(response);

    if (!response.ok) {
      throw new HydraDbError(
        `HydraDB operation ${operation} failed with HTTP ${response.status}.`,
        response.status,
        body,
      );
    }

    if (!isHydraQueryResponse(body)) {
      throw new HydraDbError(`HydraDB operation ${operation} returned an invalid response.`, response.status, body);
    }

    if (body.bookmark) {
      this.bookmark = body.bookmark;
    }

    return { response: body, durationMs };
  }
}

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!text) {
    return null;
  }

  if (contentType.includes("application/x-ndjson")) {
    const records = text
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as unknown);
    return records.at(-1) ?? null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const isHydraQueryResponse = (value: unknown): value is HydraQueryResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Partial<HydraQueryResponse>;
  return (
    typeof response.query_id === "string" &&
    Array.isArray(response.columns) &&
    Array.isArray(response.rows) &&
    (typeof response.read_epoch === "number" || response.read_epoch === null)
  );
};
