import React from "react";
import { Icon } from "../core/Icon.jsx";

/**
 * One `DEPENDS_ON` relationship rendered as evidence. A null validity interval is
 * itself evidence — it is called out in steel, never silently omitted.
 */
export function EvidenceRow({ relationshipType = "DEPENDS_ON", evidence, interval, style, ...rest }) {
  const unresolved = !interval;
  return (
    <article
      style={{
        padding: "11px 2px 12px",
        display: "grid",
        gridTemplateColumns: "18px minmax(0, 1fr)",
        gap: 9,
        borderBottom: "1px solid var(--border-subtle)",
        ...style,
      }}
      {...rest}
    >
      <Icon
        name={unresolved ? "circle-question-mark" : "file-check"}
        size={16}
        style={{ color: unresolved ? "var(--status-unresolved)" : "var(--teal-500)", marginTop: 1 }}
      />
      <div style={{ minWidth: 0 }}>
        <strong
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: "0.06em",
            color: "var(--text-secondary)",
          }}
        >
          {relationshipType}
        </strong>
        <p
          style={{
            margin: "5px 0 0",
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
            overflowWrap: "anywhere",
          }}
        >
          {evidence}
        </p>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 6,
            padding: unresolved ? "2px 6px" : 0,
            background: unresolved ? "var(--status-unresolved-bg)" : "transparent",
            backgroundImage: unresolved ? "var(--status-unresolved-hatch)" : undefined,
            border: unresolved ? "1px solid var(--status-unresolved-border)" : "none",
            borderRadius: "var(--radius-xs)",
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            letterSpacing: "-0.005em",
            color: unresolved ? "var(--status-unresolved)" : "var(--text-muted)",
          }}
        >
          {unresolved ? "validWindow: null — temporal evaluation unresolved" : interval}
        </span>
      </div>
    </article>
  );
}
