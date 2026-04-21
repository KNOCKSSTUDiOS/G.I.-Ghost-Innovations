import crypto from "crypto";

export interface GITask {
  id: string;
  type: string;
  payload: any;
  createdAt: number;
  updatedAt: number;
  attempts: number;
  maxAttempts: number;
  status: "pending" | "running" | "failed" | "completed";
  error?: string | null;
}

export interface GITaskConfig {
  maxAttempts?: number;
  concurrency?: number;
  interval?: number;
}

export class GI_TaskEngine {
  queue: Map<string, GITask>;
  workers: number;
  maxAttempts: number;
  interval: number;
  running: boolean;

  constructor(config: GITaskConfig = {}) {
    this.queue = new Map();
    this.workers = config.concurrency || 3;
    this.maxAttempts = config.maxAttempts || 3;
    this.interval = config.interval || 250;
    this.running = false;
  }

  create(type: string, payload: any) {
    const now = Date.now();
    const task: GITask = {
      id: crypto.randomUUID(),
      type,
      payload,
      createdAt: now,
      updatedAt: now,
      attempts: 0,
      maxAttempts: this.maxAttempts,
      status: "pending",
      error: null
    };

    this.queue.set(task.id, task);
    return task;
  }

  get(id: string) {
    return this.queue.get(id) || null;
  }

  list(status?: GITask["status"]) {
    const all = [...this.queue.values()];
    if (!status) return all;
    return all.filter(t => t.status === status);
  }

  async runTask(task: GITask, handler: Function) {
    task.status = "running";
    task.attempts++;
    task.updatedAt = Date.now();

    try {
      await handler(task.payload);
      task.status = "completed";
      task.updatedAt = Date.now();
    } catch (err: any) {
      task.error = err?.message || "Unknown error";
      task.updatedAt = Date.now();

      if (task.attempts >= task.maxAttempts) {
        task.status = "failed";
      } else {
        task.status = "pending";
      }
    }
  }

  async start(handlerMap: Record<string, Function>) {
    if (this.running) return;
    this.running = true;

    const loop = async () => {
      if (!this.running) return;

      const pending = this.list("pending").slice(0, this.workers);

      for (const task of pending) {
        const handler = handlerMap[task.type];
        if (!handler) {
          task.status = "failed";
          task.error = `No handler for task type: ${task.type}`;
          continue;
        }

        await this.runTask(task, handler);
      }

      setTimeout(loop, this.interval);
    };

    loop();
  }

  stop() {
    this.running = false;
  }

  clear() {
    this.queue.clear();
  }
}

export function createGITaskEngine(config: GITaskConfig = {}) {
  return new GI_TaskEngine(config);
}

