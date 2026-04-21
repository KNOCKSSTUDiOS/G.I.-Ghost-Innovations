import fs from "fs";
import path from "path";

export interface GIStorageAdapter {
  load(): Promise<Record<string, any>>;
  save(data: Record<string, any>): Promise<void>;
}

export interface GIStorageConfig {
  adapter: GIStorageAdapter;
  autosave?: boolean;
  autosaveInterval?: number;
}

export class GI_StorageEngine {
  private data: Record<string, any>;
  private adapter: GIStorageAdapter;
  private autosave: boolean;
  private autosaveInterval: number;
  private timer: any;

  constructor(config: GIStorageConfig) {
    this.adapter = config.adapter;
    this.autosave = config.autosave ?? true;
    this.autosaveInterval = config.autosaveInterval ?? 2000;
    this.data = {};

    if (this.autosave) {
      this.timer = setInterval(() => this.save(), this.autosaveInterval);
    }
  }

  async init() {
    this.data = await this.adapter.load();
  }

  get<T = any>(key: string): T | null {
    return this.data[key] ?? null;
  }

  set<T = any>(key: string, value: T) {
    this.data[key] = value;
  }

  delete(key: string) {
    delete this.data[key];
  }

  all() {
    return { ...this.data };
  }

  async save() {
    await this.adapter.save(this.data);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }
}

// ---------- MEMORY ADAPTER ----------
export class GI_MemoryAdapter implements GIStorageAdapter {
  private store: Record<string, any> = {};

  async load() {
    return { ...this.store };
  }

  async save(data: Record<string, any>) {
    this.store = { ...data };
  }
}

// ---------- FILE ADAPTER ----------
export class GI_FileAdapter implements GIStorageAdapter {
  private file: string;

  constructor(filepath: string) {
    this.file = filepath;
  }

  async load() {
    if (!fs.existsSync(this.file)) return {};
    const raw = await fs.promises.readFile(this.file, "utf8");
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  async save(data: Record<string, any>) {
    const dir = path.dirname(this.file);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(this.file, JSON.stringify(data, null, 2), "utf8");
  }
}

export function createGIStorageEngine(config: GIStorageConfig) {
  return new GI_StorageEngine(config);
}

