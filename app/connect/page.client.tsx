"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function ConnectClient() {
  const router = useRouter();
  const [acos, setAcos] = useState("28");
  const [asin, setAsin] = useState("");

  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) router.replace("/auth/sign-in");
    })();
  }, [router]);

  const connectBoth = async () => {
    // save user prefs before redirecting to auth flows
    await fetch("/api/bootstrap/prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ breakEvenAcos: acos, primaryAsin: asin })
    });
    // go to your “universal connect” route that chains SP + Ads auth
    window.location.href = "/api/connect/start";
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Connect your Amazon accounts</h1>
      <p className="mt-2 text-neutral-600">
        We’ll link SP-API and Amazon Ads, then activate optimization.
      </p>

      <div className="mt-8 grid gap-4">
        <label className="block">
          <span className="text-sm text-neutral-700">Break-even ACOS (%)</span>
          <input
            value={acos}
            onChange={(e) => setAcos(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="e.g., 28"
            inputMode="numeric"
          />
        </label>

        <label className="block">
          <span className="text-sm text-neutral-700">Primary ASIN</span>
          <input
            value={asin}
            onChange={(e) => setAsin(e.target.value.trim())}
            className="mt-1 w-full rounded-md border px-3 py-2"
            placeholder="e.g., B0XXXXX123"
          />
        </label>

        <button
          onClick={connectBoth}
          className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white"
        >
          Connect SP-API & Ads
        </button>

        <p className="text-sm text-neutral-500">
          By continuing, you agree to our <a className="underline" href="/terms">Terms</a> and <a className="underline" href="/privacy">Privacy</a>.
        </p>

        <div className="mt-8 rounded-lg border p-4 bg-white">
          <h2 className="font-medium">Need help?</h2>
          <ul className="list-disc pl-5 text-sm mt-2">
            <li><a className="underline" href="/support">Support</a></li>
            <li>Email: <a className="underline" href="mailto:support@hespor.com">support@hespor.com</a></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
