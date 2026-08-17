import type { BlastRadiusAnalysisDto, ExposureCheckDto } from "../domain/blast-radius.js";
import type { TimeWindow } from "../domain/temporal.js";
import type { IncidentCatalogEntry } from "../server/incident-catalog.js";

interface ApiErrorBody {
  error?: { code?: string; message?: string };
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const loadIncidents = async (): Promise<IncidentCatalogEntry[]> => {
  const body = await apiRequest<{ incidents: IncidentCatalogEntry[] }>("/api/incidents");
  return body.incidents;
};

export const analyzeIncident = async (
  incidentId: string,
  compromisedVersion: string,
  timeWindow: TimeWindow,
): Promise<BlastRadiusAnalysisDto> => {
  const body = await apiRequest<{ analysis: BlastRadiusAnalysisDto }>(
    `/api/incidents/${encodeURIComponent(incidentId)}/blast-radius`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ compromisedVersion, timeWindow }),
    },
  );
  return body.analysis;
};

export const checkApplicationExposure = async (
  application: string,
  compromisedVersion: string,
  timeWindow: TimeWindow,
): Promise<ExposureCheckDto> => {
  const body = await apiRequest<{ result: ExposureCheckDto }>("/api/exposure/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ application, compromisedVersion, timeWindow }),
  });
  return body.result;
};

const apiRequest = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  const body = (await response.json()) as T & ApiErrorBody;
  if (!response.ok) {
    throw new ApiError(
      body.error?.message ?? "Request failed.",
      response.status,
      body.error?.code ?? "unknown_error",
    );
  }
  return body;
};
