import path from "path";

export function join(...parts) {
  return path.join(...parts);
}

export function normalize(p = "") {
  return path.normalize(p);
}

export function ensureTrailingSlash(p = "") {
  if (!p.endsWith("/")) return p + "/";
  return p;
}
