import http from "http";
import url from "url";
import { createGIRouterEngine, GIRouteContext, GIMethod } from "./gi-engine/router-engine";

const router = createGIRouterEngine();

// basic health route
router.get("/api/health", async () => {
  return { status: "ok", service: "gi-backend", ts: Date.now() };
});

function parseQuery(query: string | null): Record<string, string | string[]> {
  if (!query) return {};
  const params = new url.URLSearchParams(query);
  const out: Record<string, string | string[]> = {};
  for (const [key, value] of params.entries()) {
    if (out[key]) {
      const existing = out[key];
      out[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      out[key] = value;
    }
  }
  return out;
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url || "", true);
  const method = (req.method || "GET").toUpperCase() as GIMethod;
  const path = parsed.pathname || "/";
  const query = parseQuery(parsed.search || null);

  let body: any = undefined;
  if (method !== "GET" && method !== "OPTIONS") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    try {
      body = raw ? JSON.parse(raw) : undefined;
    } catch {
      body = raw;
    }
  }

  const ctx: GIRouteContext = {
    path,
    method,
    params: {},
    query,
    headers: (req.headers as Record<string, string>) || {},
    body,
    raw: req
  };

  res.setHeader("Content-Type", "application/json");

  try {
    const result = await router.dispatch(ctx);
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  } catch (err: any) {
    const status = err?.status || 500;
    res.statusCode = status;
    res.end(JSON.stringify({ error: err?.message || "Internal Server Error" }));
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

server.listen(PORT, () => {
  console.log(`G.I. backend listening on http://localhost:${PORT}`);
});

