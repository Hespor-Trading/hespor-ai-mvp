// app/connect/page.client.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function getBrand(): string {
  const u = new URL(window.location.href);
  return (u.searchParams.get("brand") || "DECOGAR").trim();
}

function buildAdsAuthorizeUrl(brand: string) {
  const clientId = process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID!;
  const redirect = encodeURIComponent(process.env.NEXT_PUBLIC_AMAZON_ADS_REDIRECT!);
  // add scopes as needed; campaign mgmt is enough for dashboard/algo
  const scope = encodeURIComponent("advertising::campaign_management");
  const state = encodeURIComponent(`brand=${brand}`);
  return `https://www.amazon.com/ap/oa?client_id=${clientId}&scope=${scope}&response_type=code&redirect_uri=${redirect}&state=${state}`;
}

export default function ConnectClient() {
  const [adsConnected, setAdsConnected] = useState(false);
  const [spConnected, setSpConnected] = useState(false);
  const brand = useMemo(() => getBrand(), []);
  const adsUrl = useMemo(() => buildAdsAuthorizeUrl(brand), [brand]);

  useEffect(() => {
    const ck = document.cookie.split(";").map((s) => s.trim());
    setAdsConnected(ck.some((c) => c.startsWith("ads_connected=1")));
    setSpConnected(ck.some((c) => c.startsWith("spapi_connected=1")));
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-3xl grid gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-semibold">Connect Your Accounts</h1>
          <p className="text-neutral-600 mt-2">
            For now, only <span className="font-medium">Amazon Ads</span> is required to enter the dashboard. SP-API is optional.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          {/* Amazon Ads */}
          <div className="rounded-2xl shadow-sm border bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Amazon Ads API</h2>
              {adsConnected ? (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Connected</span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Required</span>
              )}
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              Authorize campaign access so Hespor can show your Ads dashboard and run optimizations.
            </p>

            {!adsConnected ? (
              <a
                href={adsUrl}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 border bg-black text-white hover:opacity-90 transition"
              >
                Connect Amazon Ads
              </a>
            ) : (
              <Link
                href={`/dashboard?brand=${encodeURIComponent(brand)}`}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 border bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Continue to Dashboard
              </Link>
            )}

            <p className="text-[11px] text-neutral-500 mt-3">Brand: {brand}</p>
          </div>

          {/* SP-API */}
          <div className="rounded-2xl shadow-sm border bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold">Amazon SP-API</h2>
              {spConnected ? (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Connected</span>
              ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">Optional</span>
              )}
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              SP-API lets us pull catalog, orders, and inventory. You can add it later — not required to view the dashboard today.
            </p>

            <button
              disabled
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 border bg-neutral-200 text-neutral-500 cursor-not-allowed"
              title="We’ll enable this when your SP-API app is public."
            >
              Connect SP-API (disabled)
            </button>

            <p className="text-[11px] text-neutral-500 mt-3">Brand: {brand}</p>
          </div>
        </section>

        {!adsConnected && (
          <p className="text-center text-sm text-neutral-600">
            Once Ads is connected, you can enter the dashboard immediately — no SP-API needed for now.
          </p>
        )}
      </div>
    </main>
  );
}
