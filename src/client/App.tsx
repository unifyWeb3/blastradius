import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleSlash2,
  Clock3,
  Database,
  GitBranch,
  LoaderCircle,
  Radar,
  RefreshCw,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";

import type { BlastRadiusAnalysisDto, ExposureCheckDto, ExposurePathDto } from "../domain/blast-radius.js";
import type { TimeWindow } from "../domain/temporal.js";
import type { IncidentCatalogEntry } from "../server/incident-catalog.js";
import { analyzeIncident, checkApplicationExposure, loadIncidents } from "./api.js";
import { BlastRadiusGraph } from "./components/BlastRadiusGraph.js";
import { DependencyPath } from "./components/DependencyPath.js";
import { ExposureTimeline } from "./components/ExposureTimeline.js";
import { formatLatency, formatUtc, fromDateTimeInput, toDateTimeInput } from "./format.js";

export const App = () => {
  const [incident, setIncident] = useState<IncidentCatalogEntry | null>(null);
  const [analysis, setAnalysis] = useState<BlastRadiusAnalysisDto | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [loadingIncident, setLoadingIncident] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      .catch((loadError: unknown) => setError(errorMessage(loadError)))
      .finally(() => setLoadingIncident(false));
  }, []);

  const requestedWindow = useMemo<TimeWindow | null>(() => {
    const start = fromDateTimeInput(windowStart);
    const end = fromDateTimeInput(windowEnd);
    return Number.isFinite(start) && Number.isFinite(end) && start < end ? { start, end } : null;
  }, [windowEnd, windowStart]);

  const selectedCandidate = analysis?.candidateRoots.find(
    (candidate) => candidate.application.entityId === selectedApplication,
  );
  const selectedPath = selectedCandidate ? preferredPath(selectedCandidate.paths, selectedCandidate.status) : null;

  const runAnalysis = async () => {
    if (!incident || !requestedWindow) {
      setError("The exposure window must have a start before its end.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    setCheckResult(null);
    try {
      const result = await analyzeIncident(
        incident.id,
        incident.compromisedVersion.entityId,
        requestedWindow,
      );
      setAnalysis(result);
      setSelectedApplication(result.affectedRoots[0]?.entityId ?? result.candidateRoots[0]?.application.entityId ?? null);
    } catch (analysisError) {
      setError(errorMessage(analysisError));
    } finally {
      setAnalyzing(false);
    }
  };

  const runExposureCheck = async () => {
    if (!incident || !requestedWindow || !checkApplication) {
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
      setError(errorMessage(checkError));
    } finally {
      setChecking(false);
    }
  };

  if (loadingIncident) {
    return <FullScreenState icon={<LoaderCircle className="spin" />} label="Loading incident" />;
  }

  if (!incident) {
    return <FullScreenState icon={<AlertTriangle />} label={error ?? "Incident unavailable"} tone="danger" />;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark"><ShieldAlert size={20} aria-hidden="true" /></span>
          <strong>BlastRadius</strong>
          <span>Supply-chain incident analysis</span>
        </div>
        <div className="runtime-state">
          <Database size={15} aria-hidden="true" />
          <span>HydraDB</span>
          <strong>incoming SSpaths</strong>
        </div>
      </header>

      <main className="incident-layout">
        <aside className="incident-sidebar">
          <section className="incident-block">
            <div className="incident-label-row">
              <span className="severity-badge">Critical</span>
              <span className="incident-status"><span /> Active</span>
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
              <input type="datetime-local" step="0.001" value={windowStart} onChange={(event) => setWindowStart(event.target.value)} />
            </label>
            <label>
              <span>UTC end</span>
              <input type="datetime-local" step="0.001" value={windowEnd} onChange={(event) => setWindowEnd(event.target.value)} />
            </label>
            <button className="primary-button" onClick={runAnalysis} disabled={analyzing || !requestedWindow}>
              {analyzing ? <LoaderCircle className="spin" size={17} /> : <Radar size={17} />}
              {analysis ? "Re-run analysis" : "Analyze blast radius"}
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
            <button className="secondary-button" onClick={runExposureCheck} disabled={checking || !analysis}>
              {checking ? <LoaderCircle className="spin" size={16} /> : <SearchCheck size={16} />}
              Check exposure
            </button>
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
              <span>{error}</span>
              <button aria-label="Dismiss error" title="Dismiss" onClick={() => setError(null)}>×</button>
            </div>
          )}

          <section className="summary-band" aria-label="Analysis summary">
            <SummaryMetric label="Exposed applications" value={analysis?.affectedRootCount ?? "—"} tone="danger" />
            <SummaryMetric label="Topological candidates" value={analysis?.candidateRootCount ?? "—"} />
            <SummaryMetric label="HydraDB query" value={analysis ? formatLatency(analysis.timing.hydraQueryMs) : "—"} />
            <SummaryMetric label="Traversal" value={analysis ? `${analysis.traversal.direction} · ${analysis.traversal.maxLength} hops` : "—"} />
          </section>

          <div className="graph-row">
            <section className="graph-panel" aria-labelledby="graph-heading">
              <div className="panel-toolbar">
                <div>
                  <p>Incident graph</p>
                  <h2 id="graph-heading">Transitive blast radius</h2>
                </div>
                {analysis && <span>{analysis.graph.nodes.length} nodes · {analysis.graph.relationships.length} edges</span>}
              </div>
              {analysis ? (
                <BlastRadiusGraph analysis={analysis} selectedPath={selectedPath} onSelectApplication={setSelectedApplication} />
              ) : (
                <WorkspaceEmpty analyzing={analyzing} />
              )}
            </section>

            <section className="applications-panel" aria-labelledby="applications-heading">
              <div className="panel-toolbar">
                <div>
                  <p>Root inventory</p>
                  <h2 id="applications-heading">Application paths</h2>
                </div>
              </div>
              <div className="application-list">
                {analysis?.candidateRoots.map((candidate) => (
                  <button
                    className={candidate.application.entityId === selectedApplication ? "application-row application-row--selected" : "application-row"}
                    onClick={() => setSelectedApplication(candidate.application.entityId)}
                    key={candidate.application.entityId}
                  >
                    <span className={`application-status application-status--${candidate.status}`}>
                      {candidate.status === "exposed" ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />}
                    </span>
                    <span>
                      <strong>{candidate.application.name}</strong>
                      <small>{candidate.paths[0].hopCount} hops · {candidate.status === "exposed" ? "active exposure" : "outside window"}</small>
                    </span>
                  </button>
                )) ?? <span className="muted-state">No analysis result</span>}
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
              <span>No path selected</span>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

const SummaryMetric = ({ label, value, tone }: { label: string; value: string | number; tone?: "danger" }) => (
  <div className={tone ? "summary-metric summary-metric--danger" : "summary-metric"}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const WorkspaceEmpty = ({ analyzing }: { analyzing: boolean }) => (
  <div className="workspace-empty">
    {analyzing ? <LoaderCircle className="spin" size={28} /> : <Radar size={28} />}
    <strong>{analyzing ? "Querying HydraDB" : "Analysis pending"}</strong>
    <span>{analyzing ? "Incoming SSpaths traversal" : "No graph result"}</span>
  </div>
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
  return (
    <div className="check-result" role="status">
      <CheckCircle2 size={18} aria-hidden="true" />
      <div><strong>Not exposed in window</strong><span>Path has no common temporal overlap.</span></div>
    </div>
  );
};

const FullScreenState = ({ icon, label, tone }: { icon: React.ReactNode; label: string; tone?: "danger" }) => (
  <div className={tone ? "full-screen-state full-screen-state--danger" : "full-screen-state"}>{icon}<strong>{label}</strong></div>
);

const preferredPath = (paths: ExposurePathDto[], status: string): ExposurePathDto =>
  paths.find((path) => path.temporal.status === status) ?? paths[0];

const errorMessage = (error: unknown): string => error instanceof Error ? error.message : "Unexpected error.";
