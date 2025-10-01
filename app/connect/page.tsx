"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function ConnectInner() {
  const params = useSearchParams();
  const brand = params.get("brand") || "default";

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

      <div className="rounded-2xl border p-6 space-y-3">
        <p className="text-sm text-slate-600">
          Step 1: Connect your Amazon accounts. <b>Amazon Ads</b> is required to
          run campaigns. <b>SP-API</b> is optional for now.
        </p>

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

        <div className="text-xs text-slate-500 pt-2">
          After connecting, go to the Dashboard to <b>Activate Pro</b> and enter
          your Primary ASIN + Breakeven ACOS.
        </div>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ConnectInner />
    </Suspense>
  );
}
