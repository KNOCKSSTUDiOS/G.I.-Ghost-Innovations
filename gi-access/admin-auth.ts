// G.I. ADMIN AUTH — Rank-Based Authentication
// Validates admin access using role + tier + token.

import { GiIdentity } from "../types";

const VALID_TOKENS = new Map<string, GiIdentity>();

// Register identities (in real system: DB or secure store)
export function registerIdentity(identity: GiIdentity) {
  VALID_TOKENS.set(identity.user_id, identity);
}

// Validate access
export function validateAdminAccess(userId: string): {
  allowed: boolean;
  identity?: GiIdentity;
  reason?: string;
} {
  const identity = VALID_TOKENS.get(userId);

  if (!identity) {
    return { allowed: false, reason: "Unknown user" };
  }

  if (identity.status !== "ACTIVE") {
    return { allowed: false, reason: "Account inactive" };
  }

  if (identity.expires !== "NEVER") {
    const now = Date.now();
    const exp = new Date(identity.expires).getTime();
    if (now > exp) {
      return { allowed: false, reason: "Token expired" };
    }
  }

  // Only these roles can access admin panel
  const allowedRoles = ["FOUNDER", "ADMIN", "CONTROL"];
  if (!allowedRoles.includes(identity.role)) {
    return { allowed: false, reason: "Insufficient role" };
  }

  return { allowed: true, identity };
}
