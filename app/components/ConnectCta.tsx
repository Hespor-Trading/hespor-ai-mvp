"use client";

export default function ConnectCta() {
  async function startCheckout() {
    // Read values from inputs on the page if they exist, otherwise use safe defaults
    const brand = (document.getElementById("brand") as HTMLInputElement)?.value || "DEMO";
    const acos  = (document.getElementById("acos")  as HTMLInputElement)?.value || "25";
    const asin  = (document.getElementById("asin")  as HTMLInputElement)?.value || "";

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, acos, asin }),
    });

    const data = await res.json();

    if (res.ok && typeof data?.url === "string" && data.url.startsWith("http")) {
      window.location.assign(data.url);            // ✅ go to Stripe
    } else {
      alert(data?.error || "Could not start checkout.");
    }
  }

  return (
    // IMPORTANT: no href here, and type="button" so it doesn't auto-navigate
    <button type="button" onClick={startCheckout} className="rounded-xl px-4 py-2">
      Connect to Hespor AI Advertising
    </button>
  );
}
