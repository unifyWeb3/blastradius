import * as React from "react";

/** Dismissible API/HydraDB failure alert. */
export interface ErrorBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The API's stable message, verbatim — e.g. "HydraDB could not complete the graph operation." */
  message: React.ReactNode;
  /** Omit to render a non-dismissible banner. */
  onDismiss?: () => void;
}

export declare function ErrorBanner(props: ErrorBannerProps): JSX.Element;
