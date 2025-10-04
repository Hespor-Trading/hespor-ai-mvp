"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

/**
 * Emerald theme to match auth pages; buttons launch OAuth consent pages.
 */
export default function Client() {
  const [loading, setLoading] = useState<"ads" | "sp" | null>(null);

  // ----- Amazon Ads (Login With Amazon) OAuth URL -----
  const adsUrl = useMemo(() => {
    const preset = (process.env.NEXT_PUBLIC_ADS_OAUTH_URL as string) || "";
    if (preset) return preset;

    const clientId =
      (process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID as string) ||
      (process.env.ADS_LWA_CLIENT_ID as string) ||
      "";
    const redirect =
      (process.env.NEXT_PUBLIC_AMAZON_ADS_REDIRECT as string) ||
      (process.env.AMZN_ADS_REDIRECT as string) ||
      "";
    const scope = "advertising::campaign_management";
    const state = Math.random().toString(36).slice(2);
    const base = "https://www.amazon.com/ap/oa"; // adjust to region if needed

    if (!clientId || !redirect) return "";

    return (
      `${base}?client_id=${encodeURIComponent(clientId)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirect)}` +
      `&state=${encodeURIComponent(state)}`
    );
  }, []);

  // ----- SP-API OAuth URL -----
  const spUrl = useMemo(() => {
    const preset = (process.env.NEXT_PUBLIC_SP_OAUTH_URL as string) || "";
    if (preset) return preset;

    const appId =
      (process.env.NEXT_PUBLIC_SP_APP_ID as string) ||
      (process.env.SP_APP_ID as string) ||
      "";
    const region = ((process.env.SP_REGION as string) || "NA").toLowerCase();

    if (!appId) return "";

    let host = "sellercentral.amazon.com"; // NA default
    if (region.startsWith("eu")) host = "sellercentral-europe.amazon.com";
    if (region.startsWith("fe") || region.includes("jp")) host = "sellercentral.amazon.co.jp";

    const state = Math.random().toString(36).slice(2);

    return `https://${host}/apps/authorize/consent?application_id=${encodeURIComponent(
      appId
    )}&state=${encodeURIComponent(state)}&version=beta`;
  }, []);

  const openAds = useCallback(() => {
    if (!adsUrl) return;
    setLoading("ads");
    window.location.assign(adsUrl);
  }, [adsUrl]);

  const openSp = useCallback(() => {
    if (!spUrl) return;
    setLoading("sp");
    window.location.assign(spUrl);
  }, [spUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-600 text-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl p-6 md:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Connect your accounts</h1>
          <p className="text-slate-600 mt-1">Step 3 of 4 — connect required services to continue.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Ads API — required */}
          <div className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Amazon Ads API</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Required
              </span>
            </div>
            <p className="text-slate-600 mt-2">
              Authorize with Amazon so we can read advertising data and manage campaigns as allowed.
            </p>

            <button
              onClick={openAds}
              disabled={!adsUrl || loading === "ads"}
              className="mt-4 w-full rounded-xl bg-emerald-600 text-white px-4 py-3 font-medium hover:opacity-90 disabled:opacity-60"
            >
              {loading === "ads" ? "Opening Amazon…" : "Connect Amazon Ads"}
            </button>

            {!adsUrl && (
              <p className="text-xs text-red-600 mt-2">
                Missing NEXT_PUBLIC_ADS_LWA_CLIENT_ID or NEXT_PUBLIC_AMAZON_ADS_REDIRECT.
              </p>
            )}
          </div>

          {/* SP-API — optional */}
          <div className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Amazon SP-API</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border">
                Optional
              </span>
            </div>
            <p className="text-slate-600 mt-2">
              Connect Selling Partner API for catalog, orders, and other store data.
            </p>

            <button
              onClick={openSp}
              disabled={!spUrl || loading === "sp"}
              className="mt-4 w-full rounded-xl bg-white text-slate-900 border px-4 py-3 font-medium hover:bg-slate-50 disabled:opacity-60"
            >
              {loading === "sp" ? "Opening Seller Central…" : "Connect SP-API"}
            </button>

            {!spUrl && (
              <p className="text-xs text-red-600 mt-2">
                Missing NEXT_PUBLIC_SP_APP_ID (and optional SP_REGION).
              </p>
            )}
          </div>
        </div>

        <div className="my-6 h-px bg-slate-100" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-slate-700 font-medium">All set?</p>
            <p className="text-slate-500 text-sm">You can go to your dashboard any time.</p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-xl bg-emerald-600 text-white px-5 py-3 font-medium hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
