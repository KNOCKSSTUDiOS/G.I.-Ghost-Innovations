import fs from "fs";
import path from "path";

export interface GIStorageWriteOptions {
  encoding?: BufferEncoding | null;
  mkdir?: boolean;
}

export interface GIStorageReadOptions {
  encoding?: BufferEncoding | null;
}

export interface GIStorageListEntry {
  name: string;
  path: string;
  isFile: boolean;
  isDirectory: boolean;
  size: number;
  modifiedAt: number;
}

export class GI_StorageEngine {
  private baseDir: string;

  constructor(baseDir?: string) {
    this.baseDir = baseDir ?? path.join(process.cwd(), "storage");

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  private resolve(p: string) {
    return path.join(this.baseDir, p);
  }

  // -----------------------------
  // WRITE
  // -----------------------------
  write(
    filePath: string,
    data: string | Buffer,
    options: GIStorageWriteOptions = {}
  ) {
    const full = this.resolve(filePath);

    if (options.mkdir) {
      const dir = path.dirname(full);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    fs.writeFileSync(full, data, options.encoding ?? null);
  }

  writeJSON(filePath: string, value: any, pretty: boolean = true) {
    const json = pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value);
    this.write(filePath, json, { encoding: "utf8", mkdir: true });
  }

  // -----------------------------
  // READ
  // -----------------------------
  read(filePath: string, options: GIStorageReadOptions = {}): string | Buffer {
    const full = this.resolve(filePath);
    return fs.readFileSync(full, options.encoding ?? null);
  }

  readJSON<T = any>(filePath: string): T {
    const raw = this.read(filePath, { encoding: "utf8" });
    return JSON.parse(raw as string) as T;
  }

  // -----------------------------
  // DELETE
  // -----------------------------
  delete(filePath: string) {
    const full = this.resolve(filePath);
    if (fs.existsSync(full)) {
      fs.unlinkSync(full);
    }
  }

  deleteDir(dirPath: string) {
    const full = this.resolve(dirPath);
    if (fs.existsSync(full)) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }

  // -----------------------------
  // LIST
  // -----------------------------
  list(dirPath: string = "."): GIStorageListEntry[] {
    const full = this.resolve(dirPath);

    if (!fs.existsSync(full)) return [];

    const entries = fs.readdirSync(full, { withFileTypes: true });

    return entries.map(e => {
      const p = path.join(full, e.name);
      const stat = fs.statSync(p);

      return {
        name: e.name,
        path: p,
        isFile: e.isFile(),
        isDirectory: e.isDirectory(),
        size: stat.size,
        modifiedAt: stat.mtimeMs
      };
    });
  }

  // -----------------------------
  // EXISTS
  // -----------------------------
  exists(filePath: string): boolean {
    return fs.existsSync(this.resolve(filePath));
  }

  // -----------------------------
  // ENSURE DIR
  // -----------------------------
  ensureDir(dirPath: string) {
    const full = this.resolve(dirPath);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
    }
  }
}

export function createGIStorageEngine(baseDir?: string) {
  return new GI_StorageEngine(baseDir);
}

