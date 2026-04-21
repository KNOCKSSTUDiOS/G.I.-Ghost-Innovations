import { Core } from "./gi-core/core";
import { Router } from "./gi-router/router";

export function registerAdminExtension(router: Router, core: Core) {
  router.register("GET", "/admin/info", async (req, res) => {
    const data = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: Date.now()
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  });

  router.register("POST", "/admin/reload-config", async (req, res) => {
    try {
      core.config.reload();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "reloaded" }));
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "reload_failed" }));
    }
  });

  router.register("GET", "/admin/logs", async (req, res) => {
    const logs = core.logger.getRecent();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(logs));
  });
}
