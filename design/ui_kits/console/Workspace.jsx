/* BlastRadius incident workspace — one route, all states. */
function useBreakpoint() {
  const [w, setW] = React.useState(typeof window !== "undefined" ? window.innerWidth : 1440);
  React.useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w <= 820 ? "sm" : w <= 1100 ? "md" : "lg";
}

function Workspace({ startLoading = true, forceBp }) {
  const NS = window.BlastRadiusDesignSystem_6e5e22;
  const { TopBar, Panel, SummaryMetric, ApplicationRow, EmptyState, ErrorBanner, FullScreenState, GraphLegend, ScopeNote } = NS;
  const incident = window.brIncident;
  const bp = forceBp || useBreakpoint();
  const sm = bp === "sm";

  const [loading, setLoading] = React.useState(startLoading);
  const [analysis, setAnalysis] = React.useState(null);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [selected, setSelected] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [windowStart, setWindowStart] = React.useState(window.brToDateTimeInput(incident.compromiseWindow.start));
  const [windowEnd, setWindowEnd] = React.useState(window.brToDateTimeInput(incident.compromiseWindow.end));
  const [checkApplication, setCheckApplication] = React.useState(incident.applications[0].entityId);
  const [checking, setChecking] = React.useState(false);
  const [checkResult, setCheckResult] = React.useState(null);

  React.useEffect(() => {
    if (!startLoading) return;
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [startLoading]);

  const windowValid = Date.parse(windowStart + "Z") < Date.parse(windowEnd + "Z");

  const runAnalysis = () => {
    setAnalyzing(true);
    setError(null);
    setCheckResult(null);
    setTimeout(() => {
      const result = window.brAnalysis;
      setAnalysis(result);
      setSelected(
        result.candidateRoots.find((c) => c.status === "exposed")?.application.entityId ||
          result.candidateRoots[0].application.entityId,
      );
      setAnalyzing(false);
    }, 850);
  };

  const runCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setCheckResult(window.brCheckOutcomes[checkApplication]);
      setChecking(false);
    }, 500);
  };

  if (loading) return <FullScreenState busy label="Loading incident" detail="GET /api/incidents" />;

  const candidate = analysis?.candidateRoots.find((c) => c.application.entityId === selected);
  const path = candidate?.paths[0] || null;

  return (
    <div style={{ minHeight: forceBp ? 0 : "100vh", display: "flex", flexDirection: "column", background: "var(--bg-app)" }}>
      <TopBar compact={sm} />
      <main style={{ flex: 1, display: "flex", flexDirection: sm ? "column" : "row", minHeight: 0 }}>
        <div style={{ width: sm ? "100%" : bp === "md" ? "var(--sidebar-width-md)" : "var(--sidebar-width)", flex: "none", display: "flex" }}>
          <window.IncidentSidebar
            incident={incident}
            mobile={sm}
            windowStart={windowStart}
            windowEnd={windowEnd}
            onWindowStart={(e) => setWindowStart(e.target.value)}
            onWindowEnd={(e) => setWindowEnd(e.target.value)}
            windowValid={windowValid}
            analyzing={analyzing}
            hasAnalysis={!!analysis}
            onAnalyze={runAnalysis}
            checkApplication={checkApplication}
            onCheckApplication={(e) => {
              setCheckApplication(e.target.value);
              setCheckResult(null);
            }}
            checking={checking}
            checkResult={checkResult}
            onCheck={runCheck}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0, padding: sm ? "0 10px 18px" : "0 18px 24px" }}>
          {error ? (
            <div style={{ marginTop: 12 }}>
              <ErrorBanner message={error} onDismiss={() => setError(null)} />
            </div>
          ) : null}

          <section
            aria-label="Analysis summary"
            style={{
              display: "grid",
              gridTemplateColumns: sm ? "repeat(2, minmax(0,1fr))" : "repeat(4, minmax(0,1fr))",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <SummaryMetric
              label="Exposed applications"
              value={analysis ? analysis.affectedRootCount : "—"}
              tone="danger"
              hint="affectedRoots[]"
            />
            <SummaryMetric
              label="Topological candidates"
              value={analysis ? analysis.candidateRootCount : "—"}
              hint="candidateRoots[]"
              divider={!sm}
            />
            <SummaryMetric
              label="HydraDB query"
              value={analysis ? window.brFormatLatency(analysis.timing.hydraQueryMs) : "—"}
              hint="timing.hydraQueryMs"
              style={{ borderTop: sm ? "1px solid var(--border-subtle)" : undefined }}
            />
            <SummaryMetric
              label="Traversal"
              value={analysis ? analysis.traversal.direction : "—"}
              hint={analysis ? `${analysis.traversal.maxLength} hop cap` : "algo.SSpaths"}
              divider={false}
              style={{ borderTop: sm ? "1px solid var(--border-subtle)" : undefined }}
            />
          </section>

          <div
            style={{
              display: sm ? "block" : "grid",
              gridTemplateColumns: `minmax(0,1fr) ${bp === "md" ? "var(--root-inventory-width-md)" : "var(--root-inventory-width)"}`,
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <Panel
              kicker="Incident graph"
              title="Transitive blast radius"
              meta={analysis ? `${analysis.graph.nodes.length} nodes · ${analysis.graph.relationships.length} edges` : null}
              style={{ borderRight: sm ? "none" : "1px solid var(--border-subtle)" }}
            >
              {analysis ? (
                <window.GraphCanvas
                  analysis={analysis}
                  selectedPath={path}
                  onSelectApplication={setSelected}
                  height={sm ? "var(--graph-canvas-height-sm)" : "var(--graph-canvas-height)"}
                />
              ) : (
                <EmptyState
                  busy={analyzing}
                  label={analyzing ? "Querying HydraDB" : "Analysis pending"}
                  sublabel={analyzing ? "Incoming SSpaths traversal" : "No graph result"}
                  height={sm ? "var(--graph-canvas-height-sm)" : "var(--graph-canvas-height)"}
                />
              )}
              <div
                style={{
                  padding: "9px 14px",
                  borderTop: "1px solid var(--border-subtle)",
                  background: "var(--gr-925)",
                }}
              >
                <GraphLegend
                  keys={analysis ? ["compromised", "exposed", "not_exposed", "dependency", "selected", "edge"] : ["compromised", "exposed", "edge"]}
                />
              </div>
            </Panel>

            <Panel
              kicker="Root inventory"
              title="Application paths"
              style={{ borderTop: sm ? "1px solid var(--border-subtle)" : "none" }}
            >
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {analysis ? (
                  analysis.candidateRoots.map((c) => (
                    <ApplicationRow
                      key={c.application.entityId}
                      name={c.application.name}
                      status={c.status}
                      hopCount={c.paths[0].hopCount}
                      selected={c.application.entityId === selected}
                      onSelect={() => setSelected(c.application.entityId)}
                    />
                  ))
                ) : (
                  <span style={{ display: "block", padding: 16, fontSize: 11, color: "var(--text-faint)" }}>
                    No analysis result
                  </span>
                )}
              </div>
            </Panel>
          </div>

          {path ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: bp === "lg" ? "minmax(0,1.4fr) minmax(330px,0.8fr)" : "minmax(0,1fr)",
              }}
            >
              <window.PathEvidence path={path} />
              <window.ExposureTimeline path={path} />
            </div>
          ) : (
            <EmptyState icon="circle-slash-2" label="No path selected" height={180} grid={false} />
          )}

          {sm ? <ScopeNote style={{ marginTop: 0 }}>{incident.dataScope}</ScopeNote> : null}
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { Workspace, useBreakpoint });
