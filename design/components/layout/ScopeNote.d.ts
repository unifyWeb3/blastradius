import * as React from "react";

/** Data-provenance footnote pinned to the bottom of the sidebar. */
export interface ScopeNoteProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: string;
  children?: React.ReactNode;
}

export declare function ScopeNote(props: ScopeNoteProps): JSX.Element;
