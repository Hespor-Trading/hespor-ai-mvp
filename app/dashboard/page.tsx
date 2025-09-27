"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import Chat from "@/app/components/Chat";

// ...
const [syncing, setSyncing] = useState(false);

useEffect(() => {
  // If coming right after first connect, show a friendly setup overlay
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("first") === "1") {
      setSyncing(true);
      // hide after a couple of minutes; adjust as needed once your data jobs are wired
      const t = setTimeout(() => setSyncing(false), 120000);
      return () => clearTimeout(t);
    }
  }
}, []);
// ...

export default function Dashboard() {
  const router = useRouter();
  const [plan, setPlan] = useState<"free" | "pro" | "unknown">("unknown");

  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return router.replace("/auth/sign-in");

      // If not connected → go to /connect
      const { data: ads } = await sb
        .from("amazon_ads_credentials")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const { data: sp } = await sb
        .from("spapi_credentials")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!ads || !sp) return router.replace("/connect");

      const { data: prof } = await sb
        .from("profiles")
        .select("plan")
        .eq("id", session.user.id)
        .maybeSingle();

      setPlan((prof?.plan as any) ?? "free");
    })();
  }, [router]);

  async function goCheckout() {
    // attach the session user to the checkout
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

        {/* CTA or graph */}
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

        {/* Activity */}
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">Latest updates</h2>
          {plan === "free" ? (
            <p className="text-gray-600">As soon as the algo is activated, the most recent updates will appear here.</p>
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
          <li><a className="text-emerald-700 underline" href="mailto:support@hespor.com">Support: support@hespor.com</a></li>
        </ul>
      </div>
    </div>
  );
}
