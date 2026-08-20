import React from "react";

/** One reading in the analysis summary band. Values are tabular; an em dash means "not queried yet", never zero. */
export function SummaryMetric({ label, value = "—", unit, tone = "default", hint, divider = true, style, ...rest }) {
  const color =
    tone === "danger"
      ? "var(--status-exposed)"
      : tone === "healthy"
        ? "var(--status-healthy)"
        : "var(--text-primary)";
  const pending = value === "—" || value === null || value === undefined;
  return (
    <div
      style={{
        padding: "16px 18px",
        minWidth: 0,
        borderRight: divider ? "1px solid var(--border-subtle)" : "none",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--type-label-size)",
          fontWeight: 700,
          letterSpacing: "var(--type-label-tracking)",
          textTransform: "uppercase",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </span>
      <strong
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 5,
          marginTop: 8,
          fontFamily: "var(--font-sans)",
          fontSize: "var(--type-metric-size)",
          fontWeight: 600,
          letterSpacing: "var(--type-metric-tracking)",
          lineHeight: "var(--type-metric-line)",
          fontFeatureSettings: 'var(--numeric-tabular)',
          color: pending ? "var(--text-faint)" : color,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
        {unit && !pending ? (
          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", letterSpacing: 0 }}>{unit}</span>
        ) : null}
      </strong>
      {hint ? (
        <span
          style={{
            display: "block",
            marginTop: 5,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "-0.01em",
            color: "var(--text-faint)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
