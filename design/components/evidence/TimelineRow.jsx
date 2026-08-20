import React from "react";

const TONES = {
  compromise: "var(--timeline-compromise)",
  dependency: "var(--timeline-dependency)",
  effective: "var(--timeline-effective)",
  unresolved: "var(--timeline-unresolved)",
};

/**
 * One interval bar on the UTC exposure timeline. `tone="unresolved"` renders a hatched,
 * open-ended band for a dependency edge with no validity interval — it must not be drawn
 * as a measured bar.
 */
export function TimelineRow({ label, left = 0, width = 100, tone = "dependency", title, style, ...rest }) {
  const unresolved = tone === "unresolved";
  const color = TONES[tone] || TONES.dependency;
  return (
    <div
      style={{
        minHeight: 30,
        display: "grid",
        gridTemplateColumns: "var(--timeline-label-width) minmax(0, 1fr)",
        gap: 8,
        alignItems: "center",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: unresolved ? "var(--status-unresolved)" : "var(--text-secondary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      <div
        style={{
          position: "relative",
          height: 8,
          background: "var(--timeline-track)",
          borderRadius: "var(--radius-xs)",
          boxShadow: "var(--shadow-inset-track)",
        }}
      >
        {unresolved ? (
          <div
            title={title}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "var(--radius-xs)",
              border: `1px dashed ${color}`,
              backgroundImage: "var(--status-unresolved-hatch)",
            }}
          />
        ) : (
          <div
            title={title}
            style={{
              position: "absolute",
              top: 0,
              height: 8,
              left: `${left}%`,
              width: `${Math.min(Math.max(width, 1.5), 100 - left)}%`,
              minWidth: 4,
              background: color,
              borderRadius: "var(--radius-xs)",
              boxShadow: tone === "effective" ? "0 0 0 2px rgba(47, 184, 155, 0.16)" : "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
