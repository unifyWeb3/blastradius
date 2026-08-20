import * as React from "react";

/** In-panel empty or loading state. */
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  label: React.ReactNode;
  /** Monospace sub-line, e.g. "Incoming SSpaths traversal". */
  sublabel?: React.ReactNode;
  /** Spinner + teal tint: a real query is running. */
  busy?: boolean;
  height?: number | string;
  /** Dot grid, matching the graph canvas. */
  grid?: boolean;
}

export declare function EmptyState(props: EmptyStateProps): JSX.Element;
