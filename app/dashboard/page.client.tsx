"use client";

import { useEffect, useState, Suspense } from "react";
import { supabaseBrowser } from "@/lib/supabase";

type Rule = {
  brand: string;
  primary_asin: string | null;
  breakeven_acos: number | null;
};

function Inner() {
  const [rules, setRules] = useState<Rule | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [brand] = useState("default");

  // activation form
  const [asin, setAsin] = useState("");
  const [acos, setAcos] = useState("25");
  const [activating, setActivating] = useState(false);
  const [showActivate, setShowActivate] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .maybeSingle();
      if (prof?.plan) setPlan(prof.plan);

      const { data: r } = await supabase
        .from("brand_rules")
        .select("brand, primary_asin, breakeven_acos")
        .eq("user_id", user.id)
        .eq("brand", brand)
        .maybeSingle();

      if (r) setRules(r as Rule);
    })();
  }, [brand]);

  async function activatePro() {
    try {
      setActivating(true);

      // 1) Save ASIN + ACOS now (only on activation step)
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const { error } = await supabase.from("brand_rules").upsert(
        {
          user_id: user.id,
          brand,
          primary_asin: asin.trim(),
          breakeven_acos: Number(acos),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,brand" }
      );
      if (error) throw error;

      // 2) Open Stripe Checkout (POST endpoint you have)
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.message || "Checkout failed");
      window.location.href = data.url;
    } catch (e: any) {
      alert(e?.message || "Activation failed");
    } finally {
      setActivating(false);
    }
  }

  function UpgradeCard() {
    if (plan === "pro") return null;
    return (
      <div className="rounded-2xl border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Plan</div>
            <div className="font-medium">{plan}</div>
          </div>
          <button
            onClick={() => setShowActivate(true)}
            className="rounded-lg bg-emerald-500 text-black px-4 py-2"
          >
            Activate Pro
          </button>
        </div>

        {showActivate && (
          <div className="mt-4 space-y-3 bg-emerald-50 rounded-xl p-4">
            <p className="text-sm text-slate-700">
              Tell us your <b>Primary ASIN</b> and <b>Breakeven ACOS</b> to wire up the
              algorithm before checkout.
            </p>
            <label className="block">
              <span className="text-sm font-medium">Primary ASIN</span>
              <input
                value={asin}
                onChange={(e) => setAsin(e.target.value)}
                placeholder="e.g., B0CXXXXXXX"
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">
                Breakeven ACOS (%){" "}
                <span title="If your product margin is 25%, breakeven ACOS is ~25%">
                  ⓘ
                </span>
              </span>
              <input
                value={acos}
                onChange={(e) => setAcos(e.target.value)}
                type="number"
                min={1}
                max={95}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
            </label>
            <div className="flex gap-2">
              <button
                onClick={activatePro}
                disabled={activating || !asin.trim()}
                className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-50"
              >
                {activating ? "Starting checkout…" : "Continue to Checkout"}
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
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <UpgradeCard />

      <div className="rounded-2xl border p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="text-sm text-slate-600">Primary ASIN</div>
            <div className="text-lg font-medium">
              {rules?.primary_asin || "—"}
            </div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="text-sm text-slate-600">Breakeven ACOS</div>
            <div className="text-lg font-medium">
              {rules?.breakeven_acos != null ? `${rules.breakeven_acos}%` : "—"}
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
      <Inner />
    </Suspense>
  );
}
