import express from "express";
import { createProject, listProjects } from "./gi-project/store-projects";
import { createScene, listScenes } from "./gi-project/store-scenes";
import { addTimelineEvent, listTimeline } from "./gi-project/store-timeline";
import { saveScript, getScript } from "./gi-project/store-scripts";

export function attachProjects(app: express.Express) {
  // Create project
  app.post("/projects/create", (req, res) => {
    const { user_id, name, description } = req.body;
    res.json(createProject(user_id, name, description));
  });

  // List projects
  app.get("/projects/list", (req, res) => {
    const { user_id } = req.query;
    res.json(listProjects(user_id as string));
  });

  // Scenes
  app.post("/projects/:id/scene", (req, res) => {
    const { name, summary } = req.body;
    res.json(createScene(req.params.id, name, summary));
  });

  app.get("/projects/:id/scenes", (req, res) => {
    res.json(listScenes(req.params.id));
  });

  // Timeline
  app.post("/projects/:id/timeline", (req, res) => {
    const { time, event } = req.body;
    res.json(addTimelineEvent(req.params.id, time, event));
  });

  app.get("/projects/:id/timeline", (req, res) => {
    res.json(listTimeline(req.params.id));
  });

  // Script
  app.post("/projects/:pid/script/:sid", (req, res) => {
    const { text } = req.body;
    res.json(saveScript(req.params.pid, req.params.sid, text));
  });

  app.get("/projects/:pid/script/:sid", (req, res) => {
    res.json(getScript(req.params.sid));
  });
}

