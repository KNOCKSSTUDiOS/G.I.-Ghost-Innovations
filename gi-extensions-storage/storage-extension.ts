import { Core } from "../gi-core/core";
import { Router } from "../gi-router/router";

export function registerStorageExtension(router: Router, core: Core) {
  router.register("POST", "/storage/set", async (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const key = data.key || "";
        const value = data.value;

        if (!key) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "invalid_request" }));
          return;
        }

        core.storage.set(key, value);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "stored" }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_request" }));
      }
    });
  });

  router.register("POST", "/storage/get", async (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const key = data.key || "";

        const value = core.storage.get(key);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ value }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_request" }));
      }
    });
  });

  router.register("GET", "/storage/all", async (req, res) => {
    const all = core.storage.all();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(all));
  });

  router.register("POST", "/storage/delete", async (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        const key = data.key || "";

        core.storage.delete(key);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "deleted" }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "invalid_request" }));
      }
    });
  });
}

