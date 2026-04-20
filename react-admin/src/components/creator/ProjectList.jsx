import React, { useEffect, useState } from "react";

export default function ProjectList({ onSelect }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/projects/list")
      .then(r => r.json())
      .then(setProjects);
  }, []);

  return (
    <div className="project-list">
      <h2>Select Project</h2>
      {projects.map(p => (
        <button key={p.id} onClick={() => onSelect(p)}>
          {p.name}
        </button>
      ))}
    </div>
  );
}

