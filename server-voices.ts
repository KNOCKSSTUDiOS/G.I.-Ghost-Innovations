import express from "express";
import { registerVoice, listVoices } from "./gi-voices/store";
import { synthesizeVoice } from "./gi-voices/synth";
import { assignVoice, getAssignedVoice } from "./gi-voices/assign";

export function attachVoices(app: express.Express) {
  // Register voice
  app.post("/voices/register", (req, res) => {
    const v = registerVoice({
      id: "voice-" + Math.random().toString(36).substring(2, 10),
      ...req.body
    });
    res.json(v);
  });

  // List voices
  app.get("/voices/list", (req, res) => {
    res.json(listVoices());
  });

  // Assign voice to scene
  app.post("/voices/assign", (req, res) => {
    const { scene_id, voice_id } = req.body;
    res.json(assignVoice(scene_id, voice_id));
  });

  // Get assigned voice
  app.get("/voices/assigned/:scene_id", (req, res) => {
    res.json({ voice_id: getAssignedVoice(req.params.scene_id) });
  });

  // Synthesize audio
  app.post("/voices/speak", async (req, res) => {
    const { user_id, voice_id, text } = req.body;
    res.json(await synthesizeVoice(user_id, voice_id, text));
  });
}

