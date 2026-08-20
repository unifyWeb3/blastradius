import React from "react";

/** Uppercase eyebrow used above every heading, metric and field in the console. */
export function Kicker({ children, tone = "muted", as = "span", style, ...rest }) {
  const Tag = as;
  const color =
    tone === "danger" ? "var(--status-compromised)" : tone === "primary" ? "var(--text-secondary)" : "var(--text-muted)";
  return (
    <Tag
      style={{
        display: "block",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--type-label-size)",
        lineHeight: "var(--type-label-line)",
        fontWeight: "var(--type-label-weight)",
        letterSpacing: "var(--type-label-tracking)",
        textTransform: "uppercase",
        color,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
