"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

type Rule = {
  brand: string;
  primary_asin: string | null;
  breakeven_acos: number | null;
};

function Chatbot() {
  // placeholder UI – wire to your /api/ai later
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hi! Ask me about ACOS, spend, and your top keywords." },
  ]);

  async function send() {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    // TODO: call /api/ai
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: "Working on that… (stub)" }]);
    }, 300);
  }

  return (
    <div className="rounded-2xl border h-[70vh] flex flex-col overflow-hidden">
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
      <div className="p-3 text-sm text-slate-500">
        Try:
        <div className="flex gap-2 mt-2 flex-wrap">
          {[
            "Top keywords last 7d",
            "Active campaigns with ACOS",
            "Spend and sales 30d",
            "Any negatives to add?",
          ].map((s) => (
            <button
              key={s}
              className="text-xs rounded-full border px-3 py-1 hover:bg-emerald-50"
              onClick={() => {
                const evt = { target: { value: s } } as any;
                // quick-fill
                (document.querySelector("input[placeholder^='e.g., Show ACOS']") as HTMLInputElement).value =
                  s;
                setInput(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Menu() {
  return (
    <div className="flex items-center gap-3">
      <img src="/hespor-logo.png" className="h-8" alt="Hespor" />
      <div className="ml-auto flex gap-3 text-sm">
        <Link href="/profile" className="hover:underline">
          Edit Profile
        </Link>
        <Link href="/billing" className="hover:underline">
          Billing
        </Link>
        <Link href="/subscription" className="hover:underline">
          Subscription
        </Link>
        <Link href="/auth/sign-out" className="hover:underline">
          Sign Out
        </Link>
      </div>
    </div>
  );
}

function LeftCards({ plan, rules }: { plan: "free" | "pro"; rules: Rule | null }) {
  const [showActivate, setShowActivate] = useState(false);
  const [asin, setAsin] = useState("");
  const [acos, setAcos] = useState("25");

  async function activatePro() {
    // Save ASIN/ACOS then Stripe – you already have /api/stripe/checkout
    // For brevity, only open checkout here:
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Plan</div>
            <div className="font-medium">{plan}</div>
          </div>
          {plan === "free" ? (
            <button
              onClick={() => setShowActivate(true)}
              className="rounded-lg bg-emerald-500 text-black px-4 py-2"
            >
              Activate Pro
            </button>
          ) : (
            <span className="rounded-full bg-emerald-100 text-emerald-900 text-xs px-3 py-1">
              Pro
            </span>
          )}
        </div>

        {showActivate && (
          <div className="mt-4 space-y-3 bg-emerald-50 rounded-xl p-4">
            <p className="text-sm text-slate-700">
              Enter your <b>Primary ASIN</b> and <b>Breakeven ACOS</b> before checkout.
            </p>
            <input
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              placeholder="Primary ASIN"
              className="w-full rounded-lg border px-3 py-2"
            />
            <input
              value={acos}
              onChange={(e) => setAcos(e.target.value)}
              type="number"
              min={1}
              max={95}
              placeholder="Breakeven ACOS (%)"
              className="w-full rounded-lg border px-3 py-2"
            />
            <div className="flex gap-2">
              <button onClick={activatePro} className="rounded-lg bg-black text-white px-4 py-2">
                Continue to Checkout
              </button>
              <button
                onClick={() => setShowActivate(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={"rounded-2xl border p-5 " + (plan === "free" ? "opacity-50 blur-[1px]" : "")}>
        <div className="font-medium mb-2">Applied Items</div>
        <div className="text-sm text-slate-600">Latest actions the engine took…</div>
      </div>

      <div className="rounded-2xl border p-5">
        <div className="font-medium mb-2">Your Config</div>
        <div className="text-sm text-slate-600">
          Primary ASIN: {rules?.primary_asin || "—"} <br />
          Breakeven ACOS:{" "}
          {rules?.breakeven_acos != null ? `${rules?.breakeven_acos}%` : "—"}
        </div>
      </div>
    </div>
  );
}

function Inner() {
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(true);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [rules, setRules] = useState<Rule | null>(null);

  useEffect(() => {
    // Poll status quickly for demo; replace with Supabase realtime later
    let mounted = true;

    async function tick() {
      const s = await fetch("/api/ads/status").then((r) => r.json());
      if (!mounted) return;

      // when your provisioner marks done, setIngesting(false)
      setIngesting(!!s.processing); // placeholder returns false
      setLoading(false);
    }

    tick();
    const id = setInterval(tick, 2500);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Menu />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chatbot />
        </div>
        <div className="lg:col-span-1">
          <LeftCards plan={plan} rules={rules} />
        </div>
      </div>

      {(loading || ingesting) && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="rounded-2xl bg-white border px-6 py-5 shadow">
            <div className="font-medium">Wiring up your data…</div>
            <div className="text-sm text-slate-600 mt-1">
              Fetching the last 30 days from Amazon Ads. This usually takes a moment.
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
      <Inner />
    </Suspense>
  );
}
