// G.I. ACTIONS — Safe Action Engine
// Generates safe, allowed actions based on message, mode, and tier.

import { GiIdentity, GiContext, GiAction } from "../types";

export function buildGiActions(
  identity: GiIdentity,
  context: GiContext | undefined,
  message: string
): GiAction[] {
  const actions: GiAction[] = [];
  const lower = message.toLowerCase();

  // ---------- PHONE CLEANUP EXAMPLE ----------
  if (lower.includes("clean") && lower.includes("phone")) {
    actions.push({
      type: "SHOW_STEPS",
      id: "optimize_phone",
      label: "Optimize phone storage safely",
      steps: [
        "Open Settings",
        "Tap Storage",
        "Review large apps",
        "Clear cache safely (do not delete important data)",
      ],
    });
  }

  // ---------- CREATOR MODE: BLUEPRINT ENGINE ----------
  if (identity.tier === "CREATOR" && context?.mode === "creator") {
    actions.push({
      type: "RUN_ENGINE_MODULE",
      module: "video_blueprint",
      params: {
        length: "30min",
        platform: "YouTube",
      },
    });
  }

  // ---------- OPEN APP EXAMPLE ----------
  if (lower.includes("open camera")) {
    actions.push({
      type: "OPEN_APP",
      target: "camera",
      label: "Open Camera App",
    });
  }

  // ---------- GENERATE ASSET LINK ----------
  if (lower.includes("export") || lower.includes("asset")) {
    actions.push({
      type: "GENERATE_ASSET_LINK",
      id: "asset_export",
      label: "Generate Export Link",
      params: {
        format: "json",
        expires: "10min",
      },
    });
  }

  return actions;
}
