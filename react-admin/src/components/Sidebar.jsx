import React from "react";

export default function Sidebar({ setView }) {
  return (
    <div className="sidebar">
      <button onClick={() => setView("creator")}>Creator</button>
      <button onClick={() => setView("metrics")}>Metrics</button>
      <button onClick={() => setView("voices")}>Voices</button>
      <button onClick={() => setView("language")}>Language</button>
      <button onClick={() => setView("os")}>OS</button>
    </div>
  );
}
