import fs from "fs";
import path from "path";

export function readJSON(filePath = "") {
  try {
    const full = path.resolve(filePath);
    const raw = fs.readFileSync(full, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeJSON(filePath = "", data = {}) {
  const full = path.resolve(filePath);
  fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf8");
  return true;
}

export function exists(filePath = "") {
  return fs.existsSync(path.resolve(filePath));
}

