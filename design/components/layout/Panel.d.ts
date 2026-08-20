import * as React from "react";

/** Structural workspace region with an optional 64px toolbar. */
export interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  /** Uppercase eyebrow above the title, e.g. "Incident graph". */
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  /** Right-hand machine fact, monospace — e.g. "6 nodes · 5 edges". */
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  /** Apply the standard 18px interior padding. Off for canvases and lists. */
  padded?: boolean;
  toolbar?: boolean;
  children?: React.ReactNode;
}

export declare function Panel(props: PanelProps): JSX.Element;
