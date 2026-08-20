import * as React from "react";

/** A candidate root in the inventory list. */
export interface ApplicationRowProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  name: React.ReactNode;
  status?: "exposed" | "not_exposed" | "unresolved" | "no_path" | "neutral";
  /** `paths[0].hopCount` from the DTO. */
  hopCount?: number;
  /** Overrides the status's default sub-label. */
  detail?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
  style?: React.CSSProperties;
}

export declare function ApplicationRow(props: ApplicationRowProps): JSX.Element;
