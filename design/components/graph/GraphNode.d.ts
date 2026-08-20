import * as React from "react";

/** A node on the blast-radius canvas — read-only by contract. */
export interface GraphNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  /** Environment for an application, `v{version}` for a package version. */
  detail?: React.ReactNode;
  kind?: "application" | "version" | "compromised";
  /** Only applications carry a status; it drives the left rail colour. */
  status?: "exposed" | "not_exposed" | "unresolved";
  /** On the currently selected path — draws the teal selection ring. */
  selected?: boolean;
  /** Not on any candidate path. Subdued, still readable. */
  dimmed?: boolean;
  /** Applications are clickable; dependency and compromised nodes are not. */
  clickable?: boolean;
  onSelect?: () => void;
}

export declare function GraphNode(props: GraphNodeProps): JSX.Element;
