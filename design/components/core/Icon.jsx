import React from "react";
import { iconPaths } from "./icon-paths.js";

/**
 * BlastRadius glyph. Renders Lucide geometry (copied from lucide-icons/lucide)
 * inline so it inherits `currentColor` and scales crisply at 9-28px.
 */
export function Icon({ name, size = 16, strokeWidth = 1.75, title, style, className, ...rest }) {
  const body = iconPaths[name];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
      className={className}
      style={{ flex: "none", display: "block", ...style }}
      dangerouslySetInnerHTML={{ __html: body || "" }}
      {...rest}
    />
  );
}

export const iconNames = Object.keys(iconPaths);
