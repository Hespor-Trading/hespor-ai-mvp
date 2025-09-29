// app/support/page.tsx
export const dynamic = "force-static";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-emerald-600">
      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          {/* Put your logo at /public/logo.png or /public/logo.svg */}
          <img src="/logo.png" alt="Hespor Logo" className="h-10 w-10" />
          <h1 className="text-3xl font-bold text-white">Hespor Support</h1>
        </div>

        {/* Card */}
        <section className="rounded-2xl bg-white p-8 shadow">
          <p className="text-neutral-700">
            Need help with Seller Engine (SP-API) or Ads Automation? We’re here.
          </p>

          <div className="mt-8 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-emerald-700">Contact</h2>
              <ul className="mt-2 list-disc pl-6 text-neutral-800">
                <li>
                  Email:{" "}
                  <a className="underline text-emerald-700" href="mailto:support@hespor.com">
                    support@hespor.com
                  </a>
                </li>
                <li>Response time: within 2 business days</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-700">Support Hours</h2>
              <p className="mt-2 text-neutral-800">Mon–Fri, 9:00–17:00 (Pacific Time)</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-700">Status</h2>
              <p className="mt-2 text-neutral-800">
                Service status and incidents are posted on our dashboard inside the app and via
                email if customer-impacting.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-700">Policies</h2>
              <ul className="mt-2 list-disc pl-6 text-neutral-800">
                <li><a className="underline text-emerald-700" href="/privacy">Privacy Policy</a></li>
                <li><a className="underline text-emerald-700" href="/terms">Terms of Service</a></li>
                <li><a className="underline text-emerald-700" href="/security">Security Overview</a></li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-emerald-700">Address</h2>
              <p className="mt-2 text-neutral-800">Hespor Trading Ltd., Vancouver, BC, Canada</p>
            </div>
          </div>
        </section>

        <footer className="mt-6 text-sm text-white/80">
          © {new Date().getFullYear()} Hespor Trading Ltd.
        </footer>
      </main>
    </div>
  );
}
