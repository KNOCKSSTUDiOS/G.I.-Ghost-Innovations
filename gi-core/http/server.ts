import { createServer, IncomingMessage, ServerResponse } from "http";
import { HttpRequest } from "./request";
import { HttpResponse } from "./response";
import { HttpContext } from "./context";
import { HttpRouter } from "./router";

export class HttpServer {
  private router: HttpRouter;

  constructor(router: HttpRouter) {
    this.router = router;
  }

  start(port: number) {
    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const method = req.method || "GET";
      const url = req.url || "/";
      const [path, queryString] = url.split("?");
      const headers = req.headers as Record<string, string>;

      let bodyData = "";
      req.on("data", chunk => {
        bodyData += chunk;
      });

      req.on("end", async () => {
        let body: any = null;
        try {
          body = bodyData ? JSON.parse(bodyData) : null;
        } catch {
          body = bodyData;
        }

        const query: Record<string, string> = {};
        if (queryString) {
          for (const part of queryString.split("&")) {
            const [k, v] = part.split("=");
            query[k] = v;
          }
        }

        const request = new HttpRequest(method, path, headers, query, body);
        const response = new HttpResponse();
        const ctx = new HttpContext(request, response);

        await this.router.handle(ctx);

        res.statusCode = response.statusCode;
        for (const key in response.headers) {
          res.setHeader(key, response.headers[key]);
        }
        res.end(response.body);
      });
    });

    server.listen(port);
  }
}

