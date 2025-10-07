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

type TopTerm = {search_term:string, clicks:number, cost:number, sales:number, orders:number, acos:number|null};
type TopCampaign = {campaign_id:string, clicks:number, cost:number, sales:number, orders:number, acos:number|null};
type TopData = { terms: TopTerm[]; campaigns: TopCampaign[]; since?: string };

function useBrand() {
  const sp = useSearchParams();
  return sp.get("brand") || "default";
}

function TopBar() {
  return (
    <div className="flex items-center gap-3">
      <img src="/hespor-logo.png" className="h-7" alt="Hespor" />
      <div className="ml-auto flex gap-2 text-sm">
        <a href="/profile" className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50">Edit Profile</a>
        <a href="/billing" className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50">Billing</a>
        <a href="/subscription" className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50">Subscription</a>
        <a href="/auth/sign-out" className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50">Sign Out</a>
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

function useFreeBadge() {
  const key = "hespor_chat_week";
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (raw) {
      try {
        const obj = JSON.parse(raw);
        setRemaining(obj.remaining);
      } catch {}
    }
  }, []);
  return remaining;
}

function LeftColumn({ terms }: { terms: TopTerm[] }) {
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
        <div className="space-y-2 text-xs text-slate-500">
          <div>—</div>
          <div>—</div>
          <div>—</div>
        </div>
      </div>

      <div className="rounded-2xl border p-5 bg-white shadow-sm">
        <div className="text-sm font-semibold mb-2">Top Search Terms (30d)</div>
        <div className="space-y-2 max-h-72 overflow-auto">
          {terms && terms.length ? terms.slice(0,10).map((t,i)=>(
            <div key={i} className="text-xs flex items-center justify-between border-b last:border-b-0 pb-1">
              <div className="truncate max-w-[60%]">{t.search_term}</div>
              <div className="text-right shrink-0">
                <div>Sales ${(t.sales||0).toLocaleString()}</div>
                <div className="text-slate-500">ACOS {t.acos==null?'—':t.acos+'%'}</div>
              </div>
            </div>
          )) : <div className="text-xs text-slate-500">No recent search terms yet.</div>}
        </div>
      </div>
    </div>
  );
}

function Chatbot({ adsContext }: { adsContext: TopData | null }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! Ask me about your Amazon Ads: campaigns, search terms, ACOS…" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [limitBanner, setLimitBanner] = useState<string | null>(null);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      // Compact Ads context appended to the user question (server stays unchanged)
      const ctx = adsContext
        ? `\n\nCONTEXT (30d): Top Terms: ${JSON.stringify(adsContext.terms?.slice(0,8)||[])} Top Campaigns: ${JSON.stringify(adsContext.campaigns?.slice(0,8)||[])}\n`
        : "";
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: "default", query: userMsg.text + ctx }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setLimitBanner(data?.answer || "Weekly limit reached. Upgrade to Pro for unlimited questions.");
      }
      setMessages((m) => [...m, { role: "assistant", text: data.answer || "…" }]);
      if (typeof window !== "undefined") {
        const key = "hespor_chat_week";
        const raw = window.localStorage.getItem(key);
        try {
          const obj = raw ? JSON.parse(raw) : null;
          if (obj && typeof obj.remaining === "number") {
            const remaining = Math.max(0, obj.remaining - 1);
            window.localStorage.setItem(key, JSON.stringify({ remaining }));
          }
        } catch {}
      }
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry—something went wrong." }]);
    } finally {
      setSending(false);
    }
  }

  const remaining = useFreeBadge();

  return (
    <div className="rounded-2xl border bg-white flex flex-col min-h-[420px]">
      <div className="p-3 border-b flex items-center justify-between gap-2">
        <div className="text-sm font-semibold">Assistant</div>
        <div className="text-xs text-slate-500">
          {remaining == null ? "" : `Free plan • ~${remaining} left this week`}
        </div>
        <a href="/subscription" className="text-xs px-2 py-1 rounded-md bg-emerald-500 text-black">
          Upgrade to Pro
        </a>
      </div>

      {limitBanner && (
        <div className="px-4 py-2 text-xs text-red-700 bg-red-50 border-b">{limitBanner}</div>
      )}

      <div className="flex-1 p-4 space-y-3 overflow-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className={"inline-block px-3 py-2 rounded-xl " + (m.role === "user" ? "bg-emerald-50" : "bg-slate-50")}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" ? send() : null}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Ask about campaigns, ACOS, or search terms…"
        />
        <button onClick={send} disabled={sending} className="px-4 py-2 rounded-lg bg-emerald-500 text-black">
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}

function DashboardBody() {
  const brand = useBrand();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [top, setTop] = useState<TopData | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function refetchAll() {
    const [s, t] = await Promise.all([
      fetch(`/api/ads/summary?brand=${encodeURIComponent(brand)}&range=30d`).then(r=>r.json()),
      fetch(`/api/ads/top?days=30`).then(r=>r.json()),
    ]);
    setSummary(s);
    setTop(t?.error ? null : t);
  }

  useEffect(() => {
    refetchAll();
  }, [brand]);

  async function doSync() {
    setSyncing(true);
    try {
      await fetch("/api/ads/sync/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 30 })
      });
      await refetchAll();
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <TopBar />

      <div className="rounded-2xl border p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Summary</div>
            <div className="text-xs text-slate-400">Window: 30 days</div>
          </div>
          <button onClick={doSync} className="rounded-lg bg-emerald-500 text-black px-4 py-2 disabled:opacity-60" disabled={syncing}>
            {syncing ? "Syncing…" : "Sync now"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <KpiCard label="Sales (30d)" value={`$${(summary?.sales ?? 0).toLocaleString()}`} />
          <KpiCard label="Spend (30d)" value={`$${(summary?.spend ?? 0).toLocaleString()}`} />
          <KpiCard label="ACOS (30d)" value={summary?.acos == null ? "—" : `${summary?.acos}%`} />
          <KpiCard label="Orders (30d)" value={`${summary?.orders ?? 0}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LeftColumn terms={top?.terms || []} />
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm font-semibold mb-2">Assistant</div>
            <Chatbot adsContext={top} />
          </div>

          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm font-semibold mb-2">Top Campaigns (30d)</div>
            <div className="space-y-2 max-h-60 overflow-auto">
              {(top?.campaigns || []).slice(0,10).map((c,i)=>(
                <div key={i} className="text-xs flex items-center justify-between border-b last:border-b-0 pb-1">
                  <div className="truncate max-w-[60%]">Campaign {c.campaign_id}</div>
                  <div className="text-right shrink-0">
                    <div>Sales ${(c.sales||0).toLocaleString()}</div>
                    <div className="text-slate-500">ACOS {c.acos==null?'—':c.acos+'%'}</div>
                  </div>
                </div>
              ))}
              {!top?.campaigns?.length && <div className="text-xs text-slate-500">No campaign stats yet.</div>}
            </div>
          </div>
        </div>
      </div>
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
