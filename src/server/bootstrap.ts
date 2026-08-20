import { uaParserJsIncidentFixture } from "../graph/fixture.js";
import { ingestIncidentFixture, type IngestionSummary } from "../graph/ingestion.js";
import type { HydraDbClient } from "../hydradb/client.js";

const DEFAULT_ATTEMPTS = 60;
const DEFAULT_RETRY_DELAY_MS = 2_000;

export interface BootstrapOptions {
  enabled: boolean;
  attempts: number;
  retryDelayMs: number;
}

export const bootstrapOptionsFromEnv = (
  environment: NodeJS.ProcessEnv = process.env,
): BootstrapOptions => ({
  enabled: environment.BLASTRADIUS_AUTO_INGEST === "true",
  attempts: positiveInteger(environment.BLASTRADIUS_INGEST_ATTEMPTS, DEFAULT_ATTEMPTS),
  retryDelayMs: nonNegativeInteger(environment.BLASTRADIUS_INGEST_RETRY_MS, DEFAULT_RETRY_DELAY_MS),
});

export const bootstrapIncidentFixture = async (
  client: HydraDbClient,
  options: BootstrapOptions,
  wait: (milliseconds: number) => Promise<void> = delay,
): Promise<IngestionSummary | null> => {
  if (!options.enabled) {
    return null;
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= options.attempts; attempt += 1) {
    try {
      return await ingestIncidentFixture(client, uaParserJsIncidentFixture);
    } catch (error) {
      lastError = error;
      if (attempt === options.attempts) {
        break;
      }
      console.warn(
        `HydraDB fixture bootstrap attempt ${attempt}/${options.attempts} failed; retrying in ${options.retryDelayMs} ms.`,
      );
      await wait(options.retryDelayMs);
    }
  }

  throw new Error(
    `HydraDB fixture bootstrap failed after ${options.attempts} attempts.`,
    { cause: lastError },
  );
};

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const positiveInteger = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new RangeError("BLASTRADIUS_INGEST_ATTEMPTS must be a positive integer.");
  }
  return parsed;
};

const nonNegativeInteger = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value ?? fallback);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new RangeError("BLASTRADIUS_INGEST_RETRY_MS must be a non-negative integer.");
  }
  return parsed;
};
