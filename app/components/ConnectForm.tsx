"use client";

import { useState } from "react";

export default function ConnectForm() {
  const [brand, setBrand] = useState("");
  const [acos, setAcos] = useState("25");
  const [asin, setAsin] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stop the page from refreshing
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand, acos, asin }),
      });

      const data = await res.json();
      console.log("API response:", data);

      // ✅ If backend gives a Stripe URL, go there
      if (data?.url && data.url.startsWith("http")) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed: no URL returned.");
      }
    } catch (err) {
      alert("Something went wrong. Check console logs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 max-w-md">
      <input
        required
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className="border p-2"
      />
      <input
        required
        placeholder="ACOS"
        value={acos}
        onChange={(e) => setAcos(e.target.value)}
        className="border p-2"
      />
      <input
        placeholder="ASIN"
        value={asin}
        onChange={(e) => setAsin(e.target.value)}
        className="border p-2"
      />
      <button type="submit" disabled={loading} className="border p-2">
        {loading ? "Connecting..." : "Connect"}
      </button>
    </form>
  );
}
