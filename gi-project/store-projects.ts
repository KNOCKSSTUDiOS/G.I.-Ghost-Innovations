import { GiProject } from "./schema";

const projects: GiProject[] = [];

export function createProject(user_id: string, name: string, description?: string) {
  const p: GiProject = {
    id: "proj-" + Math.random().toString(36).substring(2, 10),
    user_id,
    name,
    description,
    created: Date.now()
  };
  projects.push(p);
  return p;
}

export function listProjects(user_id: string) {
  return projects.filter(p => p.user_id === user_id);
}

export function getProject(id: string) {
  return projects.find(p => p.id === id);
}

