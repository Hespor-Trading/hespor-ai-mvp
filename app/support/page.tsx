import Image from "next/image";

export const dynamic = "force-static";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {/* Header with logo + title */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo.png" // make sure your logo is in /public/logo.png
          alt="Hespor logo"
          width={40}
          height={40}
        />
        <h1 className="text-3xl font-bold text-emerald-700">Hespor Support</h1>
      </div>

      <p className="text-neutral-600 mb-8">
        Need help with Seller Engine (SP-API) or Ads Automation? We’re here.
      </p>

      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-emerald-700">Contact</h2>
          <ul className="mt-2 list-disc pl-6 text-neutral-700">
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
          <p className="mt-2 text-neutral-700">Mon–Fri, 9:00–17:00 (Pacific Time)</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">Status</h2>
          <p className="mt-2 text-neutral-700">
            Service status and incidents are posted on our dashboard inside the app and via email if
            customer-impacting.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-emerald-700">Policies</h2>
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
          <h2 className="text-xl font-semibold text-emerald-700">Address</h2>
          <p className="mt-2 text-neutral-700">Hespor Trading Ltd., Vancouver, BC, Canada</p>
        </div>
      </section>

      <footer className="mt-12 text-sm text-neutral-500">
        © {new Date().getFullYear()} Hespor Trading Ltd.
      </footer>
    </main>
  );
}
