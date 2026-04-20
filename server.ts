import http import { attachRealtime } const server.listen(3000, ()   import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import http from "http";
import { attachRealtime } from "./server-realtime-attach";

const app = express();
const server = http.createServer(app);

attachRealtime(server);

server.listen(3000, () => {
  console.log("G.I. Platform running with realtime logs");
});

// ---------- Types ----------

type GiRole = "FOUNDER" | "ADMIN" | "CREATOR" | "CONTROL" | "ASSIST";
type GiTier = "ASSIST" | "CONTROL" | "CREATOR" | "OEM";
type GiVoice = "GI_ALPHA" | "GI_NOVA" | "GI_ECHO" | "GI_FLUX" | "GI_REBEL";

interface GiClient {
  engine_id: string;
  device_id: string;
  platform?: string;
}

interface GiUser {
  user_id: string;
  role?: GiRole;
  subscription_token?: string;
}

interface GiContext {
  mode?: "assist" | "control" | "creator";
  project?: string;
  voice?: GiVoice;
}

interface GiRequestBody {
  gi_version: string;
  gi_client: GiClient;
  gi_user: GiUser;
  gi_context?: GiContext;
  gi_message: string;
}

interface GiIdentity {
  user_id: string;
  role: GiRole;
  tier: GiTier;
  status: "ACTIVE" | "INACTIVE";
  expires: string | "NEVER";
  permissions: string[];
}

interface GiLanguageInfo {
  language: string;
  confidence: number;
}

interface GiGuardianResult {
  allowed: boolean;
  reason?: string;
  policy?: string;
}

interface GiModelRoute {
  model: string;
  provider: string;
}

type GiActionType =
  | "OPEN_APP"
  | "SHOW_STEPS"
  | "RUN_ENGINE_MODULE"
  | "CREATE_BLUEPRINT"
  | "GENERATE_ASSET_LINK";

interface GiAction {
  type: GiActionType;
  id?: string;
  label?: string;
  steps?: string[];
  module?: string;
  params?: Record<string, unknown>;
  target?: string;
}

interface GiMeta {
  tier: GiTier;
  role: GiRole;
  tokens_used?: number;
  mode?: GiContext["mode"];
  language?: string;
}

interface GiResponseBody {
  gi_reply: string;
  gi_actions: GiAction[];
  gi_meta: GiMeta;
}

// ---------- G.I. Access ----------

function resolveGiIdentity(user: GiUser): GiIdentity {
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

  return {
    user_id: user.user_id,
    role: "ASSIST",
    tier: "ASSIST",
    status: "ACTIVE",
    expires: "NEVER",
    permissions: [],
  };
}

// ---------- Language Layer ----------

function detectLanguage(message: string): GiLanguageInfo {
  return { language: "en", confidence: 0.99 };
}

// ---------- Guardian ----------

function runGiGuardian(
  message: string,
  lang: GiLanguageInfo
): GiGuardianResult {
  const lower = message.toLowerCase();

  if (lower.includes("hack") || lower.includes("illegal")) {
    return {
      allowed: false,
      reason: "illegal_or_unsafe",
      policy: "no_illegal_or_harmful_content",
    };
  }

  if (lower.includes("full lyrics") || lower.includes("full book")) {
    return {
      allowed: false,
      reason: "copyright",
      policy: "no_full_protected_content",
    };
  }

  return { allowed: true };
}

// ---------- Model Router ----------

function routeGiModel(
  identity: GiIdentity,
  context: GiContext | undefined
): GiModelRoute {
  const mode = context?.mode ?? "assist";

  if (identity.tier === "CREATOR" && mode === "creator") {
    return { model: "gi-smart-creator-1", provider: "internal" };
  }

  if (identity.tier === "CONTROL" || mode === "control") {
    return { model: "gi-control-fast-1", provider: "internal" };
  }

  return { model: "gi-assist-fast-1", provider: "internal" };
}

// ---------- Sensory (stubs) ----------

function readGiSensoryContext(
  user: GiIdentity,
  client: GiClient,
  context?: GiContext
) {
  return {
    user: { style: "direct" },
    device: { type: client.platform ?? "unknown", capabilities: [] },
    project: { name: context?.project ?? null },
  };
}

function writeGiSensoryContext(
  user: GiIdentity,
  client: GiClient,
  updates: unknown
) {
  void user;
  void client;
  void updates;
}

// ---------- Voices ----------

function applyGiVoiceStyle(
  voice: GiVoice | undefined,
  baseReply: string
): string {
  switch (voice) {
    case "GI_NOVA":
      return baseReply;
    case "GI_ECHO":
      return baseReply;
    case "GI_FLUX":
      return baseReply;
    case "GI_REBEL":
      return baseReply;
    case "GI_ALPHA":
    default:
      return baseReply;
  }
}

// ---------- Actions ----------

function buildGiActions(
  identity: GiIdentity,
  context: GiContext | undefined,
  message: string
): GiAction[] {
  const actions: GiAction[] = [];
  const lower = message.toLowerCase();

  if (lower.includes("clean") && lower.includes("phone")) {
    actions.push({
      type: "SHOW_STEPS",
      id: "optimize_phone",
      label: "Optimize phone storage safely",
      steps: [
        "Open Settings",
        "Tap Storage",
        "Review large apps",
        "Clear cache safely",
      ],
    });
  }

  if (identity.tier === "CREATOR" && context?.mode === "creator") {
    actions.push({
      type: "RUN_ENGINE_MODULE",
      module: "video_blueprint",
      params: { length: "30min", platform: "YouTube" },
    });
  }

  return actions;
}

// ---------- Shield ----------

const requestCounts = new Map<string, { count: number; ts: number }>();

function checkGiShield(userId: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  const windowMs = 60_000;
  const maxPerWindow = 60;

  const entry = requestCounts.get(userId) ?? { count: 0, ts: now };
  if (now - entry.ts > windowMs) {
    entry.count = 0;
    entry.ts = now;
  }

  entry.count += 1;
  requestCounts.set(userId, entry);

  if (entry.count > maxPerWindow) {
    return {
      allowed: false,
      message: "Too many requests. Please slow down.",
    };
  }

  return { allowed: true };
}

// ---------- Logs ----------

function logGiEvent(type: string, data: unknown) {
  console.log(`[G.I. LOG] ${type}:`, JSON.stringify(data));
}

// ---------- Core Orchestrator ----------

async function giOrchestrate(body: GiRequestBody): Promise<GiResponseBody> {
  const identity = resolveGiIdentity(body.gi_user);
  const shield = checkGiShield(identity.user_id);

  if (!shield.allowed) {
    logGiEvent("shield_block", { user: identity.user_id });
    return {
      gi_reply: shield.message ?? "Rate limit exceeded.",
      gi_actions: [],
      gi_meta: {
        tier: identity.tier,
        role: identity.role,
        mode: body.gi_context?.mode,
      },
    };
  }

  const langInfo = detectLanguage(body.gi_message);
  const guardian = runGiGuardian(body.gi_message, langInfo);

  if (!guardian.allowed) {
    logGiEvent("guardian_block", {
      user: identity.user_id,
      reason: guardian.reason,
      policy: guardian.policy,
    });

    const safeReply =
      guardian.reason === "copyright"
        ? "I can’t provide full copyrighted content, but I can summarize or discuss it."
        : "I can’t assist with that, but I can help with safe alternatives.";

    return {
      gi_reply: safeReply,
      gi_actions: [],
      gi_meta: {
        tier: identity.tier,
        role: identity.role,
        mode: body.gi_context?.mode,
        language: langInfo.language,
      },
    };
  }

  const sensory = readGiSensoryContext(
    identity,
    body.gi_client,
    body.gi_context
  );
  logGiEvent("sensory_context", { user: identity.user_id, sensory });

  const route = routeGiModel(identity, body.gi_context);
  logGiEvent("model_route", {
    user: identity.user_id,
    model: route.model,
    provider: route.provider,
  });

  const baseReply = `G.I. here. I received your message and I’m operating in ${
    body.gi_context?.mode ?? "assist"
  } mode.`;

  const styledReply = applyGiVoiceStyle(body.gi_context?.voice, baseReply);
  const actions = buildGiActions(identity, body.gi_context, body.gi_message);

  const response: GiResponseBody = {
    gi_reply: styledReply,
    gi_actions: actions,
    gi_meta: {
      tier: identity.tier,
      role: identity.role,
      mode: body.gi_context?.mode,
      language: langInfo.language,
      tokens_used: 0,
    },
  };

  writeGiSensoryContext(identity, body.gi_client, {
    last_message: body.gi_message,
  });
  logGiEvent("response", {
    user: identity.user_id,
    meta: response.gi_meta,
    actions: response.gi_actions,
  });

  return response;
}

// ---------- Express Server ----------

const app = express();
app.use(bodyParser.json());

app.post("/v1/gi/chat", async (req: Request, res: Response) => {
  try {
    const body = req.body as GiRequestBody;
    const result = await giOrchestrate(body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      gi_reply: "G.I. encountered an internal error.",
      gi_actions: [],
      gi_meta: {
        tier: "ASSIST",
        role: "ASSIST",
      },
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`G.I. server running on port ${PORT}`);
});

