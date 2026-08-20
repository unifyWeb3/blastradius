import * as React from "react";

/** One node in the ordered dependency chain. */
export interface ChainNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  name: React.ReactNode;
  /** Repository for an application, entity ID for a package version. */
  detail?: React.ReactNode;
  role?: "application" | "dependency" | "compromised";
  /** 1-based position in the chain, printed as 01, 02, … */
  index?: number;
}

export declare function ChainNode(props: ChainNodeProps): JSX.Element;
