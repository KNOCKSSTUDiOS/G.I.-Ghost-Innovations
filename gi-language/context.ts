import { listScenes } from "../gi-project/store-scenes";
import { getScript } from "../gi-project/store-scripts";

export function gatherLanguageContext(project_id: string) {
  const scenes = listScenes(project_id);
  const scripts = scenes.map(s => ({
    scene_id: s.id,
    text: getScript(s.id).text
  }));

  return { scenes, scripts };
}

