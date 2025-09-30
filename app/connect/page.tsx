"use client";

import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const router = useRouter();

  async function handleConnectAds() {
    await fetch("/api/events/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "connect_ads" }),
    });
    router.push("/api/ads/authorize");
  }

  async function handleConnectSpapi() {
    await fetch("/api/events/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "connect_spapi" }),
    });
    // TODO: add SP-API flow
    alert("SP-API connect not yet implemented.");
  }

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-xl p-8 space-y-6 text-center">
        <h1 className="text-xl font-semibold">Connect Your Accounts</h1>
        <button
          onClick={handleConnectAds}
          className="w-full rounded-lg bg-black text-white py-3 hover:opacity-90"
        >
          Connect Amazon Ads API
        </button>
        <button
          onClick={handleConnectSpapi}
          className="w-full rounded-lg bg-emerald-500 text-black py-3 hover:opacity-90"
        >
          Connect SP-API (optional)
        </button>
      </div>
    </div>
  );
}
