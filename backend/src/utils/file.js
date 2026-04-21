import fs from "fs";
import path from "path";

export function readFile(filePath) {
  try {
    const full = path.resolve(filePath);
    return fs.readFileSync(full, "utf8");
  } catch (err) {
    console.error("File read error:", err);
    return null;
  }
}

export function writeFile(filePath, content = "") {
  try {
    const full = path.resolve(filePath);
    fs.writeFileSync(full, content, "utf8");
    return true;
  } catch (err) {
    console.error("File write error:", err);
    return false;
  }
}
