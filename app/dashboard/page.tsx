"use client";

import { useEffect, useState } from "react";

type ViewRange = "7d"|"30d"|"90d"|"ytd"|"360d";

export default function Dashboard() {
  const [subActive, setSubActive] = useState(false);
  const [feed, setFeed] = useState<string[]>([]);
  const [range, setRange] = useState<ViewRange>("7d");

  // simple chat
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");
  const [used, setUsed] = useState(0);

  useEffect(() => {
    // unlock UI if returning from Stripe with paid=1
    const url = new URL(window.location.href);
    if (url.searchParams.get("paid") === "1") {
      localStorage.setItem("hespor_sub", "1");
    }
    setSubActive(localStorage.getItem("hespor_sub") === "1");

    // load recent actions from S3 via our API
    (async () => {
      try {
        const r = await fetch("/api/feed/last", { cache: "no-store" });
        const j = await r.json();
        setFeed(j.items || []);
      } catch { setFeed(["(No actions yet)"]); }
    })();

    // free chat counter (client MVP)
    const key = "hespor_free_chat_used";
    setUsed(Number(localStorage.getItem(key) || "0"));
  }, []);

  async function send() {
    if (!subActive && used >= 10) {
      setReply("Free plan limit reached (10 messages/week). Activate Hespor Algo to unlock unlimited chat.");
      return;
    }
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message: msg })
    });
    const j = await r.json();
    setReply(j.reply || j.error || "");
    if (!subActive) {
      const key = "hespor_free_chat_used";
      const n = Number(localStorage.getItem(key) || "0") + 1;
      localStorage.setItem(key, String(n));
      setUsed(n);
    }
  }

  return (
    <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT column */}
      <div className="lg:col-span-2 space-y-4">
        {!subActive ? (
          <EnableAlgoCard onActivated={() => setSubActive(true)} />
        ) : (
          <SalesGraph range={range} setRange={setRange} />
        )}

        <div className="border rounded p-4">
          <h2 className="font-bold mb-2">Latest Hespor actions</h2>
          <ul className="list-disc ml-5">
            {feed.map((x,i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      </div>

      {/* RIGHT Chat */}
      <div className="border rounded p-4">
        <h2 className="font-bold mb-2">Hespor Chat</h2>
        {!subActive && <p className="text-sm mb-2">Free: {10-used} messages left this week</p>}
        <textarea className="w-full border p-2 h-40" value={msg} onChange={e=>setMsg(e.target.value)} />
        <button className="mt-2 px-3 py-2 border rounded" onClick={send}>Send</button>
        {reply && <div className="mt-3 whitespace-pre-wrap"><b>Reply:</b> {reply}</div>}
      </div>
    </main>
  );
}

function EnableAlgoCard({ onActivated }: { onActivated: ()=>void }) {
  const [acos, setAcos] = useState("25");
  const [asin, setAsin] = useState("");

  async function enable() {
    if (!asin.trim()) return alert("Enter primary ASIN");
    if (!acos.trim()) return alert("Enter break-even ACOS");
    const r = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ acos, asin }),
    });
    const { url } = await r.json();
    window.location.href = url; // Stripe Checkout
  }

  return (
    <div className="border rounded p-4">
      <h2 className="font-bold mb-2">Enable Hespor Algorithm</h2>
      <p className="text-sm mb-3">Answer 2 questions, then start your $49/mo (7-day free trial).</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Break-even ACOS (%)</label>
          <input className="border p-2 w-full" value={acos} onChange={e=>setAcos(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Primary ASIN</label>
          <input className="border p-2 w-full" value={asin} onChange={e=>setAsin(e.target.value)} />
        </div>
      </div>
      <button className="mt-3 px-3 py-2 border rounded" onClick={enable}>
        Connect to Hespor AI Advertising ($49/mo, 7-day trial)
      </button>
    </div>
  );
}

function SalesGraph({ range, setRange }:{range:any, setRange:(v:any)=>void}) {
  return (
    <div className="border rounded p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Sales</h2>
        <select className="border p-1" value={range} onChange={e=>setRange(e.target.value as any)}>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="ytd">Year to date</option>
          <option value="360d">Last 360 days</option>
        </select>
      </div>
      <div className="text-sm mt-2 text-gray-600">
        (Placeholder; we’ll wire real sales after SP-API approval.)
      </div>
    </div>
  );
}
