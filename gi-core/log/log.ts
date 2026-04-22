export type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  private level: LogLevel = "info";

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private shouldLog(level: LogLevel) {
    const order: LogLevel[] = ["debug", "info", "warn", "error"];
    return order.indexOf(level) >= order.indexOf(this.level);
  }

  debug(msg: string) {
    if (this.shouldLog("debug")) {
      console.debug(msg);
    }
  }

  info(msg: string) {
    if (this.shouldLog("info")) {
      console.info(msg);
    }
  }

  warn(msg: string) {
    if (this.shouldLog("warn")) {
      console.warn(msg);
    }
  }

  error(msg: string) {
    if (this.shouldLog("error")) {
      console.error(msg);
    }
  }
}

