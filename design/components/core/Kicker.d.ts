import * as React from "react";

/** Uppercase 10px eyebrow that labels every heading, metric and field. */
export interface KickerProps extends React.HTMLAttributes<HTMLElement> {
  tone?: "muted" | "primary" | "danger";
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

export declare function Kicker(props: KickerProps): JSX.Element;
