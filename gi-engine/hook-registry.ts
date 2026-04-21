import crypto from "crypto";

export interface GIHookHandler {
  id: string;
  event: string;
  fn: Function;
  createdAt: number;
}

export class GI_HookRegistry {
  internal: Map<string, GIHookHandler[]>;
  external: any;

  constructor(webhookEngine: any = null) {
    this.internal = new Map();
    this.external = webhookEngine;
  }

  on(event: string, fn: Function) {
    const handler: GIHookHandler = {
      id: crypto.randomUUID(),
      event,
      fn,
      createdAt: Date.now()
    };

    if (!this.internal.has(event)) {
      this.internal.set(event, []);
    }

    this.internal.get(event)!.push(handler);
    return handler;
  }

  off(id: string) {
    for (const [event, handlers] of this.internal.entries()) {
      const filtered = handlers.filter(h => h.id !== id);
      this.internal.set(event, filtered);
    }
  }

  async emit(event: string, payload: any) {
    const results: any[] = [];

    // Internal handlers
    const handlers = this.internal.get(event) || [];
    for (const handler of handlers) {
      try {
        const res = await handler.fn(payload);
        results.push({ id: handler.id, ok: true, res });
      } catch (err: any) {
        results.push({
          id: handler.id,
          ok: false,
          error: err?.message || "Unknown error"
        });
      }
    }

    // External webhooks
    if (this.external && this.external.trigger) {
      const ext = await this.external.trigger(event, payload);
      results.push(...ext);
    }

    return results;
  }
}

export function createGIHookRegistry(webhookEngine: any = null) {
  return new GI_HookRegistry(webhookEngine);
}

