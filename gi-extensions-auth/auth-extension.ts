import { Core } from "../gi-core/core";
import { Router } from "../gi-router/router";

export function registerAuthExtension(router: Router, core: Core) {
  router.register("POST", "/auth/login", async (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const userId = data.userId || "";
        const user = core.users.get(userId);

        if (!user) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "user_not_found" }));
          return;
        }

        const token = core.access.createSession(userId);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ token }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_request" }));
      }
    });
  });

  router.register("POST", "/auth/logout", async (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const token = data.token || "";

        core.access.endSession(token);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "logged_out" }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_request" }));
      }
    });
  });
}

