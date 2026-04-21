export interface GISessionData {
  id: string;
  userId: string | null;
  rank: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  data: Record<string, any>;
}

export interface GISessionConfig {
  ttl?: number;
}

export class GI_SessionEngine {
  store: Map<string, GISessionData>;
  ttl: number;

  constructor(config: GISessionConfig = {}) {
    this.store = new Map();
    this.ttl = config.ttl || 1000 * 60 * 60 * 24; // 24h
  }

  create(userId: string | null = null, rank: string = "guest") {
    const id = crypto.randomUUID();
    const now = Date.now();

    const session: GISessionData = {
      id,
      userId,
      rank,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + this.ttl,
      data: {}
    };

    this.store.set(id, session);
    return session;
  }

  get(id: string) {
    const session = this.store.get(id);
    if (!session) return null;

    if (session.expiresAt < Date.now()) {
      this.store.delete(id);
      return null;
    }

    session.updatedAt = Date.now();
    return session;
  }

  update(id: string, patch: Record<string, any>) {
    const session = this.get(id);
    if (!session) return null;

    session.data = { ...session.data, ...patch };
    session.updatedAt = Date.now();
    return session;
  }

  attach(req: any, res: any, next: Function) {
    const sid = req.headers["x-session-id"];
    let session = sid ? this.get(sid) : null;

    if (!session) {
      session = this.create(null, "guest");
      res.setHeader("x-session-id", session.id);
    }

    req.session = session;
    next();
  }

  destroy(id: string) {
    this.store.delete(id);
  }
}

import crypto from "crypto";

export function createGISessionEngine(config: GISessionConfig = {}) {
  return new GI_SessionEngine(config);
}

