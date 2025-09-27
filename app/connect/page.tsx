"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function ConnectPage() {
  const router = useRouter();

  // 1) Only allow logged-in users here
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabaseBrowser().auth.getSession();
      if (!session) router.replace("/auth/sign-in");
    })();
  }, [router]);

  // 2) Build the two Amazon OAuth URLs
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com";

  // --- Amazon Ads (LWA Security Profile) ---
  // Uses your PUBLIC client id from env (safe to expose)
  const adsAuthUrl =
    "https://www.amazon.com/ap/oa"
    + `?client_id=${process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID}`
    + "&scope=advertising%3A%3Acampaign_management"
    + "&response_type=code"
    + `&redirect_uri=${encodeURIComponent(`${base}/api/ads/callback`)}`;

  // --- SP-API (Seller Central app) ---
  // Use your SP App ID from the SP app (safe to expose)
  const spAppId = process.env.NEXT_PUBLIC_SP_APP_ID; // set in Vercel
  const spAuthUrl =
    "https://sellercentral.amazon.com/apps/authorize/consent"
    + `?application_id=${encodeURIComponent(spAppId || "")}`
    + `&state=${crypto.randomUUID()}`
    + `&redirect_uri=${encodeURIComponent(`${base}/api/sp/callback`)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-3">Connect your Amazon account</h1>
        <p className="text-gray-600 mb-8">
          Authorize access to Amazon Ads and the Selling Partner API. You can revoke access anytime in Amazon.
        </p>

        <div className="space-y-4">
          <a
            href={adsAuthUrl}
            className="block w-full text-center rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
          >
            1) Authorize Amazon Ads
          </a>

          <a
            href={spAuthUrl}
            className="block w-full text-center rounded-lg border px-4 py-2 font-medium hover:bg-gray-50"
          >
            2) Authorize SP-API
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          By connecting, you accept our <a className="underline" href="/terms">Terms</a> and <a className="underline" href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
