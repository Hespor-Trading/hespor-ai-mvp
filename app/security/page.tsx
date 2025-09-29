// app/security/page.tsx
export const dynamic = "force-static";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-emerald-600">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex items-center gap-3 mb-8">
          <img
            src="/logo.png"
            onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }}
            alt="Hespor Logo"
            className="h-10 w-10"
          />
          <h1 className="text-3xl font-bold text-white">Security Overview</h1>
        </div>

        <section className="rounded-2xl bg-white p-8 shadow space-y-6">
          <p className="text-neutral-700">
            We take security seriously. This page summarizes our current practices.
          </p>
          <div>
            <h2 className="text-xl font-semibold text-emerald-700">Data Handling</h2>
            <ul className="list-disc pl-6 text-neutral-800 mt-2">
              <li>PII access limited to what’s required to provide services.</li>
              <li>Credentials stored in AWS Secrets Manager; least-privilege IAM.</li>
              <li>Encrypted in transit (TLS) and at rest (AWS-managed keys).</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-emerald-700">Application Security</h2>
            <ul className="list-disc pl-6 text-neutral-800 mt-2">
              <li>Role-segregated Lambda functions; S3 bucket access scoped per brand.</li>
              <li>EventBridge schedules; CloudWatch audit logs retained.</li>
              <li>Idempotent applier with action ledger in S3.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-emerald-700">Reporting a Vulnerability</h2>
            <p className="text-neutral-800 mt-2">
              Email <a className="underline text-emerald-700" href="mailto:security@hespor.com">security@hespor.com</a>.
              We acknowledge within 2 business days.
            </p>
          </div>
        </section>

        <footer className="mt-6 text-sm text-white/80">
          © {new Date().getFullYear()} Hespor Trading Ltd.
        </footer>
      </main>
    </div>
  );
}
