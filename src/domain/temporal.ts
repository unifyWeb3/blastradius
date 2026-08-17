export interface TimeWindow {
  start: number;
  end: number;
}

export type TemporalEvaluation =
  | { status: "exposed"; effectiveWindow: TimeWindow }
  | { status: "not_exposed"; reason: "no_common_overlap" }
  | { status: "unresolved"; reason: "missing_dependency_validity" };

export const assertValidTimeWindow = (window: TimeWindow, name = "time window"): void => {
  if (!Number.isSafeInteger(window.start) || !Number.isSafeInteger(window.end)) {
    throw new TypeError(`${name} must use safe integer epoch milliseconds.`);
  }
  if (window.start >= window.end) {
    throw new RangeError(`${name} must be a non-empty half-open interval [start, end).`);
  }
};

export const intersectTimeWindows = (windows: readonly TimeWindow[]): TimeWindow | null => {
  if (windows.length === 0) {
    return null;
  }

  for (const window of windows) {
    assertValidTimeWindow(window);
  }

  const start = Math.max(...windows.map((window) => window.start));
  const end = Math.min(...windows.map((window) => window.end));
  return start < end ? { start, end } : null;
};

export const evaluateTemporalExposure = (
  requestedWindow: TimeWindow,
  compromisedWindow: TimeWindow,
  dependencyWindows: readonly (TimeWindow | null)[],
): TemporalEvaluation => {
  assertValidTimeWindow(requestedWindow, "requested window");
  assertValidTimeWindow(compromisedWindow, "compromised window");

  if (dependencyWindows.some((window) => window === null)) {
    return { status: "unresolved", reason: "missing_dependency_validity" };
  }

  const effectiveWindow = intersectTimeWindows([
    requestedWindow,
    compromisedWindow,
    ...(dependencyWindows as TimeWindow[]),
  ]);

  return effectiveWindow
    ? { status: "exposed", effectiveWindow }
    : { status: "not_exposed", reason: "no_common_overlap" };
};
