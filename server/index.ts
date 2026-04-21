import http from "http";
import { bootstrapGI } from "./bootstrap/gi-bootstrap";
import { createGIRouter } from "./router/gi-router";

import { registerGIUserAuthRoutes } from "./router/gi-user-auth-routes";
import { registerGIAdminRoutes } from "./router/gi-admin-routes";
import { registerGISystemRoutes } from "./router/gi-system-routes";
import { registerGIPermissionsRoutes } from "./router/gi-permissions-routes";
import { registerGIRolesRoutes } from "./router/gi-roles-routes";

const engine = bootstrapGI();
const router = createGIRouter();

// --------------------------------------
// REGISTER ROLES ROUTES
// --------------------------------------
registerGIRolesRoutes(router);

// --------------------------------------
// REGISTER PERMISSIONS ROUTES
// --------------------------------------
registerGIPermissionsRoutes(router);

// --------------------------------------
// REGISTER USER AUTH ROUTES
// --------------------------------------
registerGIUserAuthRoutes(router);

// --------------------------------------
// REGISTER ADMIN ROUTES
// --------------------------------------
registerGIAdminRoutes(router);

// --------------------------------------
// REGISTER SYSTEM ROUTES
// --------------------------------------
registerGISystemRoutes(router);

// --------------------------------------
// REGISTER CUSTOM ROUTES
// --------------------------------------
router.register("GET", "/health", async (req, res, engine) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", engine: "GI" }));
});

router.register("GET", "/", async (req, res, engine) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(
    "GI Engine Server Running with Router + System Routes + Admin Routes + User Auth Routes + Permissions Routes + Roles Routes"
  );
});

// --------------------------------------
// CREATE SERVER
// --------------------------------------
function createServer() {
  const server = http.createServer(async (req, res) => {
    try {
      await router.handle(req, res);
    } catch (err: any) {
      engine.error.create("server_error", err?.message || "Unknown server error", "critical", {
        cause: err
      });

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });

  return server;
}

const server = createServer();
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`GI Engine server running on port ${PORT}`);
});
