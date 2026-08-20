import type { Edge, Node } from "@xyflow/react";
import { MarkerType, Position } from "@xyflow/react";
import { Box, Package, ShieldAlert } from "lucide-react";
import type { BlastRadiusAnalysisDto, ExposurePathDto } from "../domain/blast-radius.js";

export interface GraphLayout {
  nodes: Node[];
  edges: Edge[];
}

export const buildGraphLayout = (
  analysis: BlastRadiusAnalysisDto,
  selectedPath: ExposurePathDto | null,
): GraphLayout => {
  const positions = new Map<string, Array<{ x: number; y: number }>>();
  const candidatePaths = analysis.candidateRoots.flatMap((candidate) => candidate.paths.slice(0, 1));
  const graphWidth = 760;

  candidatePaths.forEach((path, rowIndex) => {
    path.nodes.forEach((node, nodeIndex) => {
      const x = node.kind === "application"
        ? 20
        : nodeIndex === path.nodes.length - 1
          ? graphWidth
          : Math.round((graphWidth * nodeIndex) / (path.nodes.length - 1));
      const position = { x, y: 72 + rowIndex * 180 };
      positions.set(node.entityId, [...(positions.get(node.entityId) ?? []), position]);
    });
  });

  const selectedNodes = new Set(selectedPath?.nodes.map((node) => node.entityId) ?? []);
  const selectedEdges = new Set(selectedPath?.relationships.map((edge) => edge.edgeId) ?? []);
  const candidateStatus = new Map(
    analysis.candidateRoots.map((candidate) => [candidate.application.entityId, candidate.status] as const),
  );

  const nodes: Node[] = analysis.graph.nodes.map((node) => {
    const samples = positions.get(node.entityId) ?? [{ x: graphWidth, y: 160 }];
    const position = {
      x: Math.round(samples.reduce((sum, sample) => sum + sample.x, 0) / samples.length),
      y: Math.round(samples.reduce((sum, sample) => sum + sample.y, 0) / samples.length),
    };
    const isCompromised = node.entityId === analysis.compromisedVersion.entityId;
    const status = candidateStatus.get(node.entityId);
    const Icon = isCompromised ? ShieldAlert : node.kind === "application" ? Box : Package;
    const detail = node.kind === "application" ? node.environment : node.version ? `v${node.version}` : node.kind;
    const dimmed = Boolean(selectedPath) && !selectedNodes.has(node.entityId) && !isCompromised;

    return {
      id: node.entityId,
      position,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        label: (
          <div className="graph-node__content">
            <Icon size={16} aria-hidden="true" />
            <div>
              <strong>{node.name}</strong>
              <span>{detail}</span>
            </div>
          </div>
        ),
      },
      ariaLabel: `${node.name}${detail ? `, ${detail}` : ""}`,
      className: [
        "graph-node",
        isCompromised ? "graph-node--compromised" : "",
        node.kind === "application" ? "graph-node--application" : "",
        status ? `graph-node--${status}` : "",
        selectedNodes.has(node.entityId) ? "graph-node--selected" : "",
        dimmed ? "graph-node--dimmed" : "",
      ].filter(Boolean).join(" "),
    };
  });

  const edges: Edge[] = analysis.graph.relationships.map((relationship) => {
    const selected = selectedEdges.has(relationship.edgeId);
    return {
      id: relationship.edgeId,
      source: relationship.sourceEntityId,
      target: relationship.targetEntityId,
      label: relationship.relationshipType,
      markerEnd: { type: MarkerType.ArrowClosed, color: selected ? "var(--graph-edge-selected)" : "var(--graph-edge)" },
      className: selected ? "graph-edge graph-edge--selected" : "graph-edge",
      animated: selected,
      style: { stroke: selected ? "var(--graph-edge-selected)" : "var(--graph-edge)", strokeWidth: selected ? 2.5 : 1.5 },
      labelStyle: { fill: selected ? "var(--graph-edge-selected)" : "var(--graph-edge-label)", fontSize: 10, fontWeight: 700 },
      labelBgStyle: { fill: "var(--graph-canvas)", fillOpacity: 0.94 },
      labelBgPadding: [5, 3],
      labelBgBorderRadius: 3,
    };
  });

  return { nodes, edges };
};
