import type {
  BlastRadiusAnalysisDto,
  ExposureCheckDto,
  ExposurePathDto,
} from "../domain/blast-radius.js";
import type { TimeWindow } from "../domain/temporal.js";
import { GraphEntityNotFoundError } from "../graph/blast-radius-service.js";
import { HydraDbError } from "../hydradb/client.js";
import { incidentById, incidentCatalog } from "./incident-catalog.js";

export interface BlastRadiusOperations {
  analyzeBlastRadius(compromisedVersionEntityId: string, timeWindow?: TimeWindow): Promise<BlastRadiusAnalysisDto>;
  getExposurePath(
    applicationEntityId: string,
    compromisedVersionEntityId: string,
    timeWindow?: TimeWindow,
  ): Promise<ExposurePathDto | null>;
  checkExposure(
    applicationEntityId: string,
    compromisedVersionEntityId: string,
    timeWindow?: TimeWindow,
  ): Promise<ExposureCheckDto>;
}

export interface ApiDependencies {
  blastRadius: BlastRadiusOperations;
}

export const handleApiRequest = async (request: Request, dependencies: ApiDependencies): Promise<Response> => {
  try {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "GET" && path === "/api/health") {
      return json({ status: "ok", service: "BlastRadius" });
    }

    if (request.method === "GET" && path === "/api/incidents") {
      return json({ incidents: incidentCatalog });
    }

    const incidentMatch = path.match(/^\/api\/incidents\/([^/]+)$/);
    if (request.method === "GET" && incidentMatch) {
      const incident = incidentById(decodeURIComponent(incidentMatch[1]));
      return incident ? json({ incident }) : errorResponse(404, "incident_not_found", "Incident was not found.");
    }

    const analysisMatch = path.match(/^\/api\/incidents\/([^/]+)\/blast-radius$/);
    if (request.method === "POST" && analysisMatch) {
      const incident = incidentById(decodeURIComponent(analysisMatch[1]));
      if (!incident) {
        return errorResponse(404, "incident_not_found", "Incident was not found.");
      }
      const body = await readJsonObject(request);
      const compromisedVersion = optionalString(body.compromisedVersion) ?? incident.compromisedVersion.entityId;
      const timeWindow = optionalTimeWindow(body.timeWindow);
      const analysis = await dependencies.blastRadius.analyzeBlastRadius(compromisedVersion, timeWindow);
      return json({ analysis });
    }

    if (request.method === "POST" && path === "/api/exposure/check") {
      const body = await readJsonObject(request);
      const result = await dependencies.blastRadius.checkExposure(
        requiredString(body.application, "application"),
        requiredString(body.compromisedVersion, "compromisedVersion"),
        optionalTimeWindow(body.timeWindow),
      );
      return json({ result });
    }

    if (request.method === "POST" && path === "/api/exposure/path") {
      const body = await readJsonObject(request);
      const pathResult = await dependencies.blastRadius.getExposurePath(
        requiredString(body.application, "application"),
        requiredString(body.compromisedVersion, "compromisedVersion"),
        optionalTimeWindow(body.timeWindow),
      );
      return json({ path: pathResult });
    }

    return errorResponse(404, "route_not_found", "API route was not found.");
  } catch (error) {
    return apiError(error);
  }
};

const readJsonObject = async (request: Request): Promise<Record<string, unknown>> => {
  const body = (await request.json()) as unknown;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new TypeError("Request body must be a JSON object.");
  }
  return body as Record<string, unknown>;
};

const optionalTimeWindow = (value: unknown): TimeWindow | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError("timeWindow must be an object with numeric start and end fields.");
  }
  const window = value as Record<string, unknown>;
  if (typeof window.start !== "number" || typeof window.end !== "number") {
    throw new TypeError("timeWindow.start and timeWindow.end must be numbers.");
  }
  return { start: window.start, end: window.end };
};

const requiredString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`);
  }
  return value;
};

const optionalString = (value: unknown): string | undefined =>
  value === undefined ? undefined : requiredString(value, "compromisedVersion");

const apiError = (error: unknown): Response => {
  if (error instanceof GraphEntityNotFoundError) {
    return errorResponse(404, "graph_entity_not_found", error.message);
  }
  if (error instanceof HydraDbError) {
    return errorResponse(502, "hydradb_query_failed", "HydraDB could not complete the graph operation.", {
      status: error.status,
    });
  }
  if (error instanceof TypeError || error instanceof RangeError || error instanceof SyntaxError) {
    return errorResponse(400, "invalid_request", error.message);
  }
  console.error(error);
  return errorResponse(500, "internal_error", "Unexpected server error.");
};

const json = (body: unknown, status = 200): Response =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

const errorResponse = (
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
): Response => json({ error: { code, message, ...(details ? { details } : {}) } }, status);
