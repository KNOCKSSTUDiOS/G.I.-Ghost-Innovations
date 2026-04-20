// G.I. SENSORY — Memory Layer (Stub Version)
// This module stores and retrieves lightweight context.
// Later you can replace this with Redis, Firestore, SQL, or your own engine.

import { GiIdentity, GiClient, GiContext } from "../types";

// In-memory store (temporary)
const sensoryStore: Record<string, any> = {};

export function readGiSensoryContext(
  identity: GiIdentity,
  client: GiClient,
  context?: GiContext
) {
  const key = `${identity.user_id}_${client.device_id}`;

  // Return stored context or defaults
  return (
    sensoryStore[key] ?? {
      user: { style: "direct" },
      device: { type: client.platform ?? "unknown", capabilities: [] },
      project: { name: context?.project ?? null },
    }
  );
}

export function writeGiSensoryContext(
  identity: GiIdentity,
  client: GiClient,
  updates: any
) {
  const key = `${identity.user_id}_${client.device_id}`;

  // Merge updates into existing memory
  sensoryStore[key] = {
    ...(sensoryStore[key] ?? {}),
    ...updates,
  };
}

