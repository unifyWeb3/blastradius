import React from "react";
import { Icon } from "../core/Icon.jsx";
import { Kicker } from "../core/Kicker.jsx";

/** Heading for an evidence region or a sidebar block: kicker, title, and a right-hand verdict or value. */
export function SectionHeading({ kicker, title, icon, right, align = "start", level = 2, style, ...rest }) {
  const Tag = `h${level}`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: align === "center" ? "center" : "flex-start",
        justifyContent: "space-between",
        gap: 14,
        ...style,
      }}
      {...rest}
    >
      <div style={{ minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
        {icon ? <Icon name={icon} size={16} style={{ color: "var(--text-muted)" }} /> : null}
        <div style={{ minWidth: 0 }}>
          {kicker ? <Kicker style={{ marginBottom: 3 }}>{kicker}</Kicker> : null}
          <Tag
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: kicker ? "var(--type-section-size)" : "var(--type-subsection-size)",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "var(--text-primary)",
              overflowWrap: "anywhere",
            }}
          >
            {title}
          </Tag>
        </div>
      </div>
      {right ? <div style={{ flex: "none" }}>{right}</div> : null}
    </div>
  );
}
