import fs from "fs";

export function read(filePath = "") {
  return fs.readFileSync(filePath, "utf8");
}

export function write(filePath = "", data = "") {
  fs.writeFileSync(filePath, data, "utf8");
  return true;
}

export function exists(filePath = "") {
  return fs.existsSync(filePath);
}
