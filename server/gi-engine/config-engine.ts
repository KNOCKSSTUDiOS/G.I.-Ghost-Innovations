import fs from "fs";
import path from "path";

export interface GIConfigSource {
  [key: string]: any;
}

export class GI_ConfigEngine {
  private sources: GIConfigSource[] = [];
  private envLoaded: boolean = false;

  constructor() {}

  // -----------------------------
  // LOAD ENV FILE
  // -----------------------------
  loadEnv(filePath: string = ".env") {
    if (this.envLoaded) return;

    const full = path.join(process.cwd(), filePath);
    if (!fs.existsSync(full)) return;

    const raw = fs.readFileSync(full, "utf8");
    const lines = raw.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.substring(0, eq).trim();
      const value = trimmed.substring(eq + 1).trim();

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }

    this.envLoaded = true;
  }

  // -----------------------------
  // ADD CONFIG SOURCE
  // -----------------------------
  addSource(source: GIConfigSource) {
    this.sources.push(source);
  }

  // -----------------------------
  // GET VALUE
  // -----------------------------
  get<T = any>(key: string, fallback?: T): T {
    // 1. Check sources (highest priority last)
    for (let i = this.sources.length - 1; i >= 0; i--) {
      const src = this.sources[i];
      if (key in src) return src[key] as T;
    }

    // 2. Check environment
    if (process.env[key] !== undefined) {
      return process.env[key] as unknown as T;
    }

    // 3. Fallback
    return fallback as T;
  }

  // -----------------------------
  // REQUIRE VALUE
  // -----------------------------
  require<T = any>(key: string): T {
    const val = this.get<T>(key);
    if (val === undefined || val === null) {
      throw new Error(`Missing required config key: ${key}`);
    }
    return val;
  }

  // -----------------------------
  // MERGE SOURCE
  // -----------------------------
  merge(source: GIConfigSource) {
    this.sources.push(source);
  }

  // -----------------------------
  // LIST ALL
  // -----------------------------
  all(): Record<string, any> {
    const out: Record<string, any> = {};

    for (const src of this.sources) {
      for (const k of Object.keys(src)) {
        out[k] = src[k];
      }
    }

    for (const k of Object.keys(process.env)) {
      if (!(k in out)) {
        out[k] = process.env[k];
      }
    }

    return out;
  }
}

export function createGIConfigEngine() {
  return new GI_ConfigEngine();
}
