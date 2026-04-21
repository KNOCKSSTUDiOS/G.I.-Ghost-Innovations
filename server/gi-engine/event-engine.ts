export interface GIEvent<T = any> {
  id: string;
  name: string;
  payload: T;
  timestamp: number;
}

export type GIEventHandler<T = any> = (event: GIEvent<T>) => void | Promise<void>;

export class GI_EventEngine {
  private listeners: Map<string, Set<GIEventHandler<any>>>;
  private history: GIEvent<any>[];
  private maxHistory: number;

  constructor(maxHistory: number = 500) {
    this.listeners = new Map();
    this.history = [];
    this.maxHistory = maxHistory;
  }

  on<T = any>(eventName: string, handler: GIEventHandler<T>) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(handler as GIEventHandler<any>);
  }

  off<T = any>(eventName: string, handler: GIEventHandler<T>) {
    const set = this.listeners.get(eventName);
    if (!set) return;
    set.delete(handler as GIEventHandler<any>);
  }

  emit<T = any>(eventName: string, payload: T) {
    const event: GIEvent<T> = {
      id: crypto.randomUUID(),
      name: eventName,
      payload,
      timestamp: Date.now()
    };

    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const set = this.listeners.get(eventName);
    if (!set) return;

    for (const handler of set) {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          result.catch(() => {});
        }
      } catch {
        // event handlers must never break the engine
      }
    }
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
  }

  removeAllListeners(eventName?: string) {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }
}

import crypto from "crypto";

export function createGIEventEngine(maxHistory?: number) {
  return new GI_EventEngine(maxHistory);
}

