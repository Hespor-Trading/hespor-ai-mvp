// app/page.tsx
"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setReply(null);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setReply(data.reply);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "60px auto", padding: 20 }}>
      <h1>Hespor AI MVP</h1>
      <p>Type a prompt and press Run.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <label>Prompt</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Type something…"
          style={{ width: "100%", marginTop: 8 }}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          style={{ marginTop: 12, padding: "8px 16px" }}
        >
          {loading ? "Thinking…" : "Run"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 16, color: "crimson" }}>
          <b>Error:</b> {error}
        </div>
      )}

      {reply && (
        <div style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
          <b>Reply:</b> {reply}
        </div>
      )}
    </main>
  );
}
