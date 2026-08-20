import React from "react";
import { Icon } from "../core/Icon.jsx";
import { statusOf } from "./status-tokens.js";

const OUTCOMES = {
  supporting_dependency_path: { key: "exposed", title: "Exposed", body: (n) => `${n} hop dependency path` },
  no_common_overlap: {
    key: "not_exposed",
    title: "Not exposed in window",
    body: () => "Path has no common temporal overlap.",
  },
  no_supporting_dependency_path: {
    key: "no_path",
    title: "Not exposed",
    body: () => "No supporting dependency path found.",
  },
  missing_dependency_validity: {
    key: "unresolved",
    title: "Temporal result unresolved",
    body: () =>
      "A dependency edge on the supporting path has no validity interval. Exposure can be neither confirmed nor ruled out.",
  },
};

/**
 * Renders one `ExposureCheckDto` outcome. The four reasons are visually distinct by
 * contract — `missing_dependency_validity` must never reuse the outside-window treatment.
 */
export function CheckResult({ reason, hopCount = 0, showReasonCode = true, style, ...rest }) {
  const outcome = OUTCOMES[reason] || OUTCOMES.no_supporting_dependency_path;
  const s = statusOf(outcome.key);
  const uncertain = outcome.key === "unresolved";
  return (
    <div
      role="status"
      style={{
        display: "flex",
        gap: 9,
        alignItems: "flex-start",
        padding: "11px 12px",
        background: s.bg,
        backgroundImage: uncertain ? s.hatch : undefined,
        borderLeft: `var(--border-rail) solid ${s.fg}`,
        border: `1px solid ${s.border}`,
        borderLeftWidth: "var(--border-rail)",
        borderLeftColor: s.fg,
        borderRadius: "var(--radius-sm)",
        ...style,
      }}
      {...rest}
    >
      <Icon name={s.icon} size={17} style={{ color: s.fg, marginTop: 1 }} />
      <div style={{ minWidth: 0 }}>
        <strong
          style={{
            display: "block",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 600,
            color: s.fg,
            letterSpacing: "-0.005em",
          }}
        >
          {outcome.title}
        </strong>
        <span
          style={{
            display: "block",
            marginTop: 3,
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            lineHeight: 1.45,
            color: "var(--text-secondary)",
          }}
        >
          {outcome.body(hopCount)}
        </span>
        {showReasonCode ? (
          <code
            style={{
              display: "block",
              marginTop: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 9.5,
              letterSpacing: "-0.01em",
              color: "var(--text-muted)",
            }}
          >
            reason: {reason}
          </code>
        ) : null}
      </div>
    </div>
  );
}
