import React from "react";
import { Icon } from "../core/Icon.jsx";
import { statusOf } from "../status/status-tokens.js";

/**
 * A node on the blast-radius canvas. Read-only by contract: no drag, no connect, no edit.
 * Hierarchy is compromised > affected application > intermediate dependency > unrelated.
 */
export function GraphNode({
  name,
  detail,
  kind = "version",
  status,
  selected = false,
  dimmed = false,
  clickable = false,
  onSelect,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const compromised = kind === "compromised";
  const application = kind === "application";
  const s = status ? statusOf(status) : null;
  const icon = compromised ? "shield-alert" : application ? "box" : "package";
  return (
    <div
      onClick={clickable ? onSelect : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      style={{
        width: "var(--graph-node-width)",
        minHeight: 56,
        padding: "10px 11px",
        textAlign: "left",
        background: compromised ? "var(--red-800)" : "var(--graph-node-surface)",
        border: `1px solid ${compromised ? "var(--red-500)" : hover && clickable ? "var(--border-strong)" : "var(--graph-node-border)"}`,
        borderLeft: application && s ? `var(--border-node-rail) solid ${s.fg}` : undefined,
        borderRadius: "var(--radius-md)",
        boxShadow: selected ? "var(--ring-selected), var(--shadow-node)" : "var(--shadow-node)",
        opacity: dimmed ? 0.42 : 1,
        cursor: clickable ? "pointer" : "default",
        transition: "var(--transition-surface), opacity var(--duration-base) var(--ease-standard)",
        ...style,
      }}
      {...rest}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
        <Icon
          name={icon}
          size={16}
          style={{
            marginTop: 1,
            color: compromised ? "var(--red-300)" : application && s ? s.fg : "var(--graph-node-inert)",
          }}
        />
        <div style={{ minWidth: 0 }}>
          <strong
            style={{
              display: "block",
              fontFamily: "var(--font-sans)",
              fontSize: 11.5,
              fontWeight: 600,
              lineHeight: 1.3,
              letterSpacing: "-0.008em",
              color: compromised ? "#fff" : "var(--graph-node-label)",
              overflowWrap: "anywhere",
            }}
          >
            {name}
          </strong>
          {detail ? (
            <span
              style={{
                display: "block",
                marginTop: 3,
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                letterSpacing: "0.01em",
                color: compromised ? "var(--red-300)" : "var(--graph-node-meta)",
                overflowWrap: "anywhere",
              }}
            >
              {detail}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
