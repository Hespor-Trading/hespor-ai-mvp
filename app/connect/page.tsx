"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function ConnectPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // read user; if not logged in → go to sign-in
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabaseBrowser().auth.getSession();
      if (!session) return router.replace("/auth/sign-in");
      setUserId(session.user.id);
    })();
  }, [router]);

  if (!userId) return null;

  // Build OAuth URLs (NA region)
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com";

  // Amazon Ads LWA — include state=userId so the callback can attach even if session is missing
  const adsAuthUrl =
    "https://www.amazon.com/ap/oa"
    + `?client_id=${process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID}`
    + "&scope=advertising%3A%3Acampaign_management"
    + "&response_type=code"
    + `&redirect_uri=${encodeURIComponent(`${base}/api/ads/callback`)}`
    + `&state=${encodeURIComponent(userId)}`;

  // SP-API LWA (Consent inside Seller Central)
  const spAuthUrl =
    "https://sellercentral.amazon.com/apps/authorize/consent"
    + `?application_id=${encodeURIComponent(process.env.NEXT_PUBLIC_SP_APP_ID as string)}`
    + `&state=${encodeURIComponent(userId)}`
    + `&redirect_uri=${encodeURIComponent(`${base}/api/sp/callback`)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-2">Connect your Amazon account</h1>
        <p className="text-gray-600 mb-8">
          Authorize access to Amazon Ads and the Selling Partner API. You can revoke access anytime in Amazon.
        </p>

        <div className="space-y-4">
          <a href={adsAuthUrl}
             className="block w-full text-center rounded-lg border py-3 font-semibold hover:bg-gray-50">
            1) Authorize Amazon Ads
          </a>

          <a href={spAuthUrl}
             className="block w-full text-center rounded-lg border py-3 font-semibold hover:bg-gray-50">
            2) Authorize SP-API
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          By connecting, you accept our <a href="/terms" className="underline text-emerald-700">Terms</a> and{" "}
          <a href="/privacy" className="underline text-emerald-700">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
