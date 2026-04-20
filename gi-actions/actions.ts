// G.I. VOICES — Tone & Style Engine
// Applies voice personality to the base reply.

import { GiVoice } from "../types";

export function applyGiVoiceStyle(
  voice: GiVoice | undefined,
  baseReply: string
): string {
  switch (voice) {
    case "GI_NOVA":
      return `✨ ${baseReply} Let’s elevate this with clarity and precision.`;

    case "GI_ECHO":
      return `${baseReply}\n\n(acknowledged — repeating core intent for stability)`;

    case "GI_FLUX":
      return `⚡ ${baseReply} Rapid mode engaged. Moving fast.`;

    case "GI_REBEL":
      return `🔥 ${baseReply} No fluff. No hesitation. Straight impact.`;

    case "GI_ALPHA":
    default:
      return `🜁 ${baseReply}`;
  }
}
