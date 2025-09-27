"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import Chat from "@/app/components/Chat";

type Plan = "free" | "pro" | "unknown";

export default function Dashboard() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>("unknown");
  const [syncing, setSyncing] = useState(false);

  // Auth + connection checks
  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();

      // must be logged in
      const { data: { session } } = await sb.auth.getSession();
      if (!session) { router.replace("/auth/sign-in"); return; }

      // require BOTH connections; otherwise go to /connect
      const [{ data: ads }, { data: sp }] = await Promise.all([
        sb.from("amazon_ads_credentials").select("user_id").eq("user_id", session.user.id).maybeSingle(),
        sb.from("spapi_credentials").select("user_id").eq("user_id", session.user.id).maybeSingle()
      ]);
      if (!ads || !sp) { router.replace("/connect"); return; }

      // load plan
      const { data: prof } = await sb.from("profiles").select("plan").eq("id", session.user.id).maybeSingle();
      setPlan(((prof?.plan as Plan) ?? "free"));

      // show first-sync overlay when arriving from /connect
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.get("first") === "1") {
          setSyncing(true);
          const t = setTimeout(() => setSyncing(false), 120000); // ~2 minutes
          return () => clearTimeout(t);
        }
      }
    })();
  }, [router]);

  // Stripe checkout
  async function goCheckout() {
    const { data: { user } } = await supabaseBrowser().auth.getUser();
    if (!user) return;
    window.location.href = `/api/checkout?uid=${user.id}`;
  }

  if (plan === "unknown") return null;

  return (
    <div className="min-h-screen grid grid-cols-12">
      {/* LEFT COLUMN */}
      <div className="col-span-12 lg:col-span-8 p-6 bg-emerald-50">
        {/* top bar */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => document.getElementById("drawer")?.classList.toggle("hidden")}
            className="rounded-md border px-3 py-1"
            aria-label="Menu"
          >
            ☰
          </button>
        </div>

        {/* top-left CTA or sales graph placeholder */}
        {plan === "free" ? (
          <div className="rounded-2xl bg-white p-6 shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">Connect to HESPOR optimization algo</h2>
            <p className="text-gray-600 mb-4">Unlock daily optimizations, unlimited chat, and activity feed.</p>
            <button onClick={goCheckout} className="rounded-lg bg-emerald-600 px-4 py-2 text-white">
              Upgrade $49/mo
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow mb-6">
            <h2 className="text-lg font-semibold mb-2">Sales & Profit</h2>
            <p className="text-gray-600 mb-2">Filter: last 24h · 7d · 30d · 90d · 6m (coming soon)</p>
            <div className="h-40 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-800">
              Graph placeholder (wire to Amazon data next)
            </div>
          </div>
        )}

        {/* activity section */}
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
      <div id="drawer" className="hidden fixed right-4 top-16 z-40 w-72 rounded-xl bg-white shadow p-4">
        <h3 className="font-semibold mb-2">Account</h3>
        <ul className="space-y-2 text-sm">
          <li><a className="text-emerald-700 underline" href="/api/billing">Billing (update card)</a></li>
          <li><a className="text-emerald-700 underline" href="/api/subscription">Subscription (upgrade/downgrade)</a></li>
          <li><a className="text-emerald-700 underline" href="mailto:support@hespor.com">Support: support@hespor.com</a></li>
        </ul>
      </div>

      {/* FIRST-SYNC OVERLAY */}
      {syncing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/10">
          <div className="max-w-md rounded-xl bg-emerald-600 p-6 text-white shadow-xl">
            <h3 className="text-xl font-semibold mb-2">Setting up your dashboard…</h3>
            <p className="text-emerald-50">
              We’re securely fetching your Amazon Ads and SP-API data. This first sync can take a couple of minutes.
              You can keep this tab open — your dashboard will appear as soon as data arrives.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
