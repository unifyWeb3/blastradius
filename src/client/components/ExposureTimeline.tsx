import type { ExposurePathDto } from "../../domain/blast-radius.js";
import { formatDuration, formatUtc } from "../format.js";

interface TimelineBar {
  id: string;
  label: string;
  window: { start: number; end: number };
  tone: "danger" | "dependency" | "effective";
}

export const ExposureTimeline = ({ path }: { path: ExposurePathDto }) => {
  const bars: TimelineBar[] = [
    { id: "compromise", label: "Compromise", window: path.temporal.compromisedWindow, tone: "danger" },
    ...path.relationships.flatMap((relationship, index) =>
      relationship.validWindow
        ? [{ id: relationship.edgeId, label: `Dependency ${index + 1}`, window: relationship.validWindow, tone: "dependency" as const }]
        : [],
    ),
    ...(path.temporal.effectiveWindow
      ? [{ id: "effective", label: "Effective exposure", window: path.temporal.effectiveWindow, tone: "effective" as const }]
      : []),
  ];
  const domainStart = Math.min(...bars.map((bar) => bar.window.start));
  const domainEnd = Math.max(...bars.map((bar) => bar.window.end));
  const domainLength = Math.max(1, domainEnd - domainStart);

  return (
    <section className="timeline-panel" aria-labelledby="timeline-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <span className="section-kicker">Half-open interval policy</span>
          <h2 id="timeline-heading">Exposure timeline</h2>
        </div>
        <span className="timeline-duration">
          {path.temporal.effectiveWindow ? formatDuration(path.temporal.effectiveWindow) : "No overlap"}
        </span>
      </div>
      <div className="timeline-axis">
        <span>{formatUtc(domainStart)}</span>
        <span>{formatUtc(domainEnd)}</span>
      </div>
      <div className="timeline-bars">
        {bars.map((bar) => {
          const left = ((bar.window.start - domainStart) / domainLength) * 100;
          const width = Math.max(1.5, ((bar.window.end - bar.window.start) / domainLength) * 100);
          return (
            <div className="timeline-row" key={bar.id}>
              <span>{bar.label}</span>
              <div className="timeline-track">
                <div
                  className={`timeline-bar timeline-bar--${bar.tone}`}
                  style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }}
                  title={`${formatUtc(bar.window.start)} to ${formatUtc(bar.window.end)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
