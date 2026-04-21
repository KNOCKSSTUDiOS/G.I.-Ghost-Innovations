export class Logger {
  private entries: string[];

  constructor() {
    this.entries = [];
  }

  log(message: string) {
    const entry = `[${new Date().toISOString()}] ${message}`;
    this.entries.push(entry);
    console.log(entry);
  }

  getRecent(limit: number = 50) {
    return this.entries.slice(-limit);
  }

  clear() {
    this.entries = [];
  }
}

