import React from "react";
import { Icon } from "../core/Icon.jsx";
import { statusOf } from "./status-tokens.js";

/** Square glyph chip that carries a row's status — the leading element of every application row. */
export function StatusChip({ status = "neutral", size = 28, style, ...rest }) {
  const s = statusOf(status);
  return (
    <span
      style={{
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
        flex: "none",
        color: s.fg,
        background: s.bg,
        backgroundImage: s.hatch !== "none" ? s.hatch : undefined,
        border: `1px solid ${s.border}`,
        borderRadius: "var(--radius-sm)",
        ...style,
      }}
      {...rest}
    >
      <Icon name={s.icon} size={Math.round(size * 0.57)} />
    </span>
  );
}
