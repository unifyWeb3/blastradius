import * as React from "react";

/** Console chrome — brand lockup plus live HydraDB traversal attribution. */
export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  product?: string;
  /** Hidden below 820px, per the responsive contract. */
  descriptor?: string;
  engine?: string;
  /** The traversal contract string. Rendered in mono — it is a machine fact, not a tagline. */
  traversal?: string;
  /** Mobile composition: drops the descriptor and the runtime badge. */
  compact?: boolean;
  /** Replace the right-hand runtime badge entirely. */
  right?: React.ReactNode;
}

export declare function TopBar(props: TopBarProps): JSX.Element;
