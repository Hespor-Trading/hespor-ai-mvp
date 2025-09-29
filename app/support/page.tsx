"use client";

export const dynamic = "force-static";
export const revalidate = 60;

export default function SupportCenter() {
  return (
    <main className="min-h-screen bg-emerald-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-gray-600 mb-8">
          Answers to common questions. If you still need help, email us at{" "}
          <a className="text-emerald-700 underline" href="mailto:support@hespor.com">support@hespor.com</a>.
        </p>

        <section className="space-y-4">
          <details className="rounded-xl bg-white p-4 shadow" open>
            <summary className="font-medium cursor-pointer">How do I connect Amazon Ads and SP-API?</summary>
            <div className="mt-2 text-gray-700">
              Go to <a className="underline text-emerald-700" href="/connect">/connect</a> and click each button. After you approve on Amazon you’ll be sent back automatically.
            </div>
          </details>

          <details className="rounded-xl bg-white p-4 shadow">
            <summary className="font-medium cursor-pointer">I see MD1000 “Unable to find application”.</summary>
            <div className="mt-2 text-gray-700">
              This appears while our SP-API public listing is under review. You can still self-authorize from Seller Central
              or try again once our listing is approved.
            </div>
          </details>

          <details className="rounded-xl bg-white p-4 shadow">
            <summary className="font-medium cursor-pointer">Billing & subscriptions</summary>
            <div className="mt-2 text-gray-700">
              Use the menu inside the app (Billing / Subscription) to update your card, upgrade, or downgrade.
            </div>
          </details>
        </section>
      </div>
    </main>
  );
}
