import React from "react";
import { Icon } from "../core/Icon.jsx";

/** The console chrome: brand identity on the left, live engine attribution on the right. */
export function TopBar({
  product = "BlastRadius",
  descriptor = "Supply-chain incident analysis",
  engine = "HydraDB",
  traversal = "incoming SSpaths",
  compact = false,
  right,
  style,
  ...rest
}) {
  return (
    <header
      style={{
        height: "var(--topbar-height)",
        padding: compact ? "0 12px" : "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        background: "var(--surface-chrome)",
        borderBottom: "1px solid var(--border-subtle)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <span
          style={{
            width: 30,
            height: 30,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            background: "var(--red-700)",
            borderRadius: "var(--radius-sm)",
            flex: "none",
          }}
        >
          <Icon name="shield-alert" size={18} />
        </span>
        <strong
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          {product}
        </strong>
        {!compact && descriptor ? (
          <span
            style={{
              paddingLeft: 11,
              marginLeft: 1,
              borderLeft: "1px solid var(--border-default)",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {descriptor}
          </span>
        ) : null}
      </div>
      {right !== undefined ? (
        right
      ) : compact ? null : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 10px",
            background: "var(--gr-950)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-sm)",
            flex: "none",
          }}
        >
          <Icon name="database" size={14} style={{ color: "var(--teal-500)" }} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--text-muted)" }}>{engine}</span>
          <code
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 500,
              color: "var(--teal-300)",
              letterSpacing: "-0.01em",
            }}
          >
            {traversal}
          </code>
        </div>
      )}
    </header>
  );
}
