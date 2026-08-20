import React from "react";

const KEYS = [
  { id: "compromised", label: "Compromised version", swatch: "solid", color: "var(--red-700)", border: "var(--red-500)" },
  { id: "exposed", label: "Exposed application", swatch: "rail", color: "var(--status-exposed)" },
  { id: "not_exposed", label: "Outside window", swatch: "rail", color: "var(--status-outside-window)" },
  { id: "unresolved", label: "Unresolved", swatch: "hatch", color: "var(--status-unresolved)" },
  { id: "dependency", label: "Intermediate dependency", swatch: "node", color: "var(--graph-node-inert)" },
  { id: "selected", label: "Selected path", swatch: "edge-selected", color: "var(--graph-edge-selected)" },
  { id: "edge", label: "DEPENDS_ON", swatch: "edge", color: "var(--graph-edge)" },
];

const Swatch = ({ swatch, color, border }) => {
  const base = { width: 18, height: 12, flex: "none", borderRadius: 2 };
  if (swatch === "solid") return <span style={{ ...base, background: color, border: `1px solid ${border || color}` }} />;
  if (swatch === "rail")
    return (
      <span
        style={{
          ...base,
          background: "var(--graph-node-surface)",
          border: "1px solid var(--graph-node-border)",
          borderLeft: `3px solid ${color}`,
        }}
      />
    );
  if (swatch === "hatch")
    return (
      <span
        style={{
          ...base,
          background: "var(--status-unresolved-bg)",
          backgroundImage: "var(--status-unresolved-hatch)",
          border: `1px dashed ${color}`,
        }}
      />
    );
  if (swatch === "node")
    return <span style={{ ...base, background: "var(--graph-node-surface)", border: "1px solid var(--graph-node-border)" }} />;
  return (
    <span style={{ ...base, height: 12, display: "grid", placeItems: "center" }}>
      <span
        style={{
          width: 18,
          height: swatch === "edge-selected" ? 2.5 : 1.5,
          background: color,
          borderRadius: 2,
          backgroundImage:
            swatch === "edge-selected"
              ? `repeating-linear-gradient(90deg, ${color} 0 5px, transparent 5px 8px)`
              : undefined,
        }}
      />
    </span>
  );
};

/** Legend for the graph's visual semantics. Present the keys the current result actually contains. */
export function GraphLegend({ keys, direction = "row", style, ...rest }) {
  const shown = keys ? KEYS.filter((k) => keys.includes(k.id)) : KEYS;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        flexWrap: "wrap",
        gap: direction === "row" ? "8px 16px" : 8,
        alignItems: direction === "row" ? "center" : "flex-start",
        ...style,
      }}
      {...rest}
    >
      {shown.map((k) => (
        <span key={k.id} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <Swatch swatch={k.swatch} color={k.color} border={k.border} />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 9.5,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            {k.label}
          </span>
        </span>
      ))}
    </div>
  );
}
