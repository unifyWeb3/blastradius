export type HydraScalar = string | number | boolean | null;

export type HydraTaggedScalar =
  | { type: "string"; value: string }
  | { type: "integer"; value: number }
  | { type: "float"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "null"; value: null }
  | { type: "vertex_id"; value: number };

export interface HydraPropertyMap {
  [key: string]: Record<string, HydraScalar>;
}

export interface HydraPathNode {
  id: number;
  labels: string[];
  properties: HydraPropertyMap;
}

export interface HydraPathRelationship {
  id: number;
  edge_type: string;
  src: number;
  dst: number;
  properties: HydraPropertyMap;
}

export interface HydraPath {
  nodes: HydraPathNode[];
  relationships: HydraPathRelationship[];
}

export type HydraValue = HydraTaggedScalar | { type: "path"; value: HydraPath };

export interface HydraQueryResponse {
  query_id: string;
  columns: string[];
  rows: HydraValue[][];
  read_epoch: number | null;
  next_cursor: string | null;
  bookmark?: string;
}

export interface HydraQueryResult {
  response: HydraQueryResponse;
  durationMs: number;
}
