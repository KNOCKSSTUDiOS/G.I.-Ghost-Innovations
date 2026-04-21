import crypto from "crypto";

export function sha256(input = "") {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function sha1(input = "") {
  return crypto.createHash("sha1").update(input).digest("hex");
}

export function md5(input = "") {
  return crypto.createHash("md5").update(input).digest("hex");
}

