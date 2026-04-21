import http from "http";
import { createCore } from "./gi-core/core";
import { createRouter } from "./gi-router/router";

import { registerAdminExtension } from "./gi-extensions-admin/admin-extension";
import { registerAuthExtension } from "./gi-extensions-auth/auth-extension";
import { registerUserExtension } from "./gi-extensions-user/user-extension";
import { registerSystemExtension } from "./gi-extensions-system/system-extension";
import { registerCreatorExtension } from "./gi-extensions-creator/creator-extension";

const core = createCore();
const router = createRouter(core);

registerAdminExtension(router, core);
registerAuthExtension(router, core);
registerUserExtension(router, core);
registerSystemExtension(router, core);
registerCreatorExtension(router, core);

router.register("GET", "/", async (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Server running");
});

router.register("GET", "/health", async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok" }));
});

const server = http.createServer(async (req, res) => {
  try {
    await router.handle(req, res);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "internal_error" }));
  }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
