export type TaskStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export class Task {
  id: string;
  runFn: () => Promise<void> | void;
  status: TaskStatus = "pending";
  error: any = null;

  constructor(id: string, runFn: () => Promise<void> | void) {
    this.id = id;
    this.runFn = runFn;
  }

  async run() {
    if (this.status !== "pending") return;
    this.status = "running";
    try {
      await this.runFn();
      if (this.status === "running") {
        this.status = "completed";
      }
    } catch (err) {
      this.status = "failed";
      this.error = err;
    }
  }

  cancel() {
    if (this.status === "running" || this.status === "pending") {
      this.status = "cancelled";
    }
  }
}

export class TaskQueue {
  private tasks: Map<string, Task> = new Map();

  add(task: Task) {
    this.tasks.set(task.id, task);
  }

  get(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  delete(id: string) {
    this.tasks.delete(id);
  }

  async run(id: string) {
    const task = this.tasks.get(id);
    if (!task) return;
    await task.run();
  }

  cancel(id: string) {
    const task = this.tasks.get(id);
    if (!task) return;
    task.cancel();
  }

  list() {
    return Array.from(this.tasks.values());
  }
}

