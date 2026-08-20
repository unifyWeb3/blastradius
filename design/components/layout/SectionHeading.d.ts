import * as React from "react";

/** Heading for an evidence region or sidebar block. */
export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  kicker?: React.ReactNode;
  title: React.ReactNode;
  /** Leading glyph, for sidebar blocks. */
  icon?: string;
  /** Right-hand slot — a StatusPill verdict or a headline value. */
  right?: React.ReactNode;
  align?: "start" | "center";
  level?: 1 | 2 | 3;
}

export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
