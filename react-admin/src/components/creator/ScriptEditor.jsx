<button
  onClick={() => {
    fetch("http://localhost:3000/language/op", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: project.user_id,
        type: "rewrite",
        input: text
      })
    })
      .then(r => r.json())
      .then(out => setText(out.output));
  }}
>
  ✎ Rewrite with AI
</button>
