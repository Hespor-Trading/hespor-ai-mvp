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
      window.location.assign(data.url);
    } else {
      alert(data?.error || "Could not start checkout.");
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      style={{
        background: "linear-gradient(90deg,#10b981,#34d399)",
        color: "#052e2b",
        fontWeight: 700,
        padding: "12px 18px",
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
      }}
    >
      Connect to Hespor Algorithm – Advertising Optimization
    </button>
  );
}
