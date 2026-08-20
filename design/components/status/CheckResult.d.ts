import * as React from "react";

/** The exposure-check outcome block. Four reasons, four distinct treatments. */
export interface CheckResultProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The DTO's `reason` field — it, not `status`, decides the treatment. */
  reason:
    | "supporting_dependency_path"
    | "no_common_overlap"
    | "no_supporting_dependency_path"
    | "missing_dependency_validity";
  /** Hop count of the supporting path; only rendered for the exposed outcome. */
  hopCount?: number;
  /** Print the raw reason code as evidence. On by default. */
  showReasonCode?: boolean;
}

export declare function CheckResult(props: CheckResultProps): JSX.Element;
