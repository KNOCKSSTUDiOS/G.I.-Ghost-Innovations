import { GI_CacheEngine, createGICacheEngine } from "./cache-engine";
import { GI_StorageEngine } from "./storage-engine";

export interface GICachePersistConfig {
  namespace?: string;
  ttl?: number;
  syncInterval?: number;
}

export class GI_CachePersistEngine {
  private cache: GI_CacheEngine;
  private storage: GI_StorageEngine;
  private namespace: string;
  private ttl: number;
  private syncInterval: number;
  private timer: any;

  constructor(storage: GI_StorageEngine, config: GICachePersistConfig = {}) {
    this.storage = storage;
    this.namespace = config.namespace || "default";
    this.ttl = config.ttl ?? 1000 * 60 * 5;
    this.syncInterval = config.syncInterval ?? 2000;

    this.cache = createGICacheEngine({ defaultTTL: this.ttl });

    this.timer = setInterval(() => this.syncToStorage(), this.syncInterval);
  }

  async init() {
    const saved = this.storage.get<Record<string, any>>(this.namespace) || {};
    for (const [key, entry] of Object.entries(saved)) {
      this.cache.set(key, entry.value, entry.expiresAt ? entry.expiresAt - Date.now() : null);
    }
  }

  get<T = any>(key: string): T | null {
    return this.cache.get<T>(key);
  }

  set<T = any>(key: string, value: T, ttl: number | null = null) {
    this.cache.set(key, value, ttl ?? this.ttl);
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  private async syncToStorage() {
    const entries = this.cache.entries();
    const serialized: Record<string, any> = {};

    for (const entry of entries) {
      serialized[entry.key] = {
        value: entry.value,
        createdAt: entry.createdAt,
        expiresAt: entry.expiresAt
      };
    }

    this.storage.set(this.namespace, serialized);
    await this.storage.save();
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }
}

export function createGICachePersistEngine(
  storage: GI_StorageEngine,
  config: GICachePersistConfig = {}
) {
  return new GI_CachePersistEngine(storage, config);
}

