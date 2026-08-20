import * as React from "react";

/** BlastRadius glyph set — Lucide geometry copied from lucide-icons/lucide. */
export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Lucide file name, e.g. "shield-alert", "radar", "circle-question-mark". */
  name: string;
  /** Rendered box in px. Console sizes are 14 / 15 / 16 / 17 / 20 / 28. */
  size?: number;
  /** Stroke weight. 1.75 is the console default; 2 for 14px and below. */
  strokeWidth?: number;
  /** Accessible name. Omit for decorative glyphs — the icon is then aria-hidden. */
  title?: string;
}

export declare function Icon(props: IconProps): JSX.Element;
export declare const iconNames: string[];
