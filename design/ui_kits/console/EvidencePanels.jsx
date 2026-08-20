/* Lower evidence row: the ordered path with its relationship evidence, and the UTC timeline. */
function PathEvidence({ path }) {
  const NS = window.BlastRadiusDesignSystem_6e5e22;
  const { SectionHeading, StatusPill, ChainNode, EvidenceRow, Icon } = NS;
  const fmt = window.brFormatUtc;
  return (
    <section style={{ padding: "var(--pad-panel)", minWidth: 0, borderRight: "1px solid var(--border-subtle)" }}>
      <SectionHeading
        kicker="Selected evidence path"
        title={path.application.name}
        right={<StatusPill status={path.temporal.status} />}
      />
      <div
        style={{
          marginTop: 16,
          display: "flex",
          alignItems: "stretch",
          gap: 6,
          overflowX: "auto",
          paddingBottom: 8,
        }}
        aria-label="Ordered dependency path"
      >
        {path.nodes.map((n, i) => (
          <div key={n.entityId} style={{ display: "flex", alignItems: "center", gap: 6, flex: "none" }}>
            <ChainNode
              index={i + 1}
              role={
                n.entityId === path.compromisedVersion.entityId
                  ? "compromised"
                  : n.kind === "application"
                    ? "application"
                    : "dependency"
              }
              name={n.name}
              detail={n.kind === "application" ? n.repository : n.entityId}
            />
            {i < path.nodes.length - 1 ? (
              <Icon name="arrow-right" size={17} style={{ color: "var(--text-faint)" }} />
            ) : null}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
        {path.relationships.map((r) => (
          <EvidenceRow
            key={r.edgeId}
            relationshipType={r.relationshipType}
            evidence={r.evidence}
            interval={r.validWindow ? `${fmt(r.validWindow.start)} → ${fmt(r.validWindow.end)}` : undefined}
          />
        ))}
      </div>
    </section>
  );
}

function ExposureTimeline({ path }) {
  const NS = window.BlastRadiusDesignSystem_6e5e22;
  const { SectionHeading, TimelineRow } = NS;
  const fmt = window.brFormatUtc;
  const bars = [
    { id: "compromise", label: "Compromise", window: path.temporal.compromisedWindow, tone: "compromise" },
    ...path.relationships.map((r, i) => ({
      id: r.edgeId,
      label: `Dependency ${i + 1}`,
      window: r.validWindow,
      tone: r.validWindow ? "dependency" : "unresolved",
    })),
    ...(path.temporal.effectiveWindow
      ? [{ id: "effective", label: "Effective exposure", window: path.temporal.effectiveWindow, tone: "effective" }]
      : []),
  ];
  const measured = bars.filter((b) => b.window);
  const domainStart = Math.min(...measured.map((b) => b.window.start));
  const domainEnd = Math.max(...measured.map((b) => b.window.end));
  const domain = Math.max(1, domainEnd - domainStart);
  const overlap = path.temporal.effectiveWindow;

  return (
    <section style={{ padding: "var(--pad-panel)", minWidth: 0 }}>
      <SectionHeading
        kicker="Half-open interval policy"
        title="Exposure timeline"
        align="center"
        right={
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              fontFeatureSettings: "var(--numeric-tabular)",
              color: overlap ? "var(--status-exposed)" : "var(--text-muted)",
            }}
          >
            {overlap ? window.brFormatDuration(overlap) : "No overlap"}
          </span>
        }
      />
      <div
        style={{
          margin: "18px 0 8px var(--timeline-label-width)",
          paddingLeft: 8,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "var(--text-faint)",
        }}
      >
        <span>{fmt(domainStart)}</span>
        <span>{fmt(domainEnd)}</span>
      </div>
      <div>
        {bars.map((b) => (
          <TimelineRow
            key={b.id}
            label={b.label}
            tone={b.tone}
            left={b.window ? ((b.window.start - domainStart) / domain) * 100 : 0}
            width={b.window ? ((b.window.end - b.window.start) / domain) * 100 : 100}
            title={b.window ? `${fmt(b.window.start)} → ${fmt(b.window.end)}` : "No validity interval"}
          />
        ))}
      </div>
      <p style={{ marginTop: 14, fontSize: 10.5, lineHeight: 1.5, color: "var(--text-muted)" }}>
        Intervals are half-open <code style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>[start, end)</code>;
        touching boundaries do not overlap.
      </p>
    </section>
  );
}

Object.assign(window, { PathEvidence, ExposureTimeline });
