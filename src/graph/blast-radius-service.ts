import { performance } from "node:perf_hooks";

import type {
  BlastRadiusAnalysisDto,
  DependencyNodeDto,
  ExposureCheckDto,
  ExposurePathDto,
} from "../domain/blast-radius.js";
import { assertValidTimeWindow, type TimeWindow } from "../domain/temporal.js";
import type { HydraDbClient } from "../hydradb/client.js";
import type { HydraPath } from "../hydradb/types.js";
import { hydraScalar, requireNumber, requireString } from "../hydradb/values.js";
import { normalizeApplicationPaths } from "./path-normalization.js";

const MAX_LENGTH = 6;
const PATH_COUNT = 50;
const RESULT_LIMIT = 100;

export class GraphEntityNotFoundError extends Error {
  constructor(readonly entityId: string) {
    super(`Graph entity ${entityId} was not found.`);
    this.name = "GraphEntityNotFoundError";
  }
}

export class BlastRadiusService {
  constructor(private readonly client: HydraDbClient) {}

  async analyzeBlastRadius(
    compromisedVersionEntityId: string,
    timeWindow?: TimeWindow,
  ): Promise<BlastRadiusAnalysisDto> {
    const startedAt = performance.now();
    const compromised = await this.resolveCompromisedVersion(compromisedVersionEntityId);
    const requestedWindow = timeWindow ?? compromised.compromisedWindow;
    assertValidTimeWindow(requestedWindow, "requested window");

    const pathQuery = await this.client.query(
      "analyze-incoming-sspaths",
      "CALL algo.SSpaths({sourceNode: $target, relTypes: ['DEPENDS_ON'], relDirection: 'incoming', maxLen: 6, pathCount: 50, resultLimit: 100}) YIELD path RETURN path",
      { target: compromised.vertexId },
    );
    const rawPaths = pathQuery.response.rows
      .map((row) => row[0])
      .filter((value): value is { type: "path"; value: HydraPath } => value?.type === "path")
      .map((value) => value.value);
    const candidateRoots = normalizeApplicationPaths(rawPaths, requestedWindow);
    const affectedRoots = candidateRoots
      .filter((candidate) => candidate.status === "exposed")
      .map((candidate) => candidate.application);
    const graph = graphFromCandidates(candidateRoots);

    return {
      compromisedVersion: compromised.node,
      requestedWindow,
      affectedRoots,
      candidateRoots,
      affectedRootCount: affectedRoots.length,
      candidateRootCount: candidateRoots.length,
      graph,
      traversal: {
        engine: "HydraDB algo.SSpaths",
        direction: "incoming",
        relationshipTypes: ["DEPENDS_ON"],
        maxLength: MAX_LENGTH,
        pathCount: PATH_COUNT,
        resultLimit: RESULT_LIMIT,
      },
      timing: {
        hydraQueryMs: pathQuery.durationMs,
        totalMs: performance.now() - startedAt,
      },
    };
  }

  async getExposurePath(
    applicationEntityId: string,
    compromisedVersionEntityId: string,
    timeWindow?: TimeWindow,
  ): Promise<ExposurePathDto | null> {
    const analysis = await this.analyzeBlastRadius(compromisedVersionEntityId, timeWindow);
    return analysis.candidateRoots.find((candidate) => candidate.application.entityId === applicationEntityId)?.paths[0] ?? null;
  }

  async checkExposure(
    applicationEntityId: string,
    compromisedVersionEntityId: string,
    timeWindow?: TimeWindow,
  ): Promise<ExposureCheckDto> {
    const application = await this.resolveApplication(applicationEntityId);
    const analysis = await this.analyzeBlastRadius(compromisedVersionEntityId, timeWindow);
    const candidate = analysis.candidateRoots.find(
      (entry) => entry.application.entityId === applicationEntityId,
    );

    if (!candidate) {
      return {
        status: "not_exposed",
        reason: "no_supporting_dependency_path",
        application,
        path: null,
      };
    }

    const path = candidate.paths.find((entry) => entry.temporal.status === candidate.status) ?? candidate.paths[0];
    if (candidate.status === "exposed") {
      return { status: "exposed", reason: "supporting_dependency_path", application, path };
    }
    if (candidate.status === "unresolved") {
      return { status: "unresolved", reason: "missing_dependency_validity", application, path };
    }
    return { status: "not_exposed", reason: "no_common_overlap", application, path };
  }

  private async resolveCompromisedVersion(entityId: string): Promise<{
    vertexId: number;
    node: DependencyNodeDto;
    compromisedWindow: TimeWindow;
  }> {
    const result = await this.client.query(
      "resolve-compromised-version",
      "MATCH (n:DependencyNode {entity_id: $entity_id}) RETURN n.id AS vertex, n.entity_id AS entity_id, n.kind AS kind, n.name AS name, n.ecosystem AS ecosystem, n.package_name AS package_name, n.version AS version, n.compromised_start AS compromised_start, n.compromised_end AS compromised_end",
      { entity_id: entityId },
    );
    const row = result.response.rows[0];
    if (!row) {
      throw new GraphEntityNotFoundError(entityId);
    }

    return {
      vertexId: requireNumber(hydraScalar(row[0]), "vertex"),
      node: {
        entityId: requireString(hydraScalar(row[1]), "entity_id"),
        kind: requireString(hydraScalar(row[2]), "kind"),
        name: requireString(hydraScalar(row[3]), "name"),
        ecosystem: requireString(hydraScalar(row[4]), "ecosystem"),
        packageName: requireString(hydraScalar(row[5]), "package_name"),
        version: requireString(hydraScalar(row[6]), "version"),
      },
      compromisedWindow: {
        start: requireNumber(hydraScalar(row[7]), "compromised_start"),
        end: requireNumber(hydraScalar(row[8]), "compromised_end"),
      },
    };
  }

  private async resolveApplication(entityId: string): Promise<DependencyNodeDto> {
    const result = await this.client.query(
      "resolve-application",
      "MATCH (n:DependencyNode {entity_id: $entity_id}) RETURN n.entity_id AS entity_id, n.kind AS kind, n.name AS name, n.repository AS repository, n.environment AS environment",
      { entity_id: entityId },
    );
    const row = result.response.rows[0];
    if (!row) {
      throw new GraphEntityNotFoundError(entityId);
    }
    return {
      entityId: requireString(hydraScalar(row[0]), "entity_id"),
      kind: requireString(hydraScalar(row[1]), "kind"),
      name: requireString(hydraScalar(row[2]), "name"),
      repository: requireString(hydraScalar(row[3]), "repository"),
      environment: requireString(hydraScalar(row[4]), "environment"),
    };
  }
}

const graphFromCandidates = (
  candidates: BlastRadiusAnalysisDto["candidateRoots"],
): BlastRadiusAnalysisDto["graph"] => {
  const nodes = new Map<string, DependencyNodeDto>();
  const relationships = new Map<string, BlastRadiusAnalysisDto["graph"]["relationships"][number]>();

  for (const candidate of candidates) {
    for (const path of candidate.paths) {
      for (const node of path.nodes) {
        nodes.set(node.entityId, node);
      }
      for (const relationship of path.relationships) {
        relationships.set(relationship.edgeId, relationship);
      }
    }
  }

  return {
    nodes: [...nodes.values()].sort((left, right) => left.entityId.localeCompare(right.entityId)),
    relationships: [...relationships.values()].sort((left, right) => left.edgeId.localeCompare(right.edgeId)),
  };
};
