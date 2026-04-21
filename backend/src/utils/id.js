import crypto from "crypto";

export function uid(length = 32) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export function shortId(length = 8) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

export function timestampId() {
  return `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}
