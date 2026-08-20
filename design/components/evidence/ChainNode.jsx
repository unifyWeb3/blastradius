import React from "react";

/** One node in the ordered application → dependency → compromised-version chain. */
export function ChainNode({ name, detail, role = "dependency", index, style, ...rest }) {
  const compromised = role === "compromised";
  const application = role === "application";
  return (
    <div
      style={{
        width: "var(--chain-node-width)",
        flex: "none",
        padding: "10px 10px 9px",
        background: compromised ? "var(--red-800)" : "var(--surface-raised)",
        border: `1px solid ${compromised ? "var(--red-600)" : "var(--border-default)"}`,
        borderLeft: application ? "var(--border-rail) solid var(--teal-600)" : undefined,
        borderRadius: "var(--radius-md)",
        boxShadow: compromised ? "var(--shadow-node)" : "none",
        ...style,
      }}
      {...rest}
    >
      {index !== undefined ? (
        <span
          style={{
            display: "block",
            marginBottom: 5,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: "0.04em",
            color: compromised ? "var(--red-300)" : "var(--text-faint)",
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <strong
        style={{
          display: "block",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: "-0.005em",
          color: compromised ? "#fff" : "var(--text-primary)",
          overflowWrap: "anywhere",
        }}
      >
        {name}
      </strong>
      {detail ? (
        <span
          style={{
            display: "block",
            marginTop: 5,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            lineHeight: 1.35,
            letterSpacing: "-0.01em",
            color: compromised ? "var(--red-300)" : "var(--text-faint)",
            overflowWrap: "anywhere",
          }}
        >
          {detail}
        </span>
      ) : null}
    </div>
  );
}
