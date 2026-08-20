import type { ExposurePathDto } from "../../domain/blast-radius.js";
import { formatDuration, formatUtc } from "../format.js";

interface TimelineBar {
  id: string;
  label: string;
  window: { start: number; end: number } | null;
  tone: "danger" | "dependency" | "effective" | "unresolved";
}

export const ExposureTimeline = ({ path }: { path: ExposurePathDto }) => {
  const bars: TimelineBar[] = [
    { id: "compromise", label: "Compromise", window: path.temporal.compromisedWindow, tone: "danger" },
    ...path.relationships.flatMap((relationship, index) =>
      [{
        id: relationship.edgeId,
        label: relationship.validWindow ? `Dependency ${index + 1}` : `Dependency ${index + 1} · missing interval`,
        window: relationship.validWindow,
        tone: relationship.validWindow ? "dependency" as const : "unresolved" as const,
      }],
    ),
    ...(path.temporal.effectiveWindow
      ? [{ id: "effective", label: "Effective exposure", window: path.temporal.effectiveWindow, tone: "effective" as const }]
      : []),
  ];
  const windows = bars.flatMap((bar) => bar.window ? [bar.window] : []);
  const domainStart = Math.min(...windows.map((window) => window.start));
  const domainEnd = Math.max(...windows.map((window) => window.end));
  const domainLength = Math.max(1, domainEnd - domainStart);

  return (
    <section className="timeline-panel" aria-labelledby="timeline-heading">
      <div className="section-heading section-heading--compact">
        <div>
          <span className="section-kicker">Half-open interval policy</span>
          <h2 id="timeline-heading">Exposure timeline</h2>
        </div>
        <span className="timeline-duration">
          {path.temporal.status === "exposed"
            ? path.temporal.effectiveWindow ? formatDuration(path.temporal.effectiveWindow) : "—"
            : path.temporal.status === "unresolved" ? "Unresolved" : "No overlap"}
        </span>
      </div>
      <p className="timeline-policy">Intervals are half-open <code>[start, end)</code>; touching boundaries do not overlap.</p>
      <div className="timeline-axis">
        <span>{formatUtc(domainStart)}</span>
        <span>{formatUtc(domainEnd)}</span>
      </div>
      <div className="timeline-bars">
        {bars.map((bar) => {
          const left = bar.window ? ((bar.window.start - domainStart) / domainLength) * 100 : 0;
          const width = bar.window ? Math.max(1.5, ((bar.window.end - bar.window.start) / domainLength) * 100) : 0;
          return (
            <div className="timeline-row" key={bar.id}>
              <span>{bar.label}</span>
              <div className={bar.window ? "timeline-track" : "timeline-track timeline-track--unresolved"}>
                {bar.window ? (
                  <div
                    className={`timeline-bar timeline-bar--${bar.tone}`}
                    style={{ left: `${left}%`, width: `${Math.min(width, 100 - left)}%` }}
                    title={`${formatUtc(bar.window.start)} to ${formatUtc(bar.window.end)}`}
                  />
                ) : <span className="timeline-missing">missing</span>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
