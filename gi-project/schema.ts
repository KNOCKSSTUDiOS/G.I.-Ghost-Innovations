export interface GiProject {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created: number;
}

export interface GiScene {
  id: string;
  project_id: string;
  name: string;
  summary?: string;
  created: number;
}

export interface GiTimelineEvent {
  id: string;
  project_id: string;
  time: string;
  event: string;
  created: number;
}

export interface GiScript {
  id: string;
  project_id: string;
  scene_id: string;
  text: string;
  updated: number;
}

