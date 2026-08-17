import type {
  ApplicationExposureDto,
  DependencyEdgeDto,
  DependencyNodeDto,
  ExposurePathDto,
} from "../domain/blast-radius.js";
import { evaluateTemporalExposure, type TimeWindow } from "../domain/temporal.js";
import type { HydraPath } from "../hydradb/types.js";
import { hydraProperty, requireNumber, requireString } from "../hydradb/values.js";

export const normalizeApplicationPaths = (
  paths: readonly HydraPath[],
  requestedWindow: TimeWindow,
): ApplicationExposureDto[] => {
  const normalized = paths
    .map((path) => normalizeApplicationPath(path, requestedWindow))
    .filter((path): path is ExposurePathDto => path !== null);
  const byApplication = new Map<string, ExposurePathDto[]>();

  for (const path of normalized) {
    const existing = byApplication.get(path.application.entityId) ?? [];
    if (!existing.some((candidate) => candidate.pathId === path.pathId)) {
      existing.push(path);
    }
    byApplication.set(path.application.entityId, existing);
  }

  return [...byApplication.values()]
    .map((applicationPaths): ApplicationExposureDto => {
      const pathsSorted = applicationPaths.sort(comparePaths);
      const exposedPath = pathsSorted.find((path) => path.temporal.status === "exposed");
      const unresolvedPath = pathsSorted.find((path) => path.temporal.status === "unresolved");
      const status = exposedPath ? "exposed" : unresolvedPath ? "unresolved" : "not_exposed";
      const reason = status === "exposed" ? undefined : (unresolvedPath ?? pathsSorted[0]).temporal.reason;
      return {
        application: pathsSorted[0].application,
        status,
        ...(reason ? { reason } : {}),
        paths: pathsSorted,
      };
    })
    .sort((left, right) => left.application.name.localeCompare(right.application.name));
};

export const normalizeApplicationPath = (
  path: HydraPath,
  requestedWindow: TimeWindow,
): ExposurePathDto | null => {
  if (path.nodes.length < 2 || path.relationships.length !== path.nodes.length - 1) {
    return null;
  }

  const traversalNodes = path.nodes.map(normalizeNode);
  const traversalRoot = traversalNodes.at(-1)!;
  if (traversalRoot.kind !== "application") {
    return null;
  }

  const nodeEntityByInternalId = new Map(
    path.nodes.map((node, index) => [node.id, traversalNodes[index].entityId] as const),
  );
  const compromisedVersion = traversalNodes[0];
  const compromisedStart = requireNumber(
    hydraProperty(path.nodes[0].properties, "compromised_start"),
    "compromised_start",
  );
  const compromisedEnd = requireNumber(
    hydraProperty(path.nodes[0].properties, "compromised_end"),
    "compromised_end",
  );
  const compromisedWindow = { start: compromisedStart, end: compromisedEnd };
  const relationships = path.relationships.toReversed().map((relationship): DependencyEdgeDto => {
    const validStart = hydraProperty(relationship.properties, "t_valid_start");
    const validEnd = hydraProperty(relationship.properties, "t_valid_end");
    return {
      edgeId: requireString(hydraProperty(relationship.properties, "edge_id"), "edge_id"),
      relationshipType: "DEPENDS_ON",
      sourceEntityId: requiredMappedEntity(nodeEntityByInternalId, relationship.src),
      targetEntityId: requiredMappedEntity(nodeEntityByInternalId, relationship.dst),
      evidence: requireString(hydraProperty(relationship.properties, "evidence"), "evidence"),
      validWindow:
        typeof validStart === "number" && typeof validEnd === "number"
          ? { start: validStart, end: validEnd }
          : null,
    };
  });
  const temporal = evaluateTemporalExposure(
    requestedWindow,
    compromisedWindow,
    relationships.map((relationship) => relationship.validWindow),
  );
  const orderedNodes = traversalNodes.toReversed();
  const pathId = relationships.map((relationship) => relationship.edgeId).join("|");

  return {
    pathId,
    application: traversalRoot,
    compromisedVersion,
    nodes: orderedNodes,
    relationships,
    hopCount: relationships.length,
    temporal: {
      status: temporal.status,
      requestedWindow,
      compromisedWindow,
      ...(temporal.status === "exposed"
        ? { effectiveWindow: temporal.effectiveWindow }
        : { reason: temporal.reason }),
    },
  };
};

const normalizeNode = (node: HydraPath["nodes"][number]): DependencyNodeDto => {
  const optionalString = (property: string): string | undefined => {
    const value = hydraProperty(node.properties, property);
    return typeof value === "string" ? value : undefined;
  };

  return {
    entityId: requireString(hydraProperty(node.properties, "entity_id"), "entity_id"),
    kind: requireString(hydraProperty(node.properties, "kind"), "kind"),
    name: requireString(hydraProperty(node.properties, "name"), "name"),
    ...(optionalString("ecosystem") ? { ecosystem: optionalString("ecosystem") } : {}),
    ...(optionalString("package_name") ? { packageName: optionalString("package_name") } : {}),
    ...(optionalString("version") ? { version: optionalString("version") } : {}),
    ...(optionalString("repository") ? { repository: optionalString("repository") } : {}),
    ...(optionalString("environment") ? { environment: optionalString("environment") } : {}),
  };
};

const requiredMappedEntity = (entities: Map<number, string>, id: number): string => {
  const entityId = entities.get(id);
  if (!entityId) {
    throw new Error(`HydraDB path relationship references missing vertex ${id}.`);
  }
  return entityId;
};

const comparePaths = (left: ExposurePathDto, right: ExposurePathDto): number =>
  left.hopCount - right.hopCount || left.pathId.localeCompare(right.pathId);
