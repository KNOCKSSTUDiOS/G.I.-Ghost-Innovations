import crypto from "crypto";

export interface GIStateSlice<T = any> {
  id: string;
  key: string;
  value: T;
  updatedAt: number;
}

export interface GIStateConfig {
  maxSlices?: number;
}

export class GI_StateEngine {
  slices: Map<string, GIStateSlice>;
  maxSlices: number;

  constructor(config: GIStateConfig = {}) {
    this.slices = new Map();
    this.maxSlices = config.maxSlices || 500;
  }

  set<T = any>(key: string, value: T) {
    const slice: GIStateSlice<T> = {
      id: crypto.randomUUID(),
      key,
      value,
      updatedAt: Date.now()
    };

    this.slices.set(key, slice);

    if (this.slices.size > this.maxSlices) {
      const oldest = [...this.slices.values()].sort(
        (a, b) => a.updatedAt - b.updatedAt
      )[0];
      if (oldest) this.slices.delete(oldest.key);
    }

    return slice;
  }

  get<T = any>(key: string): T | null {
    const slice = this.slices.get(key);
    return slice ? (slice.value as T) : null;
  }

  delete(key: string) {
    this.slices.delete(key);
  }

  all() {
    return [...this.slices.values()];
  }

  patch<T = any>(key: string, patch: Partial<T>) {
    const current = this.get<T>(key);
    if (!current) return this.set(key, patch as T);

    const merged = { ...(current as any), ...patch };
    return this.set(key, merged);
  }

  select<T = any>(selector: (state: Record<string, any>) => T) {
    const obj: Record<string, any> = {};
    for (const slice of this.slices.values()) {
      obj[slice.key] = slice.value;
    }
    return selector(obj);
  }
}

export function createGIStateEngine(config: GIStateConfig = {}) {
  return new GI_StateEngine(config);
}

