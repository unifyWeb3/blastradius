import React from "react";
import { Icon } from "../core/Icon.jsx";

/** Dismissible API/HydraDB failure alert. Carries the API's stable message verbatim. */
export function ErrorBanner({ message, onDismiss, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      role="alert"
      style={{
        minHeight: 42,
        padding: "9px 10px 9px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "var(--status-error)",
        background: "var(--status-error-bg)",
        border: "1px solid var(--status-error-border)",
        borderLeft: "var(--border-rail) solid var(--status-error)",
        borderRadius: "var(--radius-sm)",
        ...style,
      }}
      {...rest}
    >
      <Icon name="triangle-alert" size={17} />
      <span
        style={{
          flex: 1,
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          lineHeight: 1.4,
          color: "var(--text-primary)",
        }}
      >
        {message}
      </span>
      {onDismiss ? (
        <button
          type="button"
          aria-label="Dismiss error"
          title="Dismiss"
          onClick={onDismiss}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: 26,
            height: 26,
            display: "grid",
            placeItems: "center",
            flex: "none",
            border: "1px solid transparent",
            borderColor: hover ? "var(--status-error-border)" : "transparent",
            borderRadius: "var(--radius-sm)",
            background: "transparent",
            color: "var(--status-error)",
            cursor: "pointer",
            transition: "var(--transition-control)",
          }}
        >
          <Icon name="x" size={14} strokeWidth={2} />
        </button>
      ) : null}
    </div>
  );
}
