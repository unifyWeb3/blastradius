import { HydraDbClient, hydraDbConfigFromEnv } from "../src/hydradb/client.js";
import { uaParserJsIncidentFixture } from "../src/graph/fixture.js";
import { ingestIncidentFixture, readLogicalGraph } from "../src/graph/ingestion.js";

const client = new HydraDbClient(hydraDbConfigFromEnv());

const first = await ingestIncidentFixture(client, uaParserJsIncidentFixture);
const firstReadback = await readLogicalGraph(client);
const second = await ingestIncidentFixture(client, uaParserJsIncidentFixture);
const secondReadback = await readLogicalGraph(client);

const idempotent = JSON.stringify(firstReadback) === JSON.stringify(secondReadback);
const expectedCounts = first.nodeCount === 12 && first.relationshipCount === 8;

console.log(
  JSON.stringify(
    {
      fixture: uaParserJsIncidentFixture.id,
      first,
      second,
      idempotent,
      expectedCounts,
      readback: secondReadback,
    },
    null,
    2,
  ),
);

if (!idempotent || !expectedCounts || second.nodeCount !== 12 || second.relationshipCount !== 8) {
  throw new Error("HydraDB fixture ingestion verification failed.");
}
