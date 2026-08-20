import * as React from "react";

/** Square status glyph chip — leads every application row. */
export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "exposed" | "not_exposed" | "unresolved" | "no_path" | "compromised" | "neutral";
  /** Box size in px. 28 in the root inventory, 22 in dense lists. */
  size?: number;
}

export declare function StatusChip(props: StatusChipProps): JSX.Element;
