"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function ConnectInner() {
  const params = useSearchParams();
  const error = params.get("error");

  const humanError = useMemo(() => {
    if (!error) return null;
    if (error.includes("LWA token exchange failed")) {
      return "Amazon Login token exchange failed. Check LWA Client ID/Secret and the exact redirect URL.";
    }
    if (error.includes("AccessDenied") || error.toLowerCase().includes("secretsmanager")) {
      return "AWS Secrets Manager permission denied. Attach SecretsManager Create/Put/Get to the IAM user used by Vercel.";
    }
    if (error.includes("missing_authorization_code")) {
      return "Amazon did not return an authorization code. Try again.";
    }
    return error;
  }, [error]);

  function onAds() {
    window.location.href = "/api/ads/start";
  }
  function onSpapi() {
    window.location.href = "/api/sp/start";
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <img src="/hespor-logo.png" className="h-10" alt="Hespor" />
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
      </div>
    </div>
  );
}

export default function ConnectPage() {
  // ✅ Needed for Next.js App Router: hooks like useSearchParams must be inside Suspense.
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ConnectInner />
    </Suspense>
  );
}
