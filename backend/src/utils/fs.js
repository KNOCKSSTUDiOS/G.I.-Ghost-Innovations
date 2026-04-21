import fs from "fs";
import path from "path";

export function read(filePath = "") {
  return fs.readFileSync(path.resolve(filePath), "utf8");
}

export function write(filePath = "", data = "") {
  fs.writeFileSync(path.resolve(filePath), data, "utf8");
  return true;
}

export function exists(filePath = "") {
  return fs.existsSync(path.resolve(filePath));
}

export function mkdir(dirPath = "") {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return true;
}
