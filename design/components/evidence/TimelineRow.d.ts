import * as React from "react";

/** One interval bar on the UTC exposure timeline. */
export interface TimelineRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  /** Bar start as a percentage of the computed UTC domain. */
  left?: number;
  /** Bar width as a percentage of the computed UTC domain. */
  width?: number;
  tone?: "compromise" | "dependency" | "effective" | "unresolved";
  /** Native tooltip carrying the exact UTC interval. */
  title?: string;
}

export declare function TimelineRow(props: TimelineRowProps): JSX.Element;
