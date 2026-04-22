import { Core } from "../core";
import { IncomingMessage, ServerResponse } from "http";

export function createRequestLogger(core: Core) {
  return async function requestLogger(
    req: IncomingMessage,
    res: ServerResponse,
    next: () => Promise<void>
  ) {
    const start = Date.now();

    await next();

    const duration = Date.now() - start;

    core.logger.log("request", {
      method: req.method || "",
      url: req.url || "",
      duration
    });
  };
}

