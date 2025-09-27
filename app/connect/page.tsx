"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function ConnectPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data: { session } } = await sb.auth.getSession();

      if (!session) {
        // not logged in → go to sign-in first
        router.replace("/auth/sign-in?next=/connect");
        return;
      }
      setReady(true);
    })();
  }, [router]);

  if (!ready) return null; // or a spinner

  // ---------- your existing UI below ----------
  return (
    <main className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-3">Connect your Amazon account</h1>
        <p className="text-gray-600 mb-6">
          Authorize access to Amazon Ads and the Selling Partner API. You can
          revoke access anytime in Amazon.
        </p>

        <div className="space-y-3">
          <a
            className="block rounded-lg border px-4 py-3 text-center hover:bg-gray-50"
            href={
              "https://www.amazon.com/ap/oa"
              + `?client_id=${process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID}`
              + "&scope=advertising%3A%3Acampaign_management"
              + "&response_type=code"
              + `&redirect_uri=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"}/api/ads/callback`
                )}`
            }
          >
            1) Authorize Amazon Ads
          </a>

          <a
            className="block rounded-lg border px-4 py-3 text-center hover:bg-gray-50"
            href={
              "https://sellercentral.amazon.com/apps/authorize/consent"
              + `?application_id=${process.env.NEXT_PUBLIC_SPAPI_APP_ID}`
              + `&redirect_uri=${encodeURIComponent(
                  `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com"}/api/spapi/callback`
                )}`
              + `&state=${crypto.randomUUID()}`
            }
          >
            2) Authorize SP-API
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          By connecting, you accept our{" "}
          <a className="text-emerald-700 underline" href="/terms">Terms</a> and{" "}
          <a className="text-emerald-700 underline" href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}
