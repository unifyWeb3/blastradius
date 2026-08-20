/* Left incident rail: identity, the UTC window, and the single-application check. */
function IncidentSidebar({
  incident,
  windowStart,
  windowEnd,
  onWindowStart,
  onWindowEnd,
  windowValid,
  analyzing,
  hasAnalysis,
  onAnalyze,
  checkApplication,
  onCheckApplication,
  checking,
  checkResult,
  onCheck,
  mobile,
}) {
  const NS = window.BlastRadiusDesignSystem_6e5e22;
  const { SeverityBadge, StatusDot, Field, Select, Button, SectionHeading, CheckResult, ScopeNote, Icon } = NS;
  const block = { padding: mobile ? 15 : "var(--pad-sidebar-section)", borderBottom: "1px solid var(--border-subtle)" };
  return (
    <aside
      style={{
        width: mobile ? "100%" : "var(--sidebar-width)",
        flex: "none",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface-panel)",
        borderRight: mobile ? "none" : "1px solid var(--border-subtle)",
        borderBottom: mobile ? "1px solid var(--border-subtle)" : "none",
      }}
    >
      <section style={block}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <SeverityBadge severity={incident.advisory.severity} />
          <StatusDot tone="active" label="Active" />
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--status-compromised)",
            textTransform: "uppercase",
          }}
        >
          {incident.advisory.id}
        </div>
        <h1
          style={{
            marginTop: 7,
            fontFamily: "var(--font-sans)",
            fontSize: "var(--type-display-size)",
            fontWeight: 600,
            lineHeight: "var(--type-display-line)",
            letterSpacing: "var(--type-display-tracking)",
            overflowWrap: "anywhere",
          }}
        >
          {incident.compromisedVersion.packageName}
          <span
            style={{
              display: "block",
              marginTop: 4,
              fontSize: "var(--type-version-size)",
              color: "var(--status-compromised)",
              letterSpacing: "var(--type-version-tracking)",
            }}
          >
            @{incident.compromisedVersion.version}
          </span>
        </h1>
        <p style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.5, color: "var(--text-secondary)" }}>
          {incident.title}
        </p>
        <div style={{ marginTop: 13, display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[
            { href: incident.advisory.sourceUrl, label: incident.advisory.cve },
            { href: incident.advisory.osvUrl, label: "OSV record" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                color: "var(--link-fg)",
              }}
            >
              {l.label}
              <Icon name="arrow-up-right" size={13} strokeWidth={2} />
            </a>
          ))}
        </div>
      </section>

      <section style={block}>
        <SectionHeading icon="clock-3" title="Exposure window" align="center" style={{ marginBottom: 14 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field
            label="UTC start"
            inputProps={{ type: "datetime-local", step: "0.001", value: windowStart, onChange: onWindowStart }}
          />
          <Field
            label="UTC end"
            invalid={!windowValid}
            hint={!windowValid ? "Start must be before end" : undefined}
            inputProps={{ type: "datetime-local", step: "0.001", value: windowEnd, onChange: onWindowEnd }}
          />
          <Button
            variant="primary"
            block
            icon={hasAnalysis ? "refresh-cw" : "radar"}
            loading={analyzing}
            disabled={!windowValid}
            onClick={onAnalyze}
            style={{ marginTop: 2 }}
          >
            {analyzing ? "Querying HydraDB" : hasAnalysis ? "Re-run analysis" : "Analyze blast radius"}
          </Button>
        </div>
      </section>

      <section style={block}>
        <SectionHeading icon="search-check" title="Application check" align="center" style={{ marginBottom: 14 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Select
            value={checkApplication}
            onChange={onCheckApplication}
            options={incident.applications.map((a) => ({ value: a.entityId, label: a.name }))}
          />
          <Button
            variant="secondary"
            block
            icon="search-check"
            loading={checking}
            disabled={!hasAnalysis}
            onClick={onCheck}
          >
            Check exposure
          </Button>
          {!hasAnalysis ? (
            <span style={{ fontSize: 10, color: "var(--text-faint)", lineHeight: 1.4 }}>
              Available after a blast-radius analysis.
            </span>
          ) : null}
          {checkResult ? <CheckResult reason={checkResult.reason} hopCount={checkResult.hopCount} /> : null}
        </div>
      </section>

      {mobile ? null : <ScopeNote>{incident.dataScope}</ScopeNote>}
    </aside>
  );
}

Object.assign(window, { IncidentSidebar });
