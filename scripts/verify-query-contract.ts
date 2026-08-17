import { BlastRadiusService } from "../src/graph/blast-radius-service.js";
import { uaParserJsIncidentFixture } from "../src/graph/fixture.js";
import { HydraDbClient, hydraDbConfigFromEnv } from "../src/hydradb/client.js";

const compromisedVersion = uaParserJsIncidentFixture.compromisedVersionEntityId;
const client = new HydraDbClient(hydraDbConfigFromEnv());
const service = new BlastRadiusService(client);

const analysis = await service.analyzeBlastRadius(compromisedVersion);
const merchant = await service.checkExposure("app:merchant-web", compromisedVersion);
const admin = await service.checkExposure("app:admin-portal", compromisedVersion);
const analytics = await service.checkExposure("app:analytics-worker", compromisedVersion);

const result = {
  affectedRoots: analysis.affectedRoots.map((root) => root.entityId),
  candidates: analysis.candidateRoots.map((candidate) => ({
    application: candidate.application.entityId,
    status: candidate.status,
    paths: candidate.paths.map((path) => path.nodes.map((node) => node.entityId)),
  })),
  traversal: analysis.traversal,
  timing: analysis.timing,
  checks: { merchant, admin, analytics },
};

console.log(JSON.stringify(result, null, 2));

const passed =
  JSON.stringify(result.affectedRoots) === JSON.stringify(["app:merchant-web"]) &&
  merchant.status === "exposed" &&
  admin.status === "not_exposed" &&
  admin.reason === "no_common_overlap" &&
  analytics.status === "not_exposed" &&
  analytics.reason === "no_supporting_dependency_path";

if (!passed) {
  throw new Error("Blast-radius query contract did not match the fixture ground truth.");
}
