import crypto from "crypto";

export type GITaskStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export interface GITaskConfig {
  id?: string;
  priority?: number;
  retries?: number;
  delay?: number;
}

export interface GITask<T = any> {
  id: string;
  run: () => Promise<T>;
  status: GITaskStatus;
  priority: number;
  retries: number;
  attempts: number;
  createdAt: number;
  updatedAt: number;
  delay: number;
}

export class GI_TaskEngine {
  private queue: GITask[];
  private running: boolean;

  constructor() {
    this.queue = [];
    this.running = false;
  }

  add<T>(run: () => Promise<T>, config: GITaskConfig = {}): GITask<T> {
    const task: GITask<T> = {
      id: config.id || crypto.randomUUID(),
      run,
      status: "pending",
      priority: config.priority ?? 0,
      retries: config.retries ?? 0,
      attempts: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      delay: config.delay ?? 0
    };

    this.queue.push(task);
    this.sortQueue();
    this.process();

    return task;
  }

  private sortQueue() {
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  private async process() {
    if (this.running) return;
    this.running = true;

    while (true) {
      const next = this.queue.find(t => t.status === "pending");
      if (!next) break;

      if (next.delay > 0) {
        await new Promise(res => setTimeout(res, next.delay));
        next.delay = 0;
      }

      next.status = "running";
      next.updatedAt = Date.now();

      try {
        next.attempts++;
        await next.run();
        next.status = "completed";
      } catch (err) {
        if (next.attempts <= next.retries) {
          next.status = "pending";
        } else {
          next.status = "failed";
        }
      }

      next.updatedAt = Date.now();
    }

    this.running = false;
  }

  cancel(id: string) {
    const task = this.queue.find(t => t.id === id);
    if (task && task.status === "pending") {
      task.status = "cancelled";
      task.updatedAt = Date.now();
    }
  }

  list(status?: GITaskStatus) {
    if (!status) return [...this.queue];
    return this.queue.filter(t => t.status === status);
  }

  clear() {
    this.queue = [];
  }
}

export function createGITaskEngine() {
  return new GI_TaskEngine();
}
