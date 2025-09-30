"use client";

import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const router = useRouter();

  async function track(action: string) {
    try {
      await fetch("/api/events/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    } catch {
      // ignore tracking errors in UI
    }
  }

  async function onAds() {
    await track("connect_ads");
    router.push("/api/ads/authorize"); // server builds the URL from env
  }

  async function onSpapi() {
    await track("connect_spapi");
    alert("SP-API connect is coming soon.");
  }

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white/95 shadow-xl p-8 space-y-6 text-center">
        <h1 className="text-xl font-semibold">Connect Your Accounts</h1>

        <button
          onClick={onAds}
          className="w-full rounded-lg bg-black text-white py-3 hover:opacity-90"
        >
          Connect Amazon Ads API
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
