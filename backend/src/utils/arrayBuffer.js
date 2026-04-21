export function toBuffer(ab) {
  return Buffer.from(ab);
}

export function toBase64(ab) {
  return Buffer.from(ab).toString("base64");
}

export function fromBase64(str = "") {
  return Buffer.from(str, "base64");
}

