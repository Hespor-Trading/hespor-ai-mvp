"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

type Rule = {
  brand: string;
  primary_asin: string | null;
  breakeven_acos: number | null;
};

function Inner() {
  const params = useSearchParams();
  const [rules, setRules] = useState<Rule | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const brand = params.get("brand") || "default";

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
  }, [params]);

  function upgrade() {
    // Your UI is already calling POST /api/stripe/checkout from a button elsewhere;
    // here’s a simple version if you need it directly:
    fetch("/api/stripe/checkout", { method: "POST" })
      .then((r) => r.json())
      .then((p) => {
        if (p?.url) window.location.href = p.url;
      })
      .catch(() => {});
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <div className="rounded-2xl border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Plan</div>
            <div className="font-medium">{plan}</div>
          </div>
          {plan === "free" && (
            <button
              onClick={upgrade}
              className="rounded-lg bg-emerald-500 text-black px-4 py-2"
            >
              Upgrade
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
