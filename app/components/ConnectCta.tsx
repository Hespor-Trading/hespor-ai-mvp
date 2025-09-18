ChatGPT said:

Perfect 👍 I’ll keep this super simple. You don’t need to search your whole project — I’ll give you one exact recipe that works.

Step 1 — Create the new button component

On GitHub website (no VS Code needed):

Go to your project repo.

Click Add file → Create new file.

Name the file:
app/components/ConnectCta.tsx

Paste this code:

"use client";

export default function ConnectCta() {
  async function startCheckout() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: "DEMO",
        acos: "25",
        asin: "",
      }),
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
      className="rounded-xl px-4 py-2 bg-green-400"
    >
      Connect to Hespor AI Advertising
    </button>
  );
}
