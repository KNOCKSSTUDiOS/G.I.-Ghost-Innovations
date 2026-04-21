import fs from "fs";
import path from "path";

export interface GIMemoryConfig {
  file?: string;
  maxShort?: number;
  maxLong?: number;
}

export interface GIMemoryItem {
  id: string;
  type: "short" | "long";
  weight: number;
  timestamp: number;
  content: any;
}

export class GI_MemoryEngine {
  short: GIMemoryItem[];
  long: GIMemoryItem[];
  file: string;
  maxShort: number;
  maxLong: number;

  constructor(config: GIMemoryConfig = {}) {
    this.file = config.file || path.join(process.cwd(), "gi-memory.json");
    this.maxShort = config.maxShort || 50;
    this.maxLong = config.maxLong || 500;

    const loaded = this.load();
    this.short = loaded.short;
    this.long = loaded.long;
  }

  load() {
    try {
      if (!fs.existsSync(this.file)) {
        return { short: [], long: [] };
      }
      const raw = fs.readFileSync(this.file, "utf8");
      return JSON.parse(raw);
    } catch {
      return { short: [], long: [] };
    }
  }

  save() {
    const data = {
      short: this.short,
      long: this.long
    };
    fs.writeFileSync(this.file, JSON.stringify(data, null, 2));
  }

  addShort(content: any, weight: number = 1) {
    const item: GIMemoryItem = {
      id: crypto.randomUUID(),
      type: "short",
      weight,
      timestamp: Date.now(),
      content
    };

    this.short.push(item);
    if (this.short.length > this.maxShort) {
      this.short.shift();
    }

    this.save();
    return item;
  }

  addLong(content: any, weight: number = 1) {
    const item: GIMemoryItem = {
      id: crypto.randomUUID(),
      type: "long",
      weight,
      timestamp: Date.now(),
      content
    };

    this.long.push(item);
    if (this.long.length > this.maxLong) {
      this.long.shift();
    }

    this.save();
    return item;
  }

  recall(query: string) {
    const q = query.toLowerCase();

    const all = [...this.short, ...this.long];

    const scored = all
      .map(item => {
        const text = JSON.stringify(item.content).toLowerCase();
        const match = text.includes(q) ? 1 : 0;
        return {
          item,
          score: match * item.weight
        };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.item);

    return scored;
  }

  evolve() {
    for (const item of this.short) {
      item.weight *= 0.98;
    }
    for (const item of this.long) {
      item.weight *= 0.995;
    }
    this.save();
  }
}

import crypto from "crypto";

export function createGIMemoryEngine(config: GIMemoryConfig = {}) {
  return new GI_MemoryEngine(config);
}

