"use client";

import Link from "next/link";

export default function Client() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl shadow-md bg-white p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Connect your accounts</h1>
        <p className="text-slate-600">
          You’re signed in. Continue by connecting your required services.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/connect/ads"
            className="rounded-xl border px-4 py-3 text-center hover:bg-slate-50"
          >
            Ads API (required)
          </Link>
          <Link
            href="/connect/sp"
            className="rounded-xl border px-4 py-3 text-center hover:bg-slate-50"
          >
            SP API (optional)
          </Link>
        </div>

        <div className="pt-4 border-t">
          <Link
            href="/dashboard"
            className="rounded-xl bg-emerald-600 text-white px-4 py-2 inline-block text-center hover:opacity-90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
