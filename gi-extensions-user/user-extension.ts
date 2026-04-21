import { Core } from "../gi-core/core";
import { Router } from "../gi-router/router";

export function registerUserExtension(router: Router, core: Core) {
  router.register("POST", "/user/create", async (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const id = data.id || "";
        const name = data.name || "";

        if (!id || !name) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "invalid_request" }));
          return;
        }

        const user = core.users.create(id, name);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(user));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_request" }));
      }
    });
  });

  router.register("GET", "/user/all", async (req, res) => {
    const list = core.users.all();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(list));
  });

  router.register("POST", "/user/assign-role", async (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const id = data.id || "";
        const role = data.role || "";

        core.users.assignRole(id, role);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "role_assigned" }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_request" }));
      }
    });
  });

  router.register("POST", "/user/assign-permission", async (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const id = data.id || "";
        const permission = data.permission || "";

        core.users.assignPermission(id, permission);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "permission_assigned" }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_request" }));
      }
    });
  });
}

