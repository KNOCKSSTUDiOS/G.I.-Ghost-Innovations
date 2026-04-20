import React, { useEffect, useState } from "react";

export default function SceneList({ project, onSelect }) {
  const [scenes, setScenes] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${project.id}/scenes`)
      .then(r => r.json())
      .then(setScenes);
  }, [project]);

  return (
    <div className="scene-list">
      <h3>Scenes</h3>
      {scenes.map(s => (
        <button key={s.id} onClick={() => onSelect(s)}>
          {s.name}
        </button>
      ))}
    </div>
  );
}

