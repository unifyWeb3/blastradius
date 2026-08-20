import React from "react";
import { Icon } from "./Icon.jsx";

/** Console dropdown. Only used for the application-check selector, which is populated from the incident catalog. */
export function Select({ options = [], value, onChange, disabled = false, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <span style={{ position: "relative", display: "block", ...style }}>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: "100%",
          height: "var(--control-height)",
          padding: "0 32px 0 10px",
          color: "var(--text-primary)",
          background: "var(--surface-input)",
          border: `1px solid ${focus ? "var(--focus-ring)" : "var(--border-input)"}`,
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          appearance: "none",
          WebkitAppearance: "none",
          outline: "none",
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "var(--transition-control)",
        }}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "var(--surface-raised)" }}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        size={14}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
