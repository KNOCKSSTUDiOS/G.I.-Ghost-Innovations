import React, { useEffect, useState } from "react";

export default function ScriptEditor({ project, scene }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!scene) return;
    fetch(`http://localhost:3000/projects/${project.id}/script/${scene.id}`)
      .then(r => r.json())
      .then(d => setText(d.text));
  }, [project, scene]);

  if (!scene) return <div>Select a scene to edit its script</div>;

  return (
    <div className="script-editor">
      <h3>Script: {scene.name}</h3>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={20}
        style={{ width: "100%" }}
      />
    </div>
  );
}

