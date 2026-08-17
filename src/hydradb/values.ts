import type { HydraPropertyMap, HydraScalar, HydraValue } from "./types.js";

export const hydraScalar = (value: HydraValue | undefined): HydraScalar => {
  if (!value) {
    return null;
  }

  if (value.type === "path") {
    throw new TypeError("Expected a scalar HydraDB value, received a path.");
  }

  return value.value;
};

export const hydraProperty = (properties: HydraPropertyMap, name: string): HydraScalar => {
  const tagged = properties[name];
  if (!tagged) {
    return null;
  }

  for (const key of ["String", "Integer", "Float", "Bool", "Boolean", "Null"]) {
    if (Object.hasOwn(tagged, key)) {
      return tagged[key] ?? null;
    }
  }

  return null;
};

export const requireString = (value: HydraScalar, field: string): string => {
  if (typeof value !== "string") {
    throw new TypeError(`Expected ${field} to be a string.`);
  }
  return value;
};

export const requireNumber = (value: HydraScalar, field: string): number => {
  if (typeof value !== "number") {
    throw new TypeError(`Expected ${field} to be a number.`);
  }
  return value;
};
