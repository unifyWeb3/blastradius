import React from "react";
import { Kicker } from "./Kicker.jsx";

/** Labelled console input. Used for the UTC exposure-window fields; `mono` is on by default because every value in this app is machine-shaped. */
export function Field({ label, hint, invalid = false, mono = true, inputProps = {}, style, children, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "block", ...style }} {...rest}>
      <Kicker style={{ marginBottom: 6 }}>{label}</Kicker>
      {children || (
        <input
          {...inputProps}
          onFocus={(e) => {
            setFocus(true);
            inputProps.onFocus && inputProps.onFocus(e);
          }}
          onBlur={(e) => {
            setFocus(false);
            inputProps.onBlur && inputProps.onBlur(e);
          }}
          style={{
            width: "100%",
            height: "var(--control-height)",
            padding: "0 10px",
            color: "var(--text-primary)",
            background: "var(--surface-input)",
            border: `1px solid ${invalid ? "var(--status-error)" : focus ? "var(--focus-ring)" : "var(--border-input)"}`,
            borderRadius: "var(--radius-sm)",
            fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
            fontSize: 12,
            letterSpacing: mono ? "-0.01em" : 0,
            outline: "none",
            transition: "var(--transition-control)",
            colorScheme: "dark",
            ...inputProps.style,
          }}
        />
      )}
      {hint ? (
        <span
          style={{
            display: "block",
            marginTop: 5,
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            color: invalid ? "var(--status-error)" : "var(--text-muted)",
          }}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
