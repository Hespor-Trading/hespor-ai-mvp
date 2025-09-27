// app/connect/page.tsx
"use client";

const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com";

// AMAZON ADS (LWA) – NA region
const adsAuthUrl =
  "https://www.amazon.com/ap/oa" +
  `?client_id=${process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID}` +
  "&scope=advertising%3A%3Acampaign_management" +
  "&response_type=code" +
  `&redirect_uri=${encodeURIComponent(`${base}/api/ads/callback`)}`;

export default function ConnectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold mb-3">Connect your Amazon account</h1>
        <p className="text-gray-600 mb-6">
          Authorize access to Amazon Ads and the Selling Partner API.
        </p>

        {/* 1) AMAZON ADS */}
        <a href={adsAuthUrl} className="block w-full mb-3 rounded-lg border py-3 text-center font-semibold">
          1) Authorize Amazon Ads
        </a>

        {/* 2) SP-API (your existing starter route) */}
        <a href="/api/spapi/login" className="block w-full rounded-lg border py-3 text-center font-semibold">
          2) Authorize SP-API
        </a>
      </div>
    </div>
  );
}
