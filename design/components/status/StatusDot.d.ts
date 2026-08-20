import * as React from "react";

/** Live-state dot — incident catalog status, HydraDB runtime state. */
export interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "active" | "healthy" | "unresolved" | "idle";
  label?: React.ReactNode;
  /** Slow opacity pulse. On for live states, off for historical ones. */
  pulse?: boolean;
}

export declare function StatusDot(props: StatusDotProps): JSX.Element;
