import React from "react";
import { Icon } from "../core/Icon.jsx";

/**
 * In-panel empty or loading state. `Analysis pending` before a query and
 * `Querying HydraDB` while one is in flight — the two must stay distinguishable.
 */
export function EmptyState({
  icon = "radar",
  label,
  sublabel,
  busy = false,
  height = "var(--graph-canvas-height)",
  grid = true,
  style,
  ...rest
}) {
  return (
    <div
      style={{
        height,
        display: "grid",
        placeContent: "center",
        justifyItems: "center",
        gap: 9,
        background: "var(--graph-canvas)",
        backgroundImage: grid ? "radial-gradient(var(--graph-grid) 1px, transparent 1px)" : undefined,
        backgroundSize: grid ? "18px 18px" : undefined,
        ...style,
      }}
      {...rest}
    >
      <Icon
        name={busy ? "loader-circle" : icon}
        size={28}
        className={busy ? "br-spin" : undefined}
        style={{ color: busy ? "var(--teal-500)" : "var(--text-faint)" }}
      />
      <strong
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </strong>
      {sublabel ? (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.02em",
            color: "var(--text-faint)",
          }}
        >
          {sublabel}
        </span>
      ) : null}
    </div>
  );
}
