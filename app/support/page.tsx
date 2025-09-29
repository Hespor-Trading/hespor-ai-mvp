// app/support/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | HESPOR",
  description:
    "Get help with HESPOR. Contact support@hespor.com or read quick answers to common questions.",
  alternates: { canonical: "https://app.hespor.com/support" },
};

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-emerald-50">
      {/* Header / Hero */}
      <section className="px-6 md:px-10 py-12 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-900">We’re here to help</h1>
        <p className="mt-3 text-emerald-900/80">
          Reach us anytime at{" "}
          <a
            className="font-semibold underline decoration-emerald-600 underline-offset-4"
            href="mailto:support@hespor.com"
          >
            support@hespor.com
          </a>. We typically reply within 1 business day.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="px-6 md:px-10 pb-12 max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Email support</h2>
          <p className="mt-2 text-sm text-gray-600">
            Best for account questions, billing, and help using the app.
          </p>
          <a
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 transition"
            href="mailto:support@hespor.com?subject=HESPOR%20Support%20Request"
          >
            Email support@hespor.com
          </a>
          <p className="mt-3 text-xs text-gray-500">
            Hours: Mon–Fri, 9:00–17:00 (PT). SLA: first reply within 24h.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">System status</h2>
          <p className="mt-2 text-sm text-gray-600">
            Check if HESPOR services are operating normally.
          </p>
          <a
            className="mt-4 inline-block rounded-lg border border-emerald-600 px-4 py-2 text-emerald-700 font-medium hover:bg-emerald-50 transition"
            href="https://app.hespor.com/status"
          >
            View status page
          </a>
          <p className="mt-3 text-xs text-gray-500">
            Don’t have a status page yet? This can point to a simple “All systems
            operational” page for now.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Documentation</h2>
          <p className="mt-2 text-sm text-gray-600">
            Quick start, billing, and connection guides.
          </p>
          <a
            className="mt-4 inline-block rounded-lg border border-emerald-600 px-4 py-2 text-emerald-700 font-medium hover:bg-emerald-50 transition"
            href="https://app.hespor.com/help"
          >
            Open Help Center
          </a>
          <p className="mt-3 text-xs text-gray-500">
            You can start with a single page FAQ and grow over time.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 md:px-10 pb-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-emerald-900">Frequently asked questions</h2>
        <div className="mt-6 divide-y rounded-2xl bg-white shadow">
          <details className="group p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="font-medium">How do I connect Amazon Ads and SP-API?</span>
              <span className="text-gray-400 group-open:rotate-180 transition">⌄</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600">
              Sign in, go to <strong>Connect</strong>, click <em>Authorize Amazon Ads</em> and
              <em> Authorize SP-API</em>. After allowing access, you’ll return to HESPOR and
              the connected item will turn green.
            </p>
          </details>

          <details className="group p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="font-medium">I can’t authorize SP-API. What should I do?</span>
              <span className="text-gray-400 group-open:rotate-180 transition">⌄</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600">
              If you see MD1000 or “Unable to find application”, it usually means the app
              listing is still under Amazon review. Please try again later or email us.
            </p>
          </details>

          <details className="group p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="font-medium">Billing & refunds</span>
              <span className="text-gray-400 group-open:rotate-180 transition">⌄</span>
            </summary>
            <p className="mt-3 text-sm text-gray-600">
              Billing is handled securely via Stripe. For refund questions, contact
              <a className="underline ml-1" href="mailto:support@hespor.com">support@hespor.com</a>.
            </p>
          </details>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          See also our{" "}
          <a className="underline" href="/terms">Terms</a> and{" "}
          <a className="underline" href="/privacy">Privacy Policy</a>.
        </p>
      </section>
    </main>
  );
}
