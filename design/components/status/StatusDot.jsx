import React from "react";

const TONES = {
  active: "var(--status-compromised)",
  healthy: "var(--status-healthy)",
  unresolved: "var(--status-unresolved)",
  idle: "var(--text-faint)",
};

/** Live-state indicator — the incident's catalog status in the sidebar, and the HydraDB runtime state in the top bar. */
export function StatusDot({ tone = "active", label, pulse = true, style, ...rest }) {
  const color = TONES[tone] || TONES.idle;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "var(--text-muted)",
        fontFamily: "var(--font-sans)",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "var(--type-label-tracking)",
        textTransform: "uppercase",
        ...style,
      }}
      {...rest}
    >
      <span
        className={pulse ? "br-pulse" : undefined}
        style={{
          width: 7,
          height: 7,
          borderRadius: "var(--radius-pill)",
          background: color,
          boxShadow: `0 0 0 3px color-mix(in srgb, ${color} 18%, transparent)`,
        }}
      />
      {label}
    </span>
  );
}
