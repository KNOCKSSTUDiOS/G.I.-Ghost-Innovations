import { GI } from "./index";

export type GIAdminRank =
  | "owner"
  | "admin"
  | "developer"
  | "moderator"
  | "viewer";

export interface GIAdminTokenPayload {
  uid: string;
  rank: GIAdminRank;
}

export class GI_AdminAuth {
  private engine = GI();

  // --------------------------------------
  // CREATE ADMIN TOKEN
  // --------------------------------------
  createToken(uid: string, rank: GIAdminRank): string {
    const payload: GIAdminTokenPayload = { uid, rank };
    return this.engine.auth.sign(payload);
  }

  // --------------------------------------
  // VERIFY ADMIN TOKEN
  // --------------------------------------
  verifyToken(token: string): GIAdminTokenPayload | null {
    try {
      const decoded = this.engine.auth.verify(token);
      if (!decoded || !decoded.rank) return null;
      return decoded as GIAdminTokenPayload;
    } catch {
      return null;
    }
  }

  // --------------------------------------
  // CHECK RANK
  // --------------------------------------
  hasRank(
    userRank: GIAdminRank,
    requiredRank: GIAdminRank
  ): boolean {
    const order: GIAdminRank[] = [
      "viewer",
      "moderator",
      "developer",
      "admin",
      "owner"
    ];

    return order.indexOf(userRank) >= order.indexOf(requiredRank);
  }

  // --------------------------------------
  // ROUTE PROTECTION
  // --------------------------------------
  protect(requiredRank: GIAdminRank) {
    return (req: any, res: any, next: () => void) => {
      const authHeader = req.headers["authorization"];
      if (!authHeader) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing authorization header" }));
        return;
      }

      const token = authHeader.replace("Bearer ", "").trim();
      const payload = this.verifyToken(token);

      if (!payload) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid admin token" }));
        return;
      }

      if (!this.hasRank(payload.rank, requiredRank)) {
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Insufficient rank" }));
        return;
      }

      (req as any).admin = payload;
      next();
    };
  }
}

export function createGIAdminAuth() {
  return new GI_AdminAuth();
}

