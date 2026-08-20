import * as React from "react";

/** Temporal verdict pill. */
export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Maps 1:1 to `temporal.status` plus the explicit no-path outcome. */
  status?: "exposed" | "not_exposed" | "unresolved" | "no_path" | "compromised" | "neutral";
  /** Override copy. Defaults to the contract wording for the status. */
  label?: React.ReactNode;
  icon?: boolean;
  size?: "sm" | "md";
}

export declare function StatusPill(props: StatusPillProps): JSX.Element;
