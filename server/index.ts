import http from "http";
import { bootstrapGI } from "./bootstrap/gi-bootstrap";
import { createGIRouter } from "./router/gi-router";

const engine = bootstrapGI();
const router = createGIRouter();

// --------------------------------------
// REGISTER ROUTES
// --------------------------------------
router.register("GET", "/health", async (req, res, engine) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "ok", engine: "GI" }));
});

router.register("GET", "/", async (req, res, engine) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("GI Engine Server Running with Router");
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
