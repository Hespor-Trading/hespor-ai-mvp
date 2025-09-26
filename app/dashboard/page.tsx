"use client";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold mb-2">HESPOR Automation</h2>
          <p className="text-sm text-gray-600 mb-4">
            Connect your Amazon account to enable Ads & SP-API. By connecting, you agree to our{" "}
            <a href="/terms" className="text-emerald-600 underline">Terms & Conditions</a>.
          </p>
          <Link href="/connect" className="inline-block rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
            Connect now
          </Link>
        </div>
      </div>
    </div>
  );
}
