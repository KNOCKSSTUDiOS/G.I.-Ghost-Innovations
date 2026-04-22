import { IncomingMessage, ServerResponse } from "http";

type Handler = (
  req: IncomingMessage,
  res: ServerResponse
) => Promise<void> | void;

interface Route {
  method: string;
  path: string;
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  register(method: string, path: string, handler: Handler) {
    this.routes.push({ method, path, handler });
  }

  async handle(req: IncomingMessage, res: ServerResponse) {
    const method = req.method || "";
    const url = req.url || "";

    const route = this.routes.find(
      r => r.method === method && r.path === url
    );

    if (!route) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "not_found" }));
      return;
    }

    await route.handler(req, res);
  }
}
