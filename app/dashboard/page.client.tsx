"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import Chat from "@/app/components/Chat";

type Plan = "free" | "pro";
type Pt = { date: string; sales: number; profit: number; adSpend: number };

function Inner() {
  const router = useRouter();
  const params = useSearchParams();

  const [plan, setPlan] = useState<Plan>("free");
  const [uid, setUid] = useState<string | null>(null);
  const firstVisit = params?.get("first") === "1";
  const [showOverlay, setShowOverlay] = useState(firstVisit);
  const [range, setRange] = useState<"24h" | "7d" | "30d" | "90d" | "6m">("30d");
  const [series, setSeries] = useState<Pt[]>([]);

  // Gate: must be signed in and have both Ads + SP-API connected
  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        router.replace("/auth/sign-in");
        return;
      }
      setUid(session.user.id);

      const [{ data: ads }, { data: sp }] = await Promise.all([
        sb.from("amazon_ads_credentials").select("user_id").eq("user_id", session.user.id).maybeSingle(),
        sb.from("spapi_credentials").select("user_id").eq("user_id", session.user.id).maybeSingle(),
      ]);

      if (!ads || !sp) {
        router.replace("/connect");
      }
    })();
  }, [router]);

  // Poll bootstrap status on first visit
  useEffect(() => {
    if (!firstVisit) return;

    let alive = true;
    let tries = 0;

    const poll = async () => {
      tries++;
      const res = await fetch("/api/bootstrap/status", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setPlan((j.plan as Plan) ?? "free");
        if (j.done || tries > 90) {
          if (alive) setShowOverlay(false);
          return;
        }
      }
      setTimeout(poll, 2000);
    };

    poll();
    return () => { alive = false; };
  }, [firstVisit]);

  // Keep plan in sync
  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return;
      const { data: prof } = await sb.from("profiles").select("plan").eq("id", session.user.id).maybeSingle();
      if (prof?.plan) setPlan(prof.plan as Plan);
    })();
  }, []);

  // Load metrics when Pro
  useEffect(() => {
    if (plan !== "pro") return;
    (async () => {
      const res = await fetch(`/api/metrics/summary?range=${range}`, { cache: "no-store" });
      if (!res.ok) return;
      const j = await res.json();
      setSeries((j.series as Pt[]) ?? []);
    })();
  }, [plan, range]);

  // Checkout handler
  const goCheckout = async () => {
    const { data: { user } } = await supabaseBrowser().auth.getUser();
    if (!user) {
      router.replace("/auth/sign-in");
      return;
    }
    window.location.href = `/api/checkout?uid=${user.id}`;
  };

  // Lightweight SVG line chart (no external libs)
  const svg = useMemo(() => {
    if (series.length === 0) return null;
    const w = 640;
    const h = 180;
    const pad = 24;
    const xs = (i: number) => pad + (i * (w - 2 * pad)) / Math.max(series.length - 1, 1);
    const maxY = Math.max(...series.map(s => Math.max(s.sales, s.profit, s.adSpend)), 1);
    const ys = (v: number) => h - pad - (v / maxY) * (h - 2 * pad);

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
        <polyline fill="none" strokeWidth="2" points={series.map((p, i) => `${xs(i)},${ys(p.sales)}`).join(" ")} />
        <polyline fill="none" strokeWidth="2" points={series.map((p, i) => `${xs(i)},${ys(p.profit)}`).join(" ")} />
        <polyline fill="none" strokeWidth="2" points={series.map((p, i) => `${xs(i)},${ys(p.adSpend)}`).join(" ")} />
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="currentColor" strokeOpacity="0.2" />
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="currentColor" strokeOpacity="0.2" />
      </svg>
    );
  }, [series]);

  if (!uid) return null;

  return (
    <div className="relative min-h-screen">
      {/* Main content (blurs while first-time overlay shows) */}
      <div className={showOverlay ? "blur-sm pointer-events-none select-none" : ""}>
        <div className="min-h-screen grid grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="col-span-12 lg:col-span-8 p-6 bg-emerald-50">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                  {plan === "pro" ? "Pro" : "Free"}
                </span>
              </div>
              <button
                onClick={() => document.getElementById("drawer")?.classList.toggle("hidden")}
                className="rounded-md border px-3 py-1"
                aria-label="Menu"
              >
                ☰
              </button>
            </div>

            {/* CTA (Free) OR Graph (Pro) */}
            {plan === "free" ? (
              <div className="rounded-2xl bg-white p-6 shadow mb-6">
                <h2 className="text-lg font-semibold mb-2">Connect to HESPOR optimization algo</h2>
                <p className="text-gray-600 mb-4">
                  Unlock daily optimizations, unlimited chat, and activity feed.
                </p>
                <button onClick={goCheckout} className="rounded-lg bg-emerald-600 px-4 py-2 text-white">
                  Upgrade $49/mo
                </button>
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-6 shadow mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Sales • Profit • Ad spend</h2>
                  <div className="flex gap-1 text-sm">
                    {(["24h", "7d", "30d", "90d", "6m"] as const).map(r => (
                      <button
                        key={r}
                        onClick={() => setRange(r)}
                        className={`px-2 py-1 rounded ${range === r ? "bg-emerald-100 text-emerald-800" : "hover:bg-gray-100"}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-2">Prototype graph – wires to Amazon data next.</p>
                <div className="h-44 flex items-center justify-center text-emerald-800">
                  {svg ?? <div className="w-full h-44 bg-emerald-100 rounded-md" />}
                </div>
              </div>
            )}

            {/* Activity section */}
            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="text-lg font-semibold mb-2">Latest updates</h2>
              {plan === "free" ? (
                <p className="text-gray-600">
                  As soon as the algo is activated, the most recent updates will appear here.
                </p>
              ) : (
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  <li>Optimization activity will be listed here in natural language.</li>
                </ul>
              )}
            </div>
          </div>

          {/* RIGHT CHAT COLUMN */}
          <div className="col-span-12 lg:col-span-4 h-screen sticky top-0">
            <Chat />
          </div>

          {/* RIGHT DRAWER */}
          <div id="drawer" className="hidden fixed right-4 top-16 z-50 w-72 rounded-xl bg-white shadow p-4">
            <h3 className="font-semibold mb-2">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="text-emerald-700 underline" href="/api/billing">Billing (update card)</a></li>
              <li><a className="text-emerald-700 underline" href="/api/subscription">Subscription (upgrade/downgrade)</a></li>
              <li><a className="text-emerald-700 underline" href="/support">Support</a></li>
              <li><a className="text-emerald-700 underline" href="/auth/sign-out">Sign out</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* FIRST-TIME OVERLAY */}
      {showOverlay && (
        <div className="fixed inset-0 z-40 bg-emerald-600/95 text-white flex items-center justify-center">
          <div className="max-w-md text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Setting up your dashboard…</h2>
            <p className="text-emerald-100">
              We’re fetching your Amazon data. This can take a few minutes for first-time setup.
              You’ll see your dashboard as soon as it’s ready.
            </p>
            <div className="mt-6 animate-pulse rounded-lg bg-emerald-500 px-4 py-2 inline-block">Loading</div>
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
