import React from "react";
import { Icon } from "../core/Icon.jsx";
import { statusOf } from "./status-tokens.js";

/** Temporal verdict for a path. Four distinct meanings, never collapsed: exposed / not_exposed / unresolved / no_path. */
export function StatusPill({ status = "neutral", label, icon = true, size = "md", style, ...rest }) {
  const s = statusOf(status);
  const sm = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sm ? 5 : 6,
        padding: sm ? "3px 7px" : "5px 9px",
        color: s.fg,
        background: s.bg,
        backgroundImage: s.hatch !== "none" ? s.hatch : undefined,
        border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-xs)",
        fontFamily: "var(--font-sans)",
        fontSize: sm ? 9 : "var(--type-label-size)",
        fontWeight: 700,
        letterSpacing: "var(--type-label-tracking)",
        textTransform: "uppercase",
        lineHeight: 1.1,
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {icon ? <Icon name={s.icon} size={sm ? 10 : 12} strokeWidth={2} /> : null}
      {label || s.label}
    </span>
  );
}
