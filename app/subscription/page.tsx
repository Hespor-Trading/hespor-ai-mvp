"use client";

export default function SubscriptionPage() {
  async function activatePro() {
    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.assign(data.url);
    else alert("Checkout is not configured yet.");
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <img src="/hespor-logo.png" className="h-7" alt="Hespor" />
        <h1 className="text-2xl font-semibold">Subscription</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border bg-white p-6">
          <div className="text-xs uppercase text-slate-500">Current plan</div>
          <div className="text-xl font-semibold mt-1">Free</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• 10 chatbot questions per week</li>
            <li>• Basic dashboard</li>
            <li>• Connect Amazon Ads</li>
          </ul>
        </div>

        <div className="rounded-2xl border bg-white p-6">
          <div className="text-xs uppercase text-slate-500">Upgrade</div>
          <div className="text-xl font-semibold mt-1">Pro</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• Unlimited chatbot questions</li>
            <li>• Engine actions (Applied Items)</li>
            <li>• Advanced charts & exports</li>
            <li>• Priority support</li>
          </ul>
          <button onClick={activatePro} className="mt-4 rounded-lg bg-emerald-500 text-black px-4 py-2">
            Activate Pro
          </button>
        </div>
      </div>
    </div>
  );
}
