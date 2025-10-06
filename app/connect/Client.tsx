"use client";

import { useMemo, useState } from "react";

export default function ConnectClient() {
  const [loadingAds, setLoadingAds] = useState(false);
  const [loadingSp, setLoadingSp] = useState(false);

  // Read the URLs from env (already configured on your side)
  const adsUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_ADS_OAUTH_URL ||
      process.env.NEXT_PUBLIC_AMAZON_ADS_REDIRECT ||
      "",
    []
  );

  const spUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_SP_OAUTH_URL ||
      process.env.NEXT_PUBLIC_SP_REDIRECT ||
      process.env.SP_LWA_REDIRECT ||
      "",
    []
  );

  const goAds = () => {
    if (!adsUrl) return;
    setLoadingAds(true);
    // Goes to Amazon OAuth "Allow" screen for Ads
    window.location.href = adsUrl;
  };

  const goSp = () => {
    if (!spUrl) return;
    setLoadingSp(true);
    // Goes to Amazon OAuth "Allow" screen for SP-API (optional)
    window.location.href = spUrl;
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow space-y-6">
        <header className="text-center space-y-1">
          <h1 className="text-xl font-semibold">Connect your Amazon data</h1>
          <p className="text-sm text-gray-600">
            Choose what to connect. You can add Inventory &amp; Sales later.
          </p>
        </header>

        {/* Amazon Ads (Required) */}
        <section className="rounded-xl border p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-medium">Advertising Data (Amazon Ads)</h2>
                <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5">
                  Required
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Connect your Amazon Ads account so Hespor can analyze campaigns and performance.
              </p>
            </div>

            <button
              onClick={goAds}
              disabled={!adsUrl || loadingAds}
              className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-medium hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
            >
              {loadingAds ? "Opening…" : "Connect Ads"}
            </button>
          </div>
          {!adsUrl && (
            <p className="text-xs text-amber-600 mt-2">
              OAuth URL is not configured in env. Set <code>NEXT_PUBLIC_ADS_OAUTH_URL</code>.
            </p>
          )}
        </section>

        {/* SP-API (Optional) */}
        <section className="rounded-xl border p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-medium">Inventory &amp; Sales Data (Amazon Seller)</h2>
                <span className="text-xs rounded-full bg-gray-100 text-gray-700 px-2 py-0.5">
                  Optional
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Connect Seller (SP-API) to sync listings, orders, and inventory for deeper insights.
              </p>
            </div>

            <button
              onClick={goSp}
              disabled={!spUrl || loadingSp}
              className="rounded-xl bg-emerald-600 text-white px-4 py-2 font-medium hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
            >
              {loadingSp ? "Opening…" : "Connect Seller"}
            </button>
          </div>
          {!spUrl && (
            <p className="text-xs text-amber-600 mt-2">
              OAuth URL is not configured in env. Set <code>NEXT_PUBLIC_SP_OAUTH_URL</code>.
            </p>
          )}
        </section>

        <p className="text-xs text-center text-gray-500">
          After you click <b>Allow</b> on Amazon, you’ll be redirected back to Hespor.
          Your data will begin syncing and you’ll be taken to your dashboard.
        </p>
      </div>
    </div>
  );
}
