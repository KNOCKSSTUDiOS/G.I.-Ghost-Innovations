import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function root(...segments) {
  return path.join(__dirname, "..", "..", ...segments);
}

export function src(...segments) {
  return path.join(__dirname, "..", ...segments);
}

export function resolveFrom(base, ...segments) {
  return path.join(base, ...segments);
}
