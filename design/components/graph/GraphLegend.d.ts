import * as React from "react";

/** Legend for the graph's visual semantics. */
export interface GraphLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Subset of keys to show, in this order: compromised, exposed, not_exposed, unresolved, dependency, selected, edge. */
  keys?: Array<"compromised" | "exposed" | "not_exposed" | "unresolved" | "dependency" | "selected" | "edge">;
  direction?: "row" | "column";
}

export declare function GraphLegend(props: GraphLegendProps): JSX.Element;
