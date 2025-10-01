"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function ConnectInner() {
  const params = useSearchParams();
  const error = params.get("error");
  const brand = params.get("brand") || process.env.NEXT_PUBLIC_HESPOR_DEFAULT_BRAND || "default";

  const humanError = useMemo(() => {
    if (!error) return null;
    if (error.includes("LWA token exchange failed")) {
      return "Amazon Login token exchange failed. Check LWA Client ID/Secret and the exact redirect URL.";
    }
    if (error.toLowerCase().includes("secretsmanager") || error.toLowerCase().includes("accessdenied")) {
      return "AWS Secrets Manager permission denied. Attach SecretsManager Create/Put/Get to the IAM user used by Vercel.";
    }
    if (error.includes("missing_authorization_code")) {
      return "Amazon did not return an authorization code. Try again.";
    }
    return error;
  }, [error]);

  function onAds() {
    // carry brand in state
    window.location.href = `/api/ads/start?brand=${encodeURIComponent(brand)}`;
  }
  function onSpapi() {
    window.location.href = `/api/sp/start?brand=${encodeURIComponent(brand)}`;
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-6">
        <img src="/hespor-logo.png" className="h-8" alt="Hespor" />
        <h1 className="text-2xl font-semibold">Connect your account</h1>
      </div>

      {!!humanError && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-900">
          <b>Connection error:</b> {humanError}
        </div>
      )}

      <div className="rounded-2xl border p-6 space-y-3">
        <p className="text-sm text-slate-600">
          Step 1: Connect your Amazon accounts. <b>Amazon Ads</b> is required to run
          campaigns. <b>SP-API</b> is optional for now.
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

        <div className="text-xs text-slate-500">
          Current brand: <span className="font-mono">{brand}</span>
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
