import express from "express";
import { aiGenerateScene, aiGenerateScript, aiGenerateTimeline } from "./gi-ai/assist";

export function attachAi(app: express.Express) {
  app.post("/ai/scene", async (req, res) => {
    const { user_id, project_id, prompt } = req.body;
    res.json(await aiGenerateScene(user_id, project_id, prompt));
  });

  app.post("/ai/script", async (req, res) => {
    const { user_id, project_id, scene_id, prompt } = req.body;
    res.json(await aiGenerateScript(user_id, project_id, scene_id, prompt));
  });

  app.post("/ai/timeline", async (req, res) => {
    const { user_id, project_id, prompt } = req.body;
    res.json(await aiGenerateTimeline(user_id, project_id, prompt));
  });
}
