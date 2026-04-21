import crypto from "crypto";

export function v4() {
  return crypto.randomUUID();
}

export function short(length = 12) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

