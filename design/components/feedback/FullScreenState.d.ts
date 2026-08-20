import * as React from "react";

/** Whole-viewport state — initial incident load and incident-unavailable failure. */
export interface FullScreenStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  label: React.ReactNode;
  /** Monospace detail line — the error code or endpoint that failed. */
  detail?: React.ReactNode;
  tone?: "default" | "danger";
  busy?: boolean;
}

export declare function FullScreenState(props: FullScreenStateProps): JSX.Element;
