import React from "react";

/** Advisory severity. The product only ever emits `critical`; the other levels exist so the badge does not lie if the catalog widens. */
export function SeverityBadge({ severity = "critical", style, ...rest }) {
  const tone =
    severity === "critical"
      ? { bg: "var(--red-700)", fg: "#FFFFFF" }
      : severity === "high"
        ? { bg: "var(--amber-700)", fg: "#FFFFFF" }
        : { bg: "var(--gr-700)", fg: "var(--gr-100)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 7px",
        color: tone.fg,
        background: tone.bg,
        borderRadius: "var(--radius-xs)",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--type-label-size)",
        fontWeight: 700,
        letterSpacing: "var(--type-label-tracking)",
        textTransform: "uppercase",
        lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      {severity}
    </span>
  );
}
