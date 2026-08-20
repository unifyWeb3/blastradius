import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleHelp,
  CircleSlash2,
  Clock3,
  Database,
  GitBranch,
  LoaderCircle,
  Radar,
  RefreshCw,
  SearchCheck,
  ShieldAlert,
  X,
} from "lucide-react";

import type { BlastRadiusAnalysisDto, ExposureCheckDto, ExposurePathDto } from "../domain/blast-radius.js";
import type { TimeWindow } from "../domain/temporal.js";
import type { IncidentCatalogEntry } from "../server/incident-catalog.js";
import { analyzeIncident, ApiError, checkApplicationExposure, loadIncidents } from "./api.js";
import { BlastRadiusGraph } from "./components/BlastRadiusGraph.js";
import { DependencyPath } from "./components/DependencyPath.js";
import { ExposureTimeline } from "./components/ExposureTimeline.js";
import { formatLatency, fromDateTimeInput, toDateTimeInput } from "./format.js";
import { HomePage } from "./HomePage.js";

interface UiError {
  message: string;
  code?: string;
}

export const App = () => window.location.pathname === "/incident" ? <IncidentConsole /> : <HomePage />;

const IncidentConsole = () => {
  const [incident, setIncident] = useState<IncidentCatalogEntry | null>(null);
  const [analysis, setAnalysis] = useState<BlastRadiusAnalysisDto | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [loadingIncident, setLoadingIncident] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisSlow, setAnalysisSlow] = useState(false);
  const [error, setError] = useState<UiError | null>(null);
  const [checkApplication, setCheckApplication] = useState("");
  const [checkResult, setCheckResult] = useState<ExposureCheckDto | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    loadIncidents()
      .then(([loadedIncident]) => {
        if (!loadedIncident) {
          throw new Error("No incident fixture is available.");
        }
        setIncident(loadedIncident);
        setWindowStart(toDateTimeInput(loadedIncident.compromiseWindow.start));
        setWindowEnd(toDateTimeInput(loadedIncident.compromiseWindow.end));
        setCheckApplication(loadedIncident.applications[0]?.entityId ?? "");
      })
      .catch((loadError: unknown) => setError(toUiError(loadError)))
      .finally(() => setLoadingIncident(false));
  }, []);

  useEffect(() => {
    if (!analyzing) {
      setAnalysisSlow(false);
      return;
    }
    const timer = window.setTimeout(() => setAnalysisSlow(true), 4_000);
    return () => window.clearTimeout(timer);
  }, [analyzing]);

  const requestedWindow = useMemo<TimeWindow | null>(() => {
    const start = fromDateTimeInput(windowStart);
    const end = fromDateTimeInput(windowEnd);
    return Number.isFinite(start) && Number.isFinite(end) && start < end ? { start, end } : null;
  }, [windowEnd, windowStart]);

  const analysisIsStale = Boolean(
    analysis &&
      (!requestedWindow ||
        analysis.requestedWindow.start !== requestedWindow.start ||
        analysis.requestedWindow.end !== requestedWindow.end),
  );

  const selectedCandidate = analysis?.candidateRoots.find(
    (candidate) => candidate.application.entityId === selectedApplication,
  );
  const selectedPath = selectedCandidate ? preferredPath(selectedCandidate.paths, selectedCandidate.status) : null;

  const updateWindowStart = (value: string) => {
    setWindowStart(value);
    setCheckResult(null);
  };

  const updateWindowEnd = (value: string) => {
    setWindowEnd(value);
    setCheckResult(null);
  };

  const runAnalysis = async () => {
    if (!incident || !requestedWindow) {
      setError({ code: "invalid_window", message: "The exposure window must have a start before its end." });
      return;
    }
    setAnalyzing(true);
    setError(null);
    setCheckResult(null);
    setAnalysis(null);
    setSelectedApplication(null);
    try {
      const result = await analyzeIncident(
        incident.id,
        incident.compromisedVersion.entityId,
        requestedWindow,
      );
      setAnalysis(result);
      setSelectedApplication(result.affectedRoots[0]?.entityId ?? result.candidateRoots[0]?.application.entityId ?? null);
    } catch (analysisError) {
      setError(toUiError(analysisError));
    } finally {
      setAnalyzing(false);
    }
  };

  const runExposureCheck = async () => {
    if (!incident || !requestedWindow || !checkApplication || analysisIsStale) {
      return;
    }
    setChecking(true);
    setError(null);
    try {
      setCheckResult(
        await checkApplicationExposure(
          checkApplication,
          incident.compromisedVersion.entityId,
          requestedWindow,
        ),
      );
    } catch (checkError) {
      setError(toUiError(checkError));
    } finally {
      setChecking(false);
    }
  };

  if (loadingIncident) {
    return <FullScreenState icon={<LoaderCircle className="spin" />} label="Loading incident" />;
  }

  if (!incident) {
    return (
      <FullScreenState
        icon={<AlertTriangle />}
        label={error?.message ?? "Incident unavailable"}
        detail={error?.code}
        tone="danger"
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand-lockup" href="/" aria-label="BlastRadius product overview">
          <span className="brand-mark"><ShieldAlert size={20} aria-hidden="true" /></span>
          <strong>BlastRadius</strong>
          <span>Supply-chain incident analysis</span>
        </a>
        <div className="runtime-state" aria-label="HydraDB traversal contract">
          <Database size={15} aria-hidden="true" />
          <span>HydraDB</span>
          <strong>incoming SSpaths</strong>
        </div>
      </header>

      <main className="incident-layout">
        <aside className="incident-sidebar">
          <section className="incident-block">
            <div className="incident-label-row">
              <span className="severity-badge">{incident.advisory.severity}</span>
              <span className="incident-status"><span aria-hidden="true" />{incident.status}</span>
            </div>
            <p className="eyebrow">{incident.advisory.id}</p>
            <h1>{incident.compromisedVersion.packageName}<span>@{incident.compromisedVersion.version}</span></h1>
            <p className="incident-title">{incident.title}</p>
            <div className="advisory-links">
              <a href={incident.advisory.sourceUrl} target="_blank" rel="noreferrer">
                {incident.advisory.cve}<ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <a href={incident.advisory.osvUrl} target="_blank" rel="noreferrer">
                OSV record<ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </section>

          <section className="window-block" aria-labelledby="window-heading">
            <div className="sidebar-heading">
              <Clock3 size={16} aria-hidden="true" />
              <h2 id="window-heading">Exposure window</h2>
            </div>
            <label>
              <span>UTC start</span>
              <input
                type="datetime-local"
                step="0.001"
                value={windowStart}
                aria-invalid={!requestedWindow}
                onChange={(event) => updateWindowStart(event.target.value)}
              />
            </label>
            <label>
              <span>UTC end</span>
              <input
                type="datetime-local"
                step="0.001"
                value={windowEnd}
                aria-invalid={!requestedWindow}
                onChange={(event) => updateWindowEnd(event.target.value)}
              />
            </label>
            {!requestedWindow && <span className="field-error">Start must be before end</span>}
            <button className="primary-button" onClick={runAnalysis} disabled={analyzing || !requestedWindow}>
              {analyzing ? <LoaderCircle className="spin" size={17} /> : analysis ? <RefreshCw size={17} /> : <Radar size={17} />}
              {analyzing ? "Querying HydraDB" : analysis ? "Re-run analysis" : "Analyze blast radius"}
            </button>
          </section>

          <section className="check-block" aria-labelledby="check-heading">
            <div className="sidebar-heading">
              <SearchCheck size={16} aria-hidden="true" />
              <h2 id="check-heading">Application check</h2>
            </div>
            <select value={checkApplication} onChange={(event) => { setCheckApplication(event.target.value); setCheckResult(null); }}>
              {incident.applications.map((application) => (
                <option value={application.entityId} key={application.entityId}>{application.name}</option>
              ))}
            </select>
            <button className="secondary-button" onClick={runExposureCheck} disabled={checking || !analysis || analysisIsStale}>
              {checking ? <LoaderCircle className="spin" size={16} /> : <SearchCheck size={16} />}
              Check exposure
            </button>
            {!analysis && !analyzing && <span className="control-note">Available after a blast-radius analysis.</span>}
            {analysisIsStale && <span className="control-note control-note--stale">Re-run analysis for the edited window.</span>}
            {checkResult && <ExposureCheckResult result={checkResult} />}
          </section>

          <div className="scope-note">
            <GitBranch size={15} aria-hidden="true" />
            <span>{incident.dataScope}</span>
          </div>
        </aside>

        <div className="analysis-workspace">
          {error && (
            <div className="error-banner" role="alert">
              <AlertTriangle size={17} aria-hidden="true" />
              <span>{error.message}</span>
              {error.code && <code>{error.code}</code>}
              <button aria-label="Dismiss error" title="Dismiss" onClick={() => setError(null)}><X size={15} /></button>
            </div>
          )}

          {analysisIsStale && (
            <div className="stale-banner" role="status">
              <Clock3 size={16} aria-hidden="true" />
              <div>
                <strong>Analysis window changed</strong>
                <span>The visible graph uses the previous window. Re-run before making an exposure decision.</span>
              </div>
            </div>
          )}

          <section className="summary-band" aria-label="Analysis summary">
            <SummaryMetric label="Exposed applications" value={analysis?.affectedRootCount ?? "—"} hint="affectedRoots[]" tone="danger" />
            <SummaryMetric label="Topological candidates" value={analysis?.candidateRootCount ?? "—"} hint="candidateRoots[]" />
            <SummaryMetric label="HydraDB query" value={analysis ? formatLatency(analysis.timing.hydraQueryMs) : "—"} hint="timing.hydraQueryMs" />
            <SummaryMetric
              label="Traversal"
              value={analysis ? `${analysis.traversal.direction} · ${analysis.traversal.maxLength} hops` : "—"}
              hint={analysis ? `${analysis.traversal.pathCount} paths · ${analysis.traversal.resultLimit} result cap` : "algo.SSpaths"}
            />
          </section>

          <div className="graph-row">
            <section className="graph-panel" aria-labelledby="graph-heading" aria-busy={analyzing}>
              <div className="panel-toolbar">
                <div>
                  <p>Incident graph</p>
                  <h2 id="graph-heading">Transitive blast radius</h2>
                </div>
                {analysis && (
                  <span className={analysisIsStale ? "panel-meta panel-meta--stale" : "panel-meta"}>
                    {analysis.graph.nodes.length} nodes · {analysis.graph.relationships.length} edges
                  </span>
                )}
              </div>
              {analysis && analysis.graph.nodes.length > 0 ? (
                <BlastRadiusGraph analysis={analysis} selectedPath={selectedPath} onSelectApplication={setSelectedApplication} />
              ) : (
                <WorkspaceEmpty analyzing={analyzing} slow={analysisSlow} empty={Boolean(analysis)} />
              )}
              <GraphLegend analysis={analysis} />
            </section>

            <section className="applications-panel" aria-labelledby="applications-heading" aria-busy={analyzing}>
              <div className="panel-toolbar">
                <div>
                  <p>Root inventory</p>
                  <h2 id="applications-heading">Application paths</h2>
                </div>
                {analysis && <span className="panel-meta">{analysis.candidateRootCount} returned</span>}
              </div>
              <div className="application-list">
                {analysis ? (
                  analysis.candidateRoots.length > 0 ? analysis.candidateRoots.map((candidate) => {
                    const path = preferredPath(candidate.paths, candidate.status);
                    return (
                      <button
                        className={candidate.application.entityId === selectedApplication ? "application-row application-row--selected" : "application-row"}
                        onClick={() => setSelectedApplication(candidate.application.entityId)}
                        aria-pressed={candidate.application.entityId === selectedApplication}
                        key={candidate.application.entityId}
                      >
                        <span className={`application-status application-status--${candidate.status}`} aria-hidden="true">
                          {candidate.status === "exposed" ? <ShieldAlert size={16} /> : candidate.status === "unresolved" ? <CircleHelp size={16} /> : <CheckCircle2 size={16} />}
                        </span>
                        <span>
                          <strong>{candidate.application.name}</strong>
                          <small>{path ? `${path.hopCount} hops` : "No hydrated path"} · <em>{statusRowText(candidate.status)}</em></small>
                        </span>
                      </button>
                    );
                  }) : (
                    <div className="root-empty">
                      <CircleSlash2 size={18} aria-hidden="true" />
                      <strong>No candidate roots</strong>
                      <span>HydraDB returned no supporting application path.</span>
                    </div>
                  )
                ) : <span className="muted-state">No analysis result</span>}
              </div>
            </section>
          </div>

          {selectedPath ? (
            <div className="evidence-grid">
              <DependencyPath path={selectedPath} />
              <ExposureTimeline path={selectedPath} />
            </div>
          ) : (
            <section className="evidence-empty">
              <CircleSlash2 size={20} aria-hidden="true" />
              <div>
                <strong>{analysis?.candidateRootCount === 0 ? "No supporting dependency paths" : "No path selected"}</strong>
                <span>{analysis?.candidateRootCount === 0 ? "The traversal returned no application roots for this compromised version." : "Run the analysis, then select an application path."}</span>
              </div>
            </section>
          )}

          <div className="scope-note scope-note--mobile">
            <GitBranch size={15} aria-hidden="true" />
            <span>{incident.dataScope}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

const SummaryMetric = ({ label, value, hint, tone }: { label: string; value: string | number; hint: string; tone?: "danger" }) => (
  <div className={tone ? "summary-metric summary-metric--danger" : "summary-metric"}>
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{hint}</small>
  </div>
);

const WorkspaceEmpty = ({ analyzing, slow, empty }: { analyzing: boolean; slow: boolean; empty: boolean }) => (
  <div className="workspace-empty">
    {analyzing ? <LoaderCircle className="spin" size={28} /> : empty ? <CircleSlash2 size={28} /> : <Radar size={28} />}
    <strong>{analyzing ? "Querying HydraDB" : empty ? "No dependency paths" : "Analysis pending"}</strong>
    <span>
      {analyzing
        ? slow
          ? "Traversal is still active; results appear after the complete response."
          : "Incoming SSpaths traversal"
        : empty
          ? "No graph result"
          : "No graph result"}
    </span>
  </div>
);

const GraphLegend = ({ analysis }: { analysis: BlastRadiusAnalysisDto | null }) => {
  const statuses = new Set(analysis?.candidateRoots.map((candidate) => candidate.status) ?? []);
  return (
    <div className="graph-legend" aria-label="Graph legend">
      <LegendKey kind="compromised" label="Compromised version" />
      {statuses.has("exposed") && <LegendKey kind="exposed" label="Exposed application" />}
      {statuses.has("not_exposed") && <LegendKey kind="not-exposed" label="Outside window" />}
      {statuses.has("unresolved") && <LegendKey kind="unresolved" label="Unresolved" />}
      <LegendKey kind="dependency" label="Intermediate dependency" />
      {analysis && <LegendKey kind="selected" label="Selected path" />}
      <LegendKey kind="edge" label="DEPENDS_ON" />
    </div>
  );
};

const LegendKey = ({ kind, label }: { kind: string; label: string }) => (
  <span className="legend-key"><i className={`legend-key__swatch legend-key__swatch--${kind}`} aria-hidden="true" />{label}</span>
);

const ExposureCheckResult = ({ result }: { result: ExposureCheckDto }) => {
  if (result.reason === "no_supporting_dependency_path") {
    return (
      <div className="check-result check-result--clear" role="status">
        <CircleSlash2 size={18} aria-hidden="true" />
        <div><strong>Not exposed</strong><span>No supporting dependency path found.</span></div>
      </div>
    );
  }
  if (result.status === "exposed") {
    return (
      <div className="check-result check-result--danger" role="status">
        <ShieldAlert size={18} aria-hidden="true" />
        <div><strong>Exposed</strong><span>{result.path.hopCount} hop dependency path</span></div>
      </div>
    );
  }
  if (result.status === "unresolved") {
    return (
      <div className="check-result check-result--unresolved" role="status">
        <CircleHelp size={18} aria-hidden="true" />
        <div>
          <strong>Temporal result unresolved</strong>
          <span>A dependency edge on the supporting path has no validity interval. Exposure can be neither confirmed nor ruled out.</span>
          <code>reason: {result.reason}</code>
        </div>
      </div>
    );
  }
  return (
    <div className="check-result check-result--outside" role="status">
      <CheckCircle2 size={18} aria-hidden="true" />
      <div><strong>Not exposed in window</strong><span>Path has no common temporal overlap.</span></div>
    </div>
  );
};

const FullScreenState = ({ icon, label, detail, tone }: { icon: React.ReactNode; label: string; detail?: string; tone?: "danger" }) => (
  <div className={tone ? "full-screen-state full-screen-state--danger" : "full-screen-state"}>
    {icon}<strong>{label}</strong>{detail && <code>{detail}</code>}
  </div>
);

const preferredPath = (paths: ExposurePathDto[], status: string): ExposurePathDto | null =>
  paths.find((path) => path.temporal.status === status) ?? paths[0] ?? null;

const statusRowText = (status: BlastRadiusAnalysisDto["candidateRoots"][number]["status"]): string =>
  status === "exposed" ? "active exposure" : status === "not_exposed" ? "outside window" : "validity missing";

const toUiError = (error: unknown): UiError =>
  error instanceof ApiError
    ? { code: error.code, message: error.message }
    : error instanceof Error
      ? { message: error.message }
      : { message: "Unexpected error." };
