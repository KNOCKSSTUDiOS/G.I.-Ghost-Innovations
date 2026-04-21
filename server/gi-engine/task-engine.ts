import crypto from "crypto";

export type GITaskStatus = "pending" | "running" | "completed" | "failed";

export interface GITask<T = any> {
  id: string;
  name: string;
  payload: T;
  status: GITaskStatus;
  createdAt: number;
  updatedAt: number;
  runAt: number;
  repeatEvery?: number;
  lastError?: string;
}

export type GITaskHandler<T = any> = (payload: T) => void | Promise<void>;

export class GI_TaskEngine {
  private tasks: Map<string, GITask<any>>;
  private handlers: Map<string, GITaskHandler<any>>;
  private interval: NodeJS.Timeout | null;
  private tickRate: number;

  constructor(tickRate: number = 250) {
    this.tasks = new Map();
    this.handlers = new Map();
    this.interval = null;
    this.tickRate = tickRate;
  }

  // -----------------------------
  // REGISTER HANDLERS
  // -----------------------------
  register<T = any>(taskName: string, handler: GITaskHandler<T>) {
    this.handlers.set(taskName, handler as GITaskHandler<any>);
  }

  // -----------------------------
  // CREATE TASK
  // -----------------------------
  schedule<T = any>(
    name: string,
    payload: T,
    delay: number = 0,
    repeatEvery?: number
  ): GITask<T> {
    const id = crypto.randomUUID();
    const now = Date.now();

    const task: GITask<T> = {
      id,
      name,
      payload,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      runAt: now + delay,
      repeatEvery
    };

    this.tasks.set(id, task);
    return task;
  }

  // -----------------------------
  // INTERNAL EXECUTION LOOP
  // -----------------------------
  private async runTask(task: GITask<any>) {
    const handler = this.handlers.get(task.name);
    if (!handler) {
      task.status = "failed";
      task.lastError = `No handler registered for task: ${task.name}`;
      task.updatedAt = Date.now();
      return;
    }

    task.status = "running";
    task.updatedAt = Date.now();

    try {
      const result = handler(task.payload);
      if (result instanceof Promise) {
        await result;
      }

      task.status = "completed";
      task.updatedAt = Date.now();

      if (task.repeatEvery) {
        task.status = "pending";
        task.runAt = Date.now() + task.repeatEvery;
      }
    } catch (err: any) {
      task.status = "failed";
      task.lastError = err?.message || "Unknown error";
      task.updatedAt = Date.now();

      if (task.repeatEvery) {
        task.status = "pending";
        task.runAt = Date.now() + task.repeatEvery;
      }
    }
  }

  private async tick() {
    const now = Date.now();

    for (const task of this.tasks.values()) {
      if (task.status === "pending" && task.runAt <= now) {
        await this.runTask(task);
      }
    }
  }

  // -----------------------------
  // START / STOP ENGINE
  // -----------------------------
  start() {
    if (this.interval) return;
    this.interval = setInterval(() => this.tick(), this.tickRate);
  }

  stop() {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = null;
  }

  // -----------------------------
  // QUERY
  // -----------------------------
  get(id: string): GITask<any> | null {
    return this.tasks.get(id) ?? null;
  }

  all(): GITask<any>[] {
    return [...this.tasks.values()];
  }

  clear() {
    this.tasks.clear();
  }
}

export function createGITaskEngine(tickRate?: number) {
  return new GI_TaskEngine(tickRate);
}

