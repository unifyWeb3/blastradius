import type { TimeWindow } from "../domain/temporal.js";

export const formatUtc = (timestamp: number): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(timestamp);

export const formatDuration = (window: TimeWindow): string => {
  const milliseconds = window.end - window.start;
  const hours = milliseconds / 3_600_000;
  return hours >= 1 ? `${hours.toFixed(hours >= 10 ? 0 : 1)}h` : `${Math.round(milliseconds / 60_000)}m`;
};

export const toDateTimeInput = (timestamp: number): string => new Date(timestamp).toISOString().slice(0, 23);

export const fromDateTimeInput = (value: string): number => Date.parse(`${value}Z`);

export const formatLatency = (milliseconds: number): string =>
  milliseconds >= 1_000 ? `${(milliseconds / 1_000).toFixed(2)}s` : `${milliseconds.toFixed(0)}ms`;
