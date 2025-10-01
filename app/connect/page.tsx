"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

// prevent static prerender of this page (uses client-only hooks)
export const dynamic = "force-dynamic";

function ConnectInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [asin, setAsin] = useState("");
  const [acos, setAcos] = useState("25"); // %
  const [saving, setSaving] = useState(false);
  const [brand, setBrand] = useState("default");

  useEffect(() => {
    const b = params.get("brand");
    if (b) setBrand(b);
  }, [params]);

  async function saveBasics() {
    setSaving(true);
    const supabase = supabaseBrowser();

    const {
      data: { user },
      error: uErr,
    } = await supabase.auth.getUser();

    if (uErr || !user) {
      setSaving(false);
      router.push("/auth/sign-in");
      return;
    }

    // Save to brand_rules (present in your DB)
    const { error } = await supabase
      .from("brand_rules")
      .upsert(
        {
          user_id: user.id,
          brand,
          primary_asin: asin.trim(),
          breakeven_acos: Number(acos),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,brand" }
      );

    setSaving(false);

    if (error) {
      alert("Could not save settings: " + error.message);
    } else {
      try {
        await fetch("/api/events/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "connect_save_basics", brand }),
        });
      } catch {}
      alert("Saved.");
    }
  }

  function onAds() {
    const url = new URL("/api/ads/start", window.location.origin);
    url.searchParams.set("brand", brand);
    window.location.href = url.toString();
  }

  function onSpapi() {
    const url = new URL("/api/sp/start", window.location.origin);
    url.searchParams.set("brand", brand);
    window.location.href = url.toString();
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <img src="/hespor-logo.png" className="h-10" alt="Hespor" />
        <h1 className="text-2xl font-semibold">Connect your account</h1>
      </div>

      <div className="space-y-4 rounded-2xl p-5 bg-emerald-50 text-slate-900">
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
            <span title="Your profit margin inverted. If product margin is 25%, breakeven ACOS is ~25%">
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

        <button
          onClick={saveBasics}
          disabled={saving}
          className="w-full rounded-lg bg-emerald-500 text-black py-3 hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={onAds}
          className="w-full rounded-lg bg-black text-white py-3 hover:opacity-90"
        >
          Connect Amazon Ads (required)
        </button>

        <button
          onClick={onSpapi}
          className="w-full rounded-lg bg-emerald-500 text-black py-3 hover:opacity-90"
        >
          Connect SP-API (optional)
        </button>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  // ✅ useSearchParams is used inside ConnectInner which is wrapped by Suspense
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ConnectInner />
    </Suspense>
  );
}
