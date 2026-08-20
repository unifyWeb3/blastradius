import * as React from "react";

/** Console dropdown — the application selector for the exposure check. */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value" | "style"> {
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export declare function Select(props: SelectProps): JSX.Element;
