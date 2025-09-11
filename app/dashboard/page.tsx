"use client";

import { useEffect, useState } from "react";
import "./style.css";

type Range = "7d" | "30d" | "90d" | "ytd" | "360d";

export default function Dashboard() {
  const [subActive, setSubActive] = useState(false);
  const [feed, setFeed] = useState<string[]>([]);
  const [range, setRange] = useState<Range>("7d");

  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const [used, setUsed] = useState(0);

  useEffect(() => {
    // If Stripe redirected with ?paid=1, mark subscription on this browser (MVP)
    const url = new URL(window.location.href);
    if (url.searchParams.get("paid") === "1") {
      localStorage.setItem("hespor_sub", "1");
    }
    setSubActive(localStorage.getItem("hespor_sub") === "1");

    // Load recent actions (optional S3)
    (async () => {
      try {
        const r = await fetch("/api/feed/last", { cache: "no-store" });
        const j = await r.json();
        setFeed(j.items || []);
      } catch {
        setFeed(["(No actions yet)"]);
      }
    })();

    // Free messages used (MVP)
    const key = "hespor_free_chat_used";
    setUsed(Number(localStorage.getItem(key) || "0"));
  }, []);

  async function send() {
    if (!subActive && used >= 10) {
      setReply(
        "Free plan limit reached (10 messages/week). Activate Hespor Algorithm for unlimited chat."
      );
      return;
    }
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const j = await r.json();
    setReply(j.reply || j.error || "");
    if (!subActive) {
      const key = "hespor_free_chat_used";
      const n = Number(localStorage.getItem(key) || "0") + 1;
      localStorage.setItem(key, String(n));
      setUsed(n);
    }
    setMsg("");
  }

  return (
    <div className="hz-shell">
      <header className="hz-topbar">
        <div className="hz-logo">
          <span className="dot" /> HESPOR
        </div>
        <nav className="hz-nav">
          <a href="/" className="hz-link">Home</a>
          <a href="/dashboard" className="hz-link active">Dashboard</a>
        </nav>
      </header>

      <main className="hz-grid">
        {/* LEFT */}
        <section className="hz-left">
          {!subActive ? (
            <EnableAlgoCard />
          ) : (
            <SalesBlock range={range} setRange={setRange} />
          )}

          <div className="hz-card">
            <div className="hz-card-head">
              <h3>Latest Hespor actions</h3>
            </div>
            <ul className="hz-list">
              {feed.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT: Chat */}
        <aside className="hz-card hz-chat">
          <div className="hz-card-head">
            <h3>Hespor Chat</h3>
            {!subActive && (
              <span className="hz-pill">Free: {Math.max(0, 10 - used)}/10 this week</span>
            )}
          </div>

          <div className="hz-chat-body">
            {reply ? (
              <div className="hz-bubble bot">
                <div className="hz-bubble-title">Assistant</div>
                <div className="hz-bubble-text">{reply}</div>
              </div>
            ) : (
              <div className="hz-placeholder">
                Ask about inventory, best keywords, ACOS, more…
              </div>
            )}
          </div>

          <div className="hz-chat-input">
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Type your question…"
            />
            <button onClick={send} className="hz-btn">Send</button>
          </div>
        </aside>
      </main>
    </div>
  );
}

function EnableAlgoCard() {
  const [acos, setAcos] = useState("25");
  const [asin, setAsin] = useState("");

  async function enable() {
    if (!asin.trim()) {
      alert("Enter your primary ASIN");
      return;
    }
    const r = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ acos, asin }),
    });
    const { url } = await r.json();
    window.location.href = url;
  }

  return (
    <div className="hz-card">
      <div className="hz-card-head">
        <h3>Enable Hespor Algorithm</h3>
        <span className="hz-pill accent">$49/mo · 7-day free trial</span>
      </div>
      <p className="hz-muted">
        Answer 2 questions to activate the automation. Cancel any time.
      </p>

      <div className="hz-form">
        <label>
          <span>Break-even ACOS (%)</span>
          <input value={acos} onChange={(e) => setAcos(e.target.value)} />
        </label>
        <label>
          <span>Primary ASIN</span>
          <input
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            placeholder="e.g. B0XXXXXXX"
          />
        </label>
      </div>

      <div className="hz-actions">
        <button onClick={enable} className="hz-btn primary">
          Connect to Hespor AI Advertising
        </button>
      </div>
    </div>
  );
}

function SalesBlock({
  range,
  setRange,
}: {
  range: Range;
  setRange: (r: Range) => void;
}) {
  return (
    <div className="hz-card">
      <div className="hz-card-head">
        <h3>Sales</h3>
        <select
          className="hz-select"
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="ytd">Year to date</option>
          <option value="360d">Last 360 days</option>
        </select>
      </div>

      <div className="hz-chart-placeholder">
        <div className="bar" style={{ height: "40%" }} />
        <div className="bar" style={{ height: "65%" }} />
        <div className="bar" style={{ height: "55%" }} />
        <div className="bar" style={{ height: "70%" }} />
        <div className="bar" style={{ height: "50%" }} />
        <div className="bar" style={{ height: "80%" }} />
        <div className="bar" style={{ height: "60%" }} />
      </div>

      <p className="hz-muted">Real sales will show once Amazon approves your SP-API.</p>
    </div>
  );
}
