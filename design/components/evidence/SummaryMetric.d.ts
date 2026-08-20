import * as React from "react";

/** One reading in the analysis summary band. */
export interface SummaryMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  /** Pass "—" before an analysis exists. Never substitute 0. */
  value?: React.ReactNode;
  /** Small trailing unit, e.g. "ms". */
  unit?: React.ReactNode;
  /** `danger` for the exposed count, `healthy` for a verified reading. */
  tone?: "default" | "danger" | "healthy";
  /** Monospace sub-line for the machine fact behind the number. */
  hint?: React.ReactNode;
  divider?: boolean;
}

export declare function SummaryMetric(props: SummaryMetricProps): JSX.Element;
