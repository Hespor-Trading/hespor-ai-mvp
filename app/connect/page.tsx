"use client";

export const dynamic = "force-dynamic";

export default function ConnectPage() {
  function onAds() {
    // Minimal: just hit the server route (no params, no Suspense)
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
      </div>
    </div>
  );
}
