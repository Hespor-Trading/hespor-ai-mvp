"use client";

import { useState } from "react";

export default function Home() {
  const [brand, setBrand] = useState("");
  const [acos, setAcos] = useState("25");
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      // MUST match the API route in step 2
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, acos, asin }),
      });

      const data = await res.json();

      // Only navigate if we got a real URL
      if (res.ok && typeof data?.url === "string" && data.url.startsWith("http")) {
        window.location.assign(data.url); // go to Stripe
      } else {
        setErr(data?.error || "Could not start checkout.");
      }
    } catch {
      setErr("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Connect your brand</h1>

      {/* IMPORTANT: this is a plain form with a submit handler */}
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          required
          placeholder="Brand (e.g., DECOGAR)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border rounded p-2"
        />
        <input
          required
          placeholder="Breakeven ACOS (%)"
          value={acos}
          onChange={(e) => setAcos(e.target.value)}
          className="border rounded p-2"
          inputMode="numeric"
        />
        <input
          placeholder="Primary ASIN (optional)"
          value={asin}
          onChange={(e) => setAsin(e.target.value)}
          className="border rounded p-2"
        />

        {/* DO NOT wrap this in <Link>. No href. */}
        <button type="submit" disabled={loading} className="border rounded p-2">
          {loading ? "Connecting..." : "Connect"}
        </button>

        {err && <p className="text-red-600">{err}</p>}
      </form>
    </main>
  );
}
