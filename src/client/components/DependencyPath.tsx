import { ArrowRight, FileCheck2 } from "lucide-react";
import type { ExposurePathDto } from "../../domain/blast-radius.js";
import { formatUtc } from "../format.js";

export const DependencyPath = ({ path }: { path: ExposurePathDto }) => (
  <section className="path-panel" aria-labelledby="path-heading">
    <div className="section-heading">
      <div>
        <span className="section-kicker">Selected evidence path</span>
        <h2 id="path-heading">{path.application.name}</h2>
      </div>
      <span className={`status-label status-label--${path.temporal.status}`}>{statusText(path.temporal.status)}</span>
    </div>

    <div className="dependency-chain" aria-label="Ordered dependency path">
      {path.nodes.map((node, index) => (
        <div className="dependency-chain__segment" key={node.entityId}>
          <div className={node.entityId === path.compromisedVersion.entityId ? "chain-node chain-node--danger" : "chain-node"}>
            <strong>{node.name}</strong>
            <span>{node.kind === "application" ? node.repository : node.entityId}</span>
          </div>
          {index < path.nodes.length - 1 && <ArrowRight size={18} aria-hidden="true" />}
        </div>
      ))}
    </div>

    <div className="evidence-list">
      {path.relationships.map((relationship) => (
        <article className="evidence-row" key={relationship.edgeId}>
          <FileCheck2 size={17} aria-hidden="true" />
          <div>
            <strong>{relationship.relationshipType}</strong>
            <p>{relationship.evidence}</p>
            {relationship.validWindow && (
              <span>{formatUtc(relationship.validWindow.start)} to {formatUtc(relationship.validWindow.end)}</span>
            )}
          </div>
        </article>
      ))}
    </div>
  </section>
);

const statusText = (status: ExposurePathDto["temporal"]["status"]): string =>
  status === "exposed" ? "Exposed in window" : status === "not_exposed" ? "Outside window" : "Temporal evidence incomplete";
