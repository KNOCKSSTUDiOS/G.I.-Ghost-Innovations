import express from "express";
import { giRemember, giRecall } from "./gi-memory/memory";

export function attachMemory(app: express.Express) {
  // Write memory
  app.post("/memory/write", (req, res) => {
    const { user_id, content, type, tags, project } = req.body;
    const item = giRemember(user_id, content, type, tags, project);
    res.json(item);
  });

  // Recall memory
  app.post("/memory/recall", (req, res) => {
    const { user_id, query, project } = req.body;
    const results = giRecall(user_id, query, project);
    res.json(results);
  });
}

