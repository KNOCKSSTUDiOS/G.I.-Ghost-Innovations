import { GI } from "./index";
import { createGIAdminAuth } from "./admin-auth";

export class GI_AccessEngine {
  private engine = GI();
  private admin = createGIAdminAuth();

  constructor() {}

  // --------------------------------------
  // CHECK ACCESS (UNIFIED)
  // --------------------------------------
  async check(opts: {
    req?: any;
    userId?: string;
    requireRank?: string;        // admin rank requirement
    requirePermission?: string;  // permission name
  }) {
    const { req, userId, requireRank, requirePermission } = opts;

    // --------------------------------------
    // 1. ADMIN RANK CHECK (OVERRIDE)
    // --------------------------------------
    if (requireRank) {
      const token = this.extractAdminToken(req);
      if (!token) return { ok: false, reason: "missing_admin_token" };

      const payload = this.admin.verifyToken(token);
      if (!payload) return { ok: false, reason: "invalid_admin_token" };

      if (!this.admin.hasRank(payload.rank, requireRank)) {
        return { ok: false, reason: "insufficient_admin_rank" };
      }

      // Admin rank satisfied → auto-pass
      return { ok: true, admin: payload };
    }

    // --------------------------------------
    // 2. USER PERMISSION CHECK
    // --------------------------------------
    if (requirePermission) {
      if (!userId) return { ok: false, reason: "missing_user_id" };

      // Effective permissions = direct + roles
      const has = this.engine.roles.hasPermission(userId, requirePermission);

      if (!has) return { ok: false, reason: "missing_permission" };

      return { ok: true };
    }

    // --------------------------------------
    // 3. NO REQUIREMENTS → PASS
    // --------------------------------------
    return { ok: true };
  }

  // --------------------------------------
  // EXTRACT ADMIN TOKEN
  // --------------------------------------
  private extractAdminToken(req) {
    if (!req || !req.headers) return null;
    const auth = req.headers["authorization"];
    if (!auth) return null;
    return auth.replace("Bearer ", "").trim();
  }

  // --------------------------------------
  // ROUTE WRAPPER (MIDDLEWARE STYLE)
  // --------------------------------------
  protect(opts: {
    requireRank?: string;
    requirePermission?: string;
  }, handler: Function) {
    return async (req, res) => {
      const engine = this.engine;

      let userId = null;

      // Extract user token if present (for permission checks)
      const authHeader = req.headers["authorization"];
      if (authHeader && !opts.requireRank) {
        try {
          const token = authHeader.replace("Bearer ", "").trim();
          const decoded = engine.auth.verify(token);
          userId = decoded.uid;
        } catch {
          // ignore, userId stays null
        }
      }

      const result = await this.check({
        req,
        userId,
        requireRank: opts.requireRank,
        requirePermission: opts.requirePermission
      });

      if (!result.ok) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: result.reason }));
        return;
      }

      await handler(req, res, engine, result);
    };
  }
}

export function createGIAccessEngine() {
  return new GI_AccessEngine();
}

