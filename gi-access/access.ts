// G.I. ACCESS — Roles, Tiers, Permissions
// This module determines what a user is allowed to do.

import { GiIdentity, GiUser } from "../types";

export function resolveGiIdentity(user: GiUser): GiIdentity {
  // ---------- FOUNDER OVERRIDE ----------
  if (user.user_id === "KNOCKS") {
    return {
      user_id: "KNOCKS",
      role: "FOUNDER",
      tier: "CREATOR",
      status: "ACTIVE",
      expires: "NEVER",
      permissions: ["ALL"],
    };
  }

  // ---------- DEFAULT USER ----------
  return {
    user_id: user.user_id,
    role: "ASSIST",
    tier: "ASSIST",
    status: "ACTIVE",
    expires: "NEVER",
    permissions: [],
  };
}

// ---------- PERMISSION CHECK ----------
export function hasPermission(identity: GiIdentity, permission: string): boolean {
  if (identity.permissions.includes("ALL")) return true;
  return identity.permissions.includes(permission);
}

// ---------- TIER CHECK ----------
export function requireTier(identity: GiIdentity, tier: "ASSIST" | "CONTROL" | "CREATOR") {
  const order = ["ASSIST", "CONTROL", "CREATOR"];
  return order.indexOf(identity.tier) >= order.indexOf(tier);
}

