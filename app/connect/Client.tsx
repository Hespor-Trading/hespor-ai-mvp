"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";

/**
 * Professional emerald theme to match your auth pages.
 * Buttons launch the proper OAuth/consent URLs.
 */
export default function Client() {
  const [loading, setLoading] = useState<"ads" | "sp" | null>(null);

  // ----- Build Ads API OAuth URL (Login with Amazon) -----
  const adsUrl = useMemo(() => {
    // Prefer a prebuilt URL if you set it in envs
    const preset = process.env.NEXT_PUBLIC_ADS_OAUTH_URL;
    if (preset && preset.trim().length > 0) return preset;

    const clientId =
      process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID ||
      process.env.ADS_LWA_CLIENT_ID ||
      "";
    const redirect =
      process.env.NEXT_PUBLIC_AMAZON_ADS_REDIRECT ||
      process.env.AMZN_ADS_REDIRECT ||
      "";
    const scope = "advertising::campaign_management";
    const state = Math.random().toString(36).slice(2);

    // NA default; if you need EU/FE, set NEXT_PUBLIC_ADS_OAUTH_URL instead.
    const base = "https://www.amazon.com/ap/oa";

    const url =
      `${base}?client_id=${encodeURIComponent(clientId)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirect)}` +
      `&state=${encodeURIComponent(state)}`;

    return url;
  }, []);

  // ----- Build SP-API OAuth URL (Seller Central consent) -----
  const spUrl = useMemo(() => {
    // Prefer prebuilt URL if you set it in envs
    const preset = process.env.NEXT_PUBLIC_SP_OAUTH_URL;
    if (preset && preset.trim().length > 0) return preset;

    const appId =
      process.env.NEXT_PUBLIC_SP_APP_ID || process.env.SP_APP_ID || "";
    const region = (process.env.SP_REGION || "NA").toLowerCase();

    // Choose a sensible default host per region
    let host = "sellercentral.amazon.com"; // NA
    if (region.startsWith("eu")) host = "sellercentral-europe.amazon.com";
    if (region.startsWith("fe") || region.includes("jp"))
      host = "sellercentral.amazon.co.jp";

    const state = Math.random().toString(36).slice(2);

    return `https://${host}/apps/authorize/consent?application_id=${encodeURIComponent(
      appId
    )}&state=${encodeURIComponent(state)}&version=beta`;
  }, []);

  const openAds = useCallback(() => {
    setLoading("ads");
    window.location.assign(adsUrl);
  }, [adsUrl]);

  const openSp = useCallback(() => {
    setLoading("sp");
    window.location.assign(spUrl);
  }, [spUrl]);

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900">
      {/* Page container */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Connect</h1>
          <p className="text-slate-600 mt-1">
            Step 3 of 4 · Connect your accounts to continue.
          </p>
        </header>

        {/* Card */}
        <div className="rounded-2xl bg-white shadow-md p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Ads API — required */}
            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Amazon Ads API</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Required
                </span>
              </div>
              <p className="text-slate-600 mt-2">
                Authorize with Amazon so we can read your advertising data and
                manage campaigns as permitted.
              </p>

              <button
                onClick={openAds}
                disabled={!adsUrl || loading === "ads"}
                className="mt-4 w-full rounded-xl bg-emerald-600 text-white px-4 py-3 font-medium hover:opacity-90 disabled:opacity-60"
              >
                {loading === "ads" ? "Opening Amazon…" : "Connect Amazon Ads"}
              </button>

              <p className="text-xs text-slate-500 mt-2">
                If the button doesn’t redirect,{" "}
                <a
                  href={adsUrl || "#"}
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  open the Amazon consent page in a new tab
                </a>
                .
              </p>
            </div>

            {/* SP-API — optional */}
            <div className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Amazon SP-API</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border">
                  Optional
                </span>
              </div>
              <p className="text-slate-600 mt-2">
                Connect Selling Partner API for catalog, orders, and other store
                data.
              </p>

              <button
                onClick={openSp}
                disabled={!spUrl || loading === "sp"}
                className="mt-4 w-full rounded-xl bg-white text-slate-900 border px-4 py-3 font-medium hover:bg-slate-50 disabled:opacity-60"
              >
                {loading === "sp" ? "Opening Seller Central…" : "Connect SP-API"}
              </button>

              <p className="text-xs text-slate-500 mt-2">
                If the button doesn’t redirect,{" "}
                <a
                  href={spUrl || "#"}
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  open Seller Central consent in a new tab
                </a>
                .
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-slate-100" />

          {/* Continue to Dashboard */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-slate-700 font-medium">All set?</p>
              <p className="text-slate-500 text-sm">
                You can go to your dashboard any time.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="rounded-xl bg-emerald-600 text-white px-5 py-3 font-medium hover:opacity-90"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-slate-500 mt-6">
          Need help? Contact{" "}
          <a className="underline" href="mailto:support@hespor.com">
            support@hespor.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
