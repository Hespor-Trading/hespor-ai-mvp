"use client";

export default function ConnectCta() {
  async function startCheckout() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand: "DEMO", acos: "25", asin: "" }),
    });

    const data = await res.json();

    if (res.ok && typeof data?.url === "string" && data.url.startsWith("http")) {
      window.location.assign(data.url); // go to Stripe
    } else {
      alert(data?.error || "Could not start checkout.");
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      className="rounded-xl px-4 py-2 bg-emerald-400 text-black font-semibold"
    >
      Connect to Hespor AI Advertising
    </button>
  );
}
