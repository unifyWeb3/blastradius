import React from "react";
import { Icon } from "../core/Icon.jsx";

/** Whole-viewport state: initial incident load, and incident-unavailable failure. */
export function FullScreenState({ icon = "loader-circle", label, detail, tone = "default", busy = false, style, ...rest }) {
  const color = tone === "danger" ? "var(--status-error)" : "var(--teal-500)";
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeContent: "center",
        justifyItems: "center",
        gap: 12,
        padding: 24,
        textAlign: "center",
        background: "var(--bg-app)",
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={26} className={busy ? "br-spin" : undefined} style={{ color }} />
      <strong
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--text-primary)",
          maxWidth: 460,
        }}
      >
        {label}
      </strong>
      {detail ? (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "-0.005em",
            color: "var(--text-muted)",
            maxWidth: 460,
          }}
        >
          {detail}
        </span>
      ) : null}
    </div>
  );
}
