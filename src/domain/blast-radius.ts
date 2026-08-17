import type { TimeWindow } from "./temporal.js";

export type ExposureStatus = "exposed" | "not_exposed" | "unresolved";

export interface DependencyNodeDto {
  entityId: string;
  kind: string;
  name: string;
  ecosystem?: string;
  packageName?: string;
  version?: string;
  repository?: string;
  environment?: string;
}

export interface DependencyEdgeDto {
  edgeId: string;
  relationshipType: "DEPENDS_ON";
  sourceEntityId: string;
  targetEntityId: string;
  evidence: string;
  validWindow: TimeWindow | null;
}

export interface ExposurePathDto {
  pathId: string;
  application: DependencyNodeDto;
  compromisedVersion: DependencyNodeDto;
  nodes: DependencyNodeDto[];
  relationships: DependencyEdgeDto[];
  hopCount: number;
  temporal: {
    status: ExposureStatus;
    requestedWindow: TimeWindow;
    compromisedWindow: TimeWindow;
    effectiveWindow?: TimeWindow;
    reason?: "no_common_overlap" | "missing_dependency_validity";
  };
}

export interface ApplicationExposureDto {
  application: DependencyNodeDto;
  status: ExposureStatus;
  reason?: "no_common_overlap" | "missing_dependency_validity";
  paths: ExposurePathDto[];
}

export interface BlastRadiusAnalysisDto {
  compromisedVersion: DependencyNodeDto;
  requestedWindow: TimeWindow;
  affectedRoots: DependencyNodeDto[];
  candidateRoots: ApplicationExposureDto[];
  affectedRootCount: number;
  candidateRootCount: number;
  graph: {
    nodes: DependencyNodeDto[];
    relationships: DependencyEdgeDto[];
  };
  traversal: {
    engine: "HydraDB algo.SSpaths";
    direction: "incoming";
    relationshipTypes: ["DEPENDS_ON"];
    maxLength: number;
    pathCount: number;
    resultLimit: number;
  };
  timing: {
    hydraQueryMs: number;
    totalMs: number;
  };
}

export type ExposureCheckDto =
  | {
      status: "exposed";
      reason: "supporting_dependency_path";
      application: DependencyNodeDto;
      path: ExposurePathDto;
    }
  | {
      status: "not_exposed";
      reason: "no_supporting_dependency_path" | "no_common_overlap";
      application: DependencyNodeDto;
      path: ExposurePathDto | null;
    }
  | {
      status: "unresolved";
      reason: "missing_dependency_validity";
      application: DependencyNodeDto;
      path: ExposurePathDto;
    };
