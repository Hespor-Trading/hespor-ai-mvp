// app/support/page.tsx
export const dynamic = "force-static";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Hespor Support</h1>
      <p className="mt-4 text-neutral-600">
        Need help with Seller Engine (SP-API) or Ads Automation? We’re here.
      </p>

      <section className="mt-8 space-y-4">
        <div>
          <h2 className="text-xl font-medium">Contact</h2>
          <ul className="mt-2 list-disc pl-6">
            <li>Email: <a className="underline" href="mailto:support@hespor.com">support@hespor.com</a></li>
            <li>Response time: within 2 business days</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-medium">Support Hours</h2>
          <p className="mt-2">Mon–Fri, 9:00–17:00 (Pacific Time)</p>
        </div>

        <div>
          <h2 className="text-xl font-medium">Status</h2>
          <p className="mt-2">
            Service status and incidents are posted on our dashboard inside the app and via email if customer-impacting.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-medium">Policies</h2>
          <ul className="mt-2 list-disc pl-6">
            <li><a className="underline" href="/privacy">Privacy Policy</a></li>
            <li><a className="underline" href="/terms">Terms of Service</a></li>
            <li><a className="underline" href="/security">Security Overview</a></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-medium">Address</h2>
          <p className="mt-2">Hespor Trading Ltd., Vancouver, BC, Canada</p>
        </div>
      </section>

      <footer className="mt-12 text-sm text-neutral-500">
        © {new Date().getFullYear()} Hespor Trading Ltd.
      </footer>
    </main>
  );
}
