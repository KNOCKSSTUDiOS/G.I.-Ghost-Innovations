import fs from "fs";
import path from "path";

export interface GIConfigSchema {
  [key: string]: "string" | "number" | "boolean";
}

export interface GIConfigOptions {
  envFile?: string;
  schema?: GIConfigSchema;
}

export class GI_ConfigEngine {
  envFile: string;
  schema: GIConfigSchema;
  values: Record<string, any>;

  constructor(options: GIConfigOptions = {}) {
    this.envFile = options.envFile || path.join(process.cwd(), ".env");
    this.schema = options.schema || {};
    this.values = {};
    this.load();
    this.validate();
  }

  load() {
    if (!fs.existsSync(this.envFile)) return;

    const raw = fs.readFileSync(this.envFile, "utf8");
    const lines = raw.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const [key, ...rest] = trimmed.split("=");
      const value = rest.join("=").trim();

      this.values[key] = value;
    }
  }

  validate() {
    for (const key of Object.keys(this.schema)) {
      const type = this.schema[key];
      const raw = this.values[key];

      if (raw === undefined) {
        throw new Error(`Missing required config key: ${key}`);
      }

      switch (type) {
        case "string":
          this.values[key] = String(raw);
          break;

        case "number":
          const num = Number(raw);
          if (isNaN(num)) {
            throw new Error(`Config key ${key} must be a number`);
          }
          this.values[key] = num;
          break;

        case "boolean":
          this.values[key] = raw === "true" || raw === "1";
          break;
      }
    }
  }

  get(key: string) {
    return this.values[key];
  }

  inject(target: any) {
    for (const key of Object.keys(this.values)) {
      target[key] = this.values[key];
    }
  }
}

export function createGIConfigEngine(options: GIConfigOptions = {}) {
  return new GI_ConfigEngine(options);
}

