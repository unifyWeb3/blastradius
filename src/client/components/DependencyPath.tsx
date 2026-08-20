import { ArrowRight, CheckCircle2, CircleHelp, FileCheck2, ShieldAlert } from "lucide-react";
import type { ExposurePathDto } from "../../domain/blast-radius.js";
import { formatUtc } from "../format.js";

export const DependencyPath = ({ path }: { path: ExposurePathDto }) => {
  const StatusIcon = path.temporal.status === "exposed" ? ShieldAlert : path.temporal.status === "unresolved" ? CircleHelp : CheckCircle2;
  return (
    <section className="path-panel" aria-labelledby="path-heading">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Selected evidence path</span>
          <h2 id="path-heading">{path.application.name}</h2>
        </div>
        <div className="path-status">
          <span className={`status-label status-label--${path.temporal.status}`}>
            <StatusIcon size={12} aria-hidden="true" />
            {statusText(path.temporal.status)}
          </span>
          {path.temporal.reason && <code>reason: {path.temporal.reason}</code>}
        </div>
      </div>

      <div className="dependency-chain" aria-label="Ordered dependency path">
        {path.nodes.map((node, index) => (
          <div className="dependency-chain__segment" key={node.entityId}>
            <div className={[
              "chain-node",
              node.kind === "application" ? "chain-node--application" : "",
              node.entityId === path.compromisedVersion.entityId ? "chain-node--danger" : "",
            ].filter(Boolean).join(" ")}>
              <span className="chain-node__index">{String(index + 1).padStart(2, "0")}</span>
              <strong>{node.name}</strong>
              <span>{node.kind === "application" ? node.repository : node.entityId}</span>
            </div>
            {index < path.nodes.length - 1 && <ArrowRight size={18} aria-hidden="true" />}
          </div>
        ))}
      </div>

      <div className="evidence-list">
        {path.relationships.map((relationship) => (
          <article className={relationship.validWindow ? "evidence-row" : "evidence-row evidence-row--unresolved"} key={relationship.edgeId}>
            {relationship.validWindow ? <FileCheck2 size={17} aria-hidden="true" /> : <CircleHelp size={17} aria-hidden="true" />}
            <div>
              <strong>{relationship.relationshipType}</strong>
              <p>{relationship.evidence}</p>
              <span className={relationship.validWindow ? "" : "evidence-interval--missing"}>
                {relationship.validWindow
                  ? `${formatUtc(relationship.validWindow.start)} to ${formatUtc(relationship.validWindow.end)}`
                  : "Validity interval missing"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const statusText = (status: ExposurePathDto["temporal"]["status"]): string =>
  status === "exposed" ? "Exposed in window" : status === "not_exposed" ? "Outside window" : "Temporal evidence incomplete";
