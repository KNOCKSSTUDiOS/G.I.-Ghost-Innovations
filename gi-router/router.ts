// G.I. ROUTER — Model Selection Engine
// Chooses the correct model based on tier, mode, and permissions.

import { GiIdentity, GiContext } from "../types";

export function routeGiModel(
  identity: GiIdentity,
  context: GiContext | undefined
) {
  const mode = context?.mode ?? "assist";

  // ---------- CREATOR MODE ----------
  if (identity.tier === "CREATOR" && mode === "creator") {
    return {
      model: "gi-smart-creator-1",
      provider: "internal",
    };
  }

  // ---------- CONTROL MODE ----------
  if (identity.tier === "CONTROL" || mode === "control") {
    return {
      model: "gi-control-fast-1",
      provider: "internal",
    };
  }

  // ---------- DEFAULT ASSIST MODE ----------
  return {
    model: "gi-assist-fast-1",
    provider: "internal",
  };
}

