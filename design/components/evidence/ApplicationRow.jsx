import React from "react";
import { StatusChip } from "../status/StatusChip.jsx";
import { statusOf } from "../status/status-tokens.js";

/** A candidate root in the inventory. Selecting it selects the same path a graph-node click selects. */
export function ApplicationRow({ name, status = "neutral", hopCount, detail, selected = false, onSelect, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const s = statusOf(status);
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={selected}
      style={{
        width: "100%",
        padding: "10px 10px 10px 9px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        textAlign: "left",
        color: "var(--text-primary)",
        background: selected ? "var(--surface-raised)" : hover ? "var(--surface-hover)" : "transparent",
        border: "1px solid transparent",
        borderColor: selected ? "var(--border-strong)" : "transparent",
        borderLeft: `var(--border-rail) solid ${selected ? s.fg : "transparent"}`,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        transition: "var(--transition-control)",
        ...style,
      }}
      {...rest}
    >
      <StatusChip status={status} size={28} />
      <span style={{ minWidth: 0, flex: 1 }}>
        <strong
          style={{
            display: "block",
            fontFamily: "var(--font-sans)",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "-0.005em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </strong>
        <small
          style={{
            display: "block",
            marginTop: 3,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "-0.01em",
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {hopCount !== undefined ? `${hopCount} hops` : null}
          {hopCount !== undefined && (detail || s.row) ? " · " : null}
          <span style={{ color: s.fg }}>{detail || s.row}</span>
        </small>
      </span>
    </button>
  );
}
