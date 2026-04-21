import fs from "fs";
import path from "path";

export function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

export function readFile(filePath, encoding = "utf8") {
  try {
    return fs.readFileSync(filePath, encoding);
  } catch {
    return null;
  }
}

export function writeFile(filePath, data = "", encoding = "utf8") {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, data, encoding);
    return true;
  } catch {
    return false;
  }
}

export function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
