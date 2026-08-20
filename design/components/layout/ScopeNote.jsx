import React from "react";
import { Icon } from "../core/Icon.jsx";

/** Provenance footnote. Pinned to the bottom of the sidebar — the product's data limitation is always on screen. */
export function ScopeNote({ icon = "git-branch", children, style, ...rest }) {
  return (
    <div
      style={{
        marginTop: "auto",
        padding: "14px 20px",
        display: "flex",
        gap: 8,
        alignItems: "center",
        borderTop: "1px solid var(--border-subtle)",
        color: "var(--text-faint)",
        fontFamily: "var(--font-sans)",
        fontSize: 10,
        letterSpacing: "0.01em",
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={14} />
      <span>{children}</span>
    </div>
  );
}
