import crypto from "crypto";

export interface GIEventHandler {
  id: string;
  event: string;
  handler: Function;
  once: boolean;
  createdAt: number;
}

export class GI_EventEngine {
  private handlers: Map<string, GIEventHandler[]>;

  constructor() {
    this.handlers = new Map();
  }

  on(event: string, handler: Function) {
    const entry: GIEventHandler = {
      id: crypto.randomUUID(),
      event,
      handler,
      once: false,
      createdAt: Date.now()
    };

    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }

    this.handlers.get(event)!.push(entry);
    return entry;
  }

  once(event: string, handler: Function) {
    const entry: GIEventHandler = {
      id: crypto.randomUUID(),
      event,
      handler,
      once: true,
      createdAt: Date.now()
    };

    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }

    this.handlers.get(event)!.push(entry);
    return entry;
  }

  off(id: string) {
    for (const [event, list] of this.handlers.entries()) {
      const filtered = list.filter(h => h.id !== id);
      this.handlers.set(event, filtered);
    }
  }

  clear(event?: string) {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }

  emit(event: string, payload?: any) {
    const list = this.handlers.get(event) || [];
    const wildcard = this.handlers.get("*") || [];

    const all = [...list, ...wildcard];

    for (const entry of all) {
      try {
        entry.handler(payload, event);
      } catch {
        // event handlers must never break the engine
      }

      if (entry.once) {
        this.off(entry.id);
      }
    }
  }

  listeners(event?: string) {
    if (event) return this.handlers.get(event) || [];
    return [...this.handlers.values()].flat();
  }
}

export function createGIEventEngine() {
  return new GI_EventEngine();
}

