import * as React from "react";

/** Labelled console input — the UTC exposure-window fields. */
export interface FieldProps extends React.HTMLAttributes<HTMLLabelElement> {
  label: React.ReactNode;
  /** Helper or validation text under the control. */
  hint?: React.ReactNode;
  /** Red border + red hint. Used when the window fails `start < end`. */
  invalid?: boolean;
  /** Monospace value type. Default true — every value in this app is machine-shaped. */
  mono?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** Supply a custom control instead of the built-in input. */
  children?: React.ReactNode;
}

export declare function Field(props: FieldProps): JSX.Element;
