import * as React from "react";

/** One `DEPENDS_ON` relationship rendered as evidence. */
export interface EvidenceRowProps extends React.HTMLAttributes<HTMLElement> {
  relationshipType?: string;
  /** The DTO's `evidence` string — source/lockfile-shaped text. Never rewrite it as a score. */
  evidence: React.ReactNode;
  /** Formatted UTC validity interval. Omit when `validWindow` is null — the row then renders the unresolved treatment. */
  interval?: React.ReactNode;
}

export declare function EvidenceRow(props: EvidenceRowProps): JSX.Element;
