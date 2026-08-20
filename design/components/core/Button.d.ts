import * as React from "react";

/** Primary console action — one per region, red for the analysis run. */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  /** primary = run analysis (red). secondary = supporting query (teal). ghost/quiet = low-emphasis. */
  variant?: "primary" | "secondary" | "ghost" | "quiet";
  size?: "sm" | "md";
  /** Leading glyph name from the Icon set. */
  icon?: string;
  trailingIcon?: string;
  /** Shows a spinner in place of the leading glyph and disables the control. */
  loading?: boolean;
  disabled?: boolean;
  /** Full-width — the sidebar default. */
  block?: boolean;
  style?: React.CSSProperties;
}

export declare function Button(props: ButtonProps): JSX.Element;
