// app/support/page.tsx
import Image from "next/image";

export const dynamic = "force-static";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Header with logo + title */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo.png" // <-- put your logo in /public/logo.png
          alt="Hespor logo"
          width={40}
          height={40}
        />
        <h1 className="text-3xl font-semibold text-emerald-700 tracking-tight">
          Hespor Support
        </h1>
      </div>

      <p className="text-neutral-700">
        Need help with Seller Engine (SP-API) or Ads Automation? We’re here.
      </p>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-medium text-emerald-600">Contact</h2>
          <ul className="mt-2 list-disc pl-6 text-neutral-700">
            <li>
              Email:{" "}
              <a
                className="underline text-emerald-700"
                href="mailto:support@hespor.com"
              >
                support@hespor.com
              </a>
            </li>
            <li>Response time: within 2 business days</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-medium text-emerald-600">Support Hours</h2>
          <p className="mt-2 text-neutral-700">Mon–Fri, 9:00–17:00 (Pacific Time)</p>
        </div>

        <div>
          <h2 className="text-xl font-medium text-emerald-600">Status</h2>
          <p className="mt-2 text-neutral-700">
            Service status and incidents are posted on our dashboard inside the
            app and via email if customer-impacting.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium text-emerald-600">Policies</h2>
          <ul className="mt-2 list-disc pl-6 text-neutral-700">
            <li>
              <a className="underline text-emerald-700" href="/privacy">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="underline text-emerald-700" href="/terms">
                Terms of Service
              </a>
            </li>
            <li>
              <a className="underline text-emerald-700" href="/security">
                Security Overview
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-medium text-emerald-600">Address</h2>
          <p className="mt-2 text-neutral-700">
            Hespor Trading Ltd., Vancouver, BC, Canada
          </p>
        </div>
      </section>

      <footer className="mt-12 text-sm text-neutral-500">
        © {new Date().getFullYear()} Hespor Trading Ltd.
      </footer>
    </main>
  );
}
