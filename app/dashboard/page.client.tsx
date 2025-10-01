"use client";

import { useEffect, useState, Suspense } from "react";
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
      <img src="/hespor-logo.png" className="h-8" alt="Hespor" />
      <div className="ml-auto flex gap-4 text-sm">
        <a href="/profile" className="hover:underline">Edit Profile</a>
        <a href="/billing" className="hover:underline">Billing</a>
        <a href="/subscription" className="hover:underline">Subscription</a>
        <a href="/auth/sign-out" className="hover:underline">Sign Out</a>
      </div>
    </div>
  );
}

function KpiCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! Ask me about ACOS, spend, and your top keywords." },
  ]);
  const brand = useBrand();

  async function send() {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, query: q }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", text: data.answer || "No answer." }]);
  }

  return (
    <div className="rounded-2xl border h-[70vh] flex flex-col overflow-hidden bg-white">
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
          placeholder="e.g., Show ACOS trend last 30 days"
        />
        <button onClick={send} className="rounded-lg bg-emerald-500 text-black px-4 py-2">
          Send
        </button>
      </div>
    </div>
  );
}

function LeftColumn() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Plan</div>
            <div className="font-medium">free</div>
          </div>
          <a href="/pricing" className="rounded-lg bg-emerald-500 text-black px-4 py-2">Activate Pro</a>
        </div>
      </div>

      <div className="rounded-2xl border p-5 bg-white opacity-50 blur-[1px]">
        <div className="font-medium mb-2">Applied Items</div>
        <div className="text-sm text-slate-600">Latest actions the engine took…</div>
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
      <div className="bg-emerald-50 min-h-[100vh]">
        <DashboardBody />
      </div>
    </Suspense>
  );
}
