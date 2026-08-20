import * as React from "react";

/** Advisory severity badge — the catalog's `advisory.severity`. */
export interface SeverityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  severity?: "critical" | "high" | "moderate" | "low";
}

export declare function SeverityBadge(props: SeverityBadgeProps): JSX.Element;
