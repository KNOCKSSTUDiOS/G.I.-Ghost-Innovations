import { GI } from "../gi-engine";
import type { GI_Router } from "./gi-router";
import { createGIAdminAuth, GIAdminRank } from "../gi-engine/admin-auth";

export function registerGIAdminRoutes(router: GI_Router) {
  const engine = GI();
  const admin = createGIAdminAuth();

  // --------------------------------------
  // GENERATE ADMIN TOKEN
  // --------------------------------------
  router.register("POST", "/gi/admin/token", async (req, res) => {
    try {
      let body = "";
      req.on("data", chunk => (body += chunk));
      await new Promise(resolve => req.on("end", resolve));

      const data = body ? JSON.parse(body) : {};
      const uid = data.uid || "system";
      const rank: GIAdminRank = data.rank || "owner";

      const token = admin.createToken(uid, rank);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          uid,
          rank,
          token
        })
      );
    } catch (err: any) {
      engine.error.create(
        "admin_token_error",
        err?.message || "Failed to generate admin token",
        "high",
        { cause: err }
      );

      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
}

