import React from "react";

/** A structural region of the workspace: hairline chassis, optional 64px toolbar, no radius. */
export function Panel({ kicker, title, meta, actions, padded = false, toolbar = true, children, style, ...rest }) {
  return (
    <section
      style={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--surface-panel)",
        ...style,
      }}
      {...rest}
    >
      {toolbar && (kicker || title || meta || actions) ? (
        <div
          style={{
            height: "var(--panel-toolbar-height)",
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--gr-925)",
            flex: "none",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {kicker ? (
              <span
                style={{
                  display: "block",
                  marginBottom: 4,
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--type-label-size)",
                  fontWeight: 700,
                  letterSpacing: "var(--type-label-tracking)",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                {kicker}
              </span>
            ) : null}
            {title ? (
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </h2>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
            {meta ? (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "-0.01em",
                  color: "var(--text-muted)",
                }}
              >
                {meta}
              </span>
            ) : null}
            {actions}
          </div>
        </div>
      ) : null}
      <div style={{ minWidth: 0, flex: 1, padding: padded ? "var(--pad-panel)" : 0 }}>{children}</div>
    </section>
  );
}
