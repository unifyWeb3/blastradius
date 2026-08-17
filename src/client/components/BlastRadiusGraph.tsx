import { Background, BackgroundVariant, Controls, ReactFlow, type NodeMouseHandler } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { BlastRadiusAnalysisDto, ExposurePathDto } from "../../domain/blast-radius.js";
import { buildGraphLayout } from "../graph-layout.js";

interface BlastRadiusGraphProps {
  analysis: BlastRadiusAnalysisDto;
  selectedPath: ExposurePathDto | null;
  onSelectApplication: (entityId: string) => void;
}

export const BlastRadiusGraph = ({ analysis, selectedPath, onSelectApplication }: BlastRadiusGraphProps) => {
  const layout = buildGraphLayout(analysis, selectedPath);
  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    if (analysis.candidateRoots.some((candidate) => candidate.application.entityId === node.id)) {
      onSelectApplication(node.id);
    }
  };

  return (
    <div className="graph-canvas" data-testid="blast-radius-graph">
      <ReactFlow
        nodes={layout.nodes}
        edges={layout.edges}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.3, maxZoom: 1.15 }}
        minZoom={0.25}
        maxZoom={1.7}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#ccd3d0" />
        <Controls showInteractive={false} position="bottom-left" />
      </ReactFlow>
    </div>
  );
};
