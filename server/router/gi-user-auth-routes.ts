import { GI } from "../gi-engine";
import type { GI_Router } from "./gi-router";

export function registerGIUserAuthRoutes(router: GI_Router) {
  const engine = GI();

  // Utility: read JSON body
  async function readJSON(req) {
    return new Promise(resolve => {
      let body = "";
      req.on("data", chunk => (body += chunk));
      req.on("end", () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });
  }

  // --------------------------------------
  // SIGNUP
  // --------------------------------------
  router.register("POST", "/auth/signup", async (req, res) => {
    const data = await readJSON(req);
    const { email, password, profile = {} } = data;

    if (!email || !password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing email or password" }));
      return;
    }

    const existing = engine.user.findByEmail(email);
    if (existing) {
      res.writeHead(409, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Email already registered" }));
      return;
    }

    const user = await engine.user.create(email, password, profile);
    const token = engine.auth.sign({ uid: user.id });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ user, token }));
  });

  // --------------------------------------
  // LOGIN
  // --------------------------------------
  router.register("POST", "/auth/login", async (req, res) => {
    const data = await readJSON(req);
    const { email, password } = data;

    if (!email || !password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing email or password" }));
      return;
    }

    const user = engine.user.findByEmail(email);
    if (!user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid credentials" }));
      return;
    }

    const valid = await engine.user.verifyPassword(user, password);
    if (!valid) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid credentials" }));
      return;
    }

    const token = engine.auth.sign({ uid: user.id });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ user, token }));
  });

  // --------------------------------------
  // PASSWORD VERIFY
  // --------------------------------------
  router.register("POST", "/auth/verify", async (req, res) => {
    const data = await readJSON(req);
    const { token } = data;

    if (!token) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing token" }));
      return;
    }

    try {
      const decoded = engine.auth.verify(token);
      const user = engine.user.findById(decoded.uid);

      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ valid: true, user }));
    } catch {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ valid: false }));
    }
  });

  // --------------------------------------
  // PROFILE FETCH
  // --------------------------------------
  router.register("GET", "/auth/profile", async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing authorization header" }));
      return;
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
      const decoded = engine.auth.verify(token);
      const user = engine.user.findById(decoded.uid);

      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ user }));
    } catch {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid token" }));
    }
  });

  // --------------------------------------
  // PROFILE UPDATE
  // --------------------------------------
  router.register("POST", "/auth/profile", async (req, res) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing authorization header" }));
      return;
    }

    const token = authHeader.replace("Bearer ", "").trim();

    try {
      const decoded = engine.auth.verify(token);
      const user = engine.user.findById(decoded.uid);

      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
        return;
      }

      const data = await readJSON(req);
      const updated = engine.user.updateProfile(user.id, data);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ user: updated }));
    } catch {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid token" }));
    }
  });
}

