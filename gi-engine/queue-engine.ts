import crypto from "crypto";

export interface GIQueueMessage<T = any> {
  id: string;
  channel: string;
  payload: T;
  timestamp: number;
}

export interface GIQueueSubscriber {
  id: string;
  channel: string;
  handler: Function;
  createdAt: number;
}

export interface GIQueueConfig {
  maxMessages?: number;
}

export class GI_QueueEngine {
  messages: Map<string, GIQueueMessage>;
  subscribers: Map<string, GIQueueSubscriber[]>;
  maxMessages: number;

  constructor(config: GIQueueConfig = {}) {
    this.messages = new Map();
    this.subscribers = new Map();
    this.maxMessages = config.maxMessages || 1000;
  }

  publish<T = any>(channel: string, payload: T) {
    const msg: GIQueueMessage<T> = {
      id: crypto.randomUUID(),
      channel,
      payload,
      timestamp: Date.now()
    };

    this.messages.set(msg.id, msg);

    if (this.messages.size > this.maxMessages) {
      const oldest = [...this.messages.values()].sort(
        (a, b) => a.timestamp - b.timestamp
      )[0];
      if (oldest) this.messages.delete(oldest.id);
    }

    const subs = this.subscribers.get(channel) || [];
    for (const sub of subs) {
      try {
        sub.handler(payload);
      } catch {
        // subscriber errors are isolated
      }
    }

    return msg;
  }

  subscribe(channel: string, handler: Function) {
    const sub: GIQueueSubscriber = {
      id: crypto.randomUUID(),
      channel,
      handler,
      createdAt: Date.now()
    };

    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, []);
    }

    this.subscribers.get(channel)!.push(sub);
    return sub;
  }

  unsubscribe(id: string) {
    for (const [channel, subs] of this.subscribers.entries()) {
      const filtered = subs.filter(s => s.id !== id);
      this.subscribers.set(channel, filtered);
    }
  }

  listMessages(channel?: string) {
    const all = [...this.messages.values()];
    if (!channel) return all;
    return all.filter(m => m.channel === channel);
  }

  listSubscribers(channel?: string) {
    if (!channel) {
      return [...this.subscribers.values()].flat();
    }
    return this.subscribers.get(channel) || [];
  }
}

export function createGIQueueEngine(config: GIQueueConfig = {}) {
  return new GI_QueueEngine(config);
}

