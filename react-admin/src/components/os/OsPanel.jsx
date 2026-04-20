import React, { useEffect, useState } from "react";

export default function OsPanel() {
  const [apps, setApps] = useState([]);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/os/apps").then(r => r.json()).then(setApps);
    fetch("http://localhost:3000/os/updates").then(r => r.json()).then(setUpdates);
  }, []);

  return (
    <div className="os-panel">
      <h2>G.I. OS</h2>

      <h3>System Apps</h3>
      <pre>{JSON.stringify(apps, null, 2)}</pre>

      <h3>Updates</h3>
      <pre>{JSON.stringify(updates, null, 2)}</pre>
    </div>
  );
}

