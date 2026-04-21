import fs from "fs";
import path from "path";

export type GILogLevel = "debug" | "info" | "warn" | "error";

export interface GILogEntry {
  id: string;
  level: GILogLevel;
  message: string;
  context?: any;
  timestamp: number;
}

export interface GILogSink {
  write(entry: GILogEntry): void | Promise<void>;
}

export interface GILogEngineConfig {
  level?: GILogLevel;
  sinks?: GILogSink[];
  console?: boolean;
}

export class GI_LogEngine {
  private level: GILogLevel;
  private sinks: GILogSink[];

  constructor(config: GILogEngineConfig = {}) {
    this.level = config.level || "info";
    this.sinks = config.sinks || [];

    if (config.console !== false) {
      this.sinks.push(new GI_ConsoleSink());
    }
  }

  private shouldLog(level: GILogLevel): boolean {
    const order: GILogLevel[] = ["debug", "info", "warn", "error"];
    return order.indexOf(level) >= order.indexOf(this.level);
  }

  private emit(level: GILogLevel, message: string, context?: any) {
    if (!this.shouldLog(level)) return;

    const entry: GILogEntry = {
      id: crypto.randomUUID(),
      level,
      message,
      context,
      timestamp: Date.now()
    };

    for (const sink of this.sinks) {
      try {
        sink.write(entry);
      } catch {
        // sinks must never break the engine
      }
    }
  }

  debug(msg: string, ctx?: any) {
    this.emit("debug", msg, ctx);
  }

  info(msg: string, ctx?: any) {
    this.emit("info", msg, ctx);
  }

  warn(msg: string, ctx?: any) {
    this.emit("warn", msg, ctx);
  }

  error(msg: string, ctx?: any) {
    this.emit("error", msg, ctx);
  }

  addSink(sink: GILogSink) {
    this.sinks.push(sink);
  }

  setLevel(level: GILogLevel) {
    this.level = level;
  }
}

// ---------- CONSOLE SINK ----------
export class GI_ConsoleSink implements GILogSink {
  write(entry: GILogEntry) {
    const ts = new Date(entry.timestamp).toISOString();
    console.log(`[${ts}] [${entry.level.toUpperCase()}] ${entry.message}`, entry.context || "");
  }
}

// ---------- FILE SINK ----------
export class GI_FileSink implements GILogSink {
  private file: string;

  constructor(filepath: string) {
    this.file = filepath;
  }

  write(entry: GILogEntry) {
    const ts = new Date(entry.timestamp).toISOString();
    const line = JSON.stringify({
      timestamp: ts,
      level: entry.level,
      message: entry.message,
      context: entry.context || null
    }) + "\n";

    const dir = path.dirname(this.file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFileSync(this.file, line, "utf8");
  }
}

export function createGILogEngine(config: GILogEngineConfig = {}) {
  return new GI_LogEngine(config);
}

