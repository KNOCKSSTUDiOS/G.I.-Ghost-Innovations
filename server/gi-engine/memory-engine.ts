export interface GIMemoryItem<T = any> {
  id: string;
  type: string;
  key: string;
  value: T;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface GIMemoryQuery {
  type?: string;
  key?: string;
  tags?: string[];
}

export class GI_MemoryEngine {
  private items: Map<string, GIMemoryItem<any>>;

  constructor() {
    this.items = new Map();
  }

  private makeId(type: string, key: string) {
    return `${type}:${key}`;
  }

  set<T = any>(type: string, key: string, value: T, tags: string[] = []): GIMemoryItem<T> {
    const id = this.makeId(type, key);
    const now = Date.now();

    const existing = this.items.get(id);
    const item: GIMemoryItem<T> = {
      id,
      type,
      key,
      value,
      tags: tags.length ? tags : existing?.tags || [],
      createdAt: existing?.createdAt ?? now,
      updatedAt: now
    };

    this.items.set(id, item);
    return item;
  }

  get<T = any>(type: string, key: string): GIMemoryItem<T> | null {
    return (this.items.get(this.makeId(type, key)) as GIMemoryItem<T>) ?? null;
  }

  delete(type: string, key: string) {
    this.items.delete(this.makeId(type, key));
  }

  query<T = any>(q: GIMemoryQuery): GIMemoryItem<T>[] {
    const out: GIMemoryItem<T>[] = [];

    for (const item of this.items.values()) {
      if (q.type && item.type !== q.type) continue;
      if (q.key && item.key !== q.key) continue;

      if (q.tags && q.tags.length) {
        if (!q.tags.every(t => item.tags.includes(t))) continue;
      }

      out.push(item as GIMemoryItem<T>);
    }

    return out;
  }

  all() {
    return [...this.items.values()];
  }

  clear() {
    this.items.clear();
  }
}

export function createGIMemoryEngine() {
  return new GI_MemoryEngine();
}

