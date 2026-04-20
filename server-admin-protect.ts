import { validateAdminAccess } from "./gi-access/admin-auth";

export function protectAdminRoute(req, res, next) {
  const userId = req.headers["x-gi-user"];

  if (!userId) {
    return res.status(401).json({ error: "Missing admin identity" });
  }

  const check = validateAdminAccess(userId);

  if (!check.allowed) {
    return res.status(403).json({ error: check.reason });
  }

  req.gi_identity = check.identity;
  next();
}

