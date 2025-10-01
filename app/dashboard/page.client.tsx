"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Summary = {
  spend: number;
  sales: number;
  acos: number | null;
  orders: number;
  ctr: number | null;
  period: string;
};

function useBrand() {
  const sp = useSearchParams();
  return sp.get("brand") || "default";
}

function TopBar() {
  return (
    <div className="flex items-center gap-3">
      <img src="/hespor-logo.png" className="h-7" alt="Hespor" />
      <div className="ml-auto flex gap-2 text-sm">
        <a href="/profile" className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50">
          Edit Profile
        </a>
        <a href="/billing" className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50">
          Billing
        </a>
        <a href="/subscription" className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50">
          Subscription
        </a>
        <a href="/auth/sign-out" className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50">
          Sign Out
        </a>
      </div>
    </div>
  );
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border p-5 bg-white shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function useFreeLimit() {
  // 10 questions / week (client-side; server enforcement in next step)
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  const key = "hespor_chat_week";
  const now = Date.now();
  const [used, setUsed] = useState(0);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (!raw) return;
    try {
      const { start, used } = JSON.parse(raw);
      if (now - start < WEEK) setUsed(used || 0);
      else window.localStorage.removeItem(key);
    } catch {}
  }, [now]);

  function bump() {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    let obj = { start: now, used: 0 };
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        obj = { start: parsed.start, used: parsed.used };
        if (now - parsed.start >= WEEK) obj = { start: now, used: 0 };
      } catch {}
    }
    obj.used += 1;
    window.localStorage.setItem(key, JSON.stringify(obj));
    setUsed(obj.used);
  }

  const remaining = Math.max(0, 10 - used);
  const locked = remaining <= 0;
  return { remaining, locked, bump };
}

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! Ask me about ACOS, spend, and your top keywords." },
  ]);
  const brand = useBrand();
  const { remaining, locked, bump } = useFreeLimit();

  async function send() {
    if (!input.trim() || locked) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    bump();

    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, query: q }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", text: data.answer || "No answer." }]);
  }

  return (
    <div className="rounded-2xl border h-[70vh] flex flex-col overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b">
        <div className="text-xs text-slate-600">
          Free plan: <b>{remaining}</b> questions left this week
        </div>
        <a href="/subscription" className="text-xs px-2 py-1 rounded-md bg-emerald-500 text-black">
          Upgrade to Pro
        </a>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block px-3 py-2 rounded-xl " +
                (m.role === "user" ? "bg-emerald-200" : "bg-slate-100")
              }
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={locked ? "Limit reached — upgrade to Pro" : "e.g., Show ACOS trend last 30 days"}
          disabled={locked}
        />
        <button
          onClick={send}
          disabled={locked}
          className="rounded-lg bg-emerald-500 text-black px-4 py-2 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

function LeftColumn() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Plan</div>
            <div className="font-medium">free</div>
          </div>
          <a href="/subscription" className="rounded-lg bg-emerald-500 text-black px-4 py-2">
            Activate Pro
          </a>
        </div>
      </div>

      <div className="rounded-2xl border p-5 bg-white opacity-60">
        <div className="font-medium mb-2">Applied Items</div>
        <div className="text-sm text-slate-600">Engine actions will appear here (Pro).</div>
      </div>

      <div className="rounded-2xl border p-5 bg-white">
        <div className="font-medium mb-2">Your Config</div>
        <div className="text-sm text-slate-600">
          Primary ASIN: — <br /> Breakeven ACOS: —
        </div>
      </div>
    </div>
  );
}

function DashboardBody() {
  const brand = useBrand();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch(`/api/ads/summary?brand=${encodeURIComponent(brand)}&range=30d`);
      const data = await res.json();
      if (mounted) {
        setSummary(data);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [brand]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <TopBar />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard label="Sales (30d)" value={`$${(summary?.sales ?? 0).toLocaleString()}`} />
        <KpiCard label="Spend (30d)" value={`$${(summary?.spend ?? 0).toLocaleString()}`} />
        <KpiCard label="ACOS (30d)" value={summary?.acos == null ? "—" : `${summary?.acos}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><Chatbot /></div>
        <div className="lg:col-span-1"><LeftColumn /></div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="rounded-2xl bg-white border px-6 py-5 shadow">
            <div className="font-medium">Wiring up your data…</div>
            <div className="text-sm text-slate-600 mt-1">
              Fetching the last 30 days from Amazon Ads. This may be empty if no campaigns are found.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardClient() {
  return (
    <Suspense>
      <DashboardBody />
    </Suspense>
  );
}
