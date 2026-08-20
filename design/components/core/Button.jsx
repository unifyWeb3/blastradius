import React from "react";
import { Icon } from "./Icon.jsx";

const VARIANTS = {
  primary: {
    background: "var(--action-primary-bg)",
    color: "var(--action-primary-fg)",
    border: "1px solid transparent",
    hover: "var(--action-primary-bg-hover)",
  },
  secondary: {
    background: "var(--teal-900)",
    color: "var(--teal-300)",
    border: "1px solid var(--teal-700)",
    hover: "#123B33",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-default)",
    hover: "var(--surface-hover)",
  },
  quiet: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "1px solid transparent",
    hover: "var(--surface-hover)",
  },
};

const SIZES = {
  sm: { height: 30, padding: "0 10px", fontSize: 11, gap: 6, icon: 14 },
  md: { height: 38, padding: "0 14px", fontSize: 13, gap: 8, icon: 16 },
};

/** Primary console action. `loading` swaps the leading glyph for a spinner and disables the control. */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  loading = false,
  disabled = false,
  block = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  const off = disabled || loading;
  return (
    <button
      type="button"
      disabled={off}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: block ? "100%" : undefined,
        minHeight: s.height,
        padding: s.padding,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        fontFamily: "var(--font-sans)",
        fontSize: s.fontSize,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        lineHeight: 1,
        borderRadius: "var(--radius-sm)",
        border: v.border,
        background: off ? v.background : hover ? v.hover : v.background,
        color: v.color,
        opacity: off ? 0.45 : 1,
        cursor: off ? "not-allowed" : "pointer",
        transition: "var(--transition-control)",
        ...style,
      }}
      {...rest}
    >
      {loading ? (
        <Icon name="loader-circle" size={s.icon} className="br-spin" />
      ) : icon ? (
        <Icon name={icon} size={s.icon} />
      ) : null}
      {children}
      {trailingIcon ? <Icon name={trailingIcon} size={s.icon} /> : null}
    </button>
  );
}
