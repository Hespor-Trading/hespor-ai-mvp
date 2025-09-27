"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function Connect() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return router.replace("/auth/sign-in");
      setUid(user.id);

      // already connected? jump to dashboard
      const { data: ads } = await sb.from("amazon_ads_credentials").select("user_id").eq("user_id", user.id).maybeSingle();
      const { data: sp }  = await sb.from("spapi_credentials").select("user_id").eq("user_id", user.id).maybeSingle();
      if (ads && sp) return router.replace("/dashboard");

      setChecking(false);
    })();
  }, [router]);

  if (checking || !uid) return null;

  // ----- Build URLs (no secrets exposed) -----
  const ADS_CLIENT_ID = process.env.NEXT_PUBLIC_AMAZON_ADS_CLIENT_ID || "";
  const ADS_REDIRECT  = process.env.NEXT_PUBLIC_AMAZON_ADS_REDIRECT  || "https://app.hespor.com/api/ads/callback";
  const adsAuthUrl =
    `https://www.amazon.com/ap/oa?client_id=${encodeURIComponent(ADS_CLIENT_ID)}` +
    `&scope=${encodeURIComponent("advertising::campaign_management")}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(ADS_REDIRECT)}` +
    `&state=${encodeURIComponent(uid)}`;

  const SP_APP_ID     = process.env.NEXT_PUBLIC_SP_APP_ID || "";
  const SP_REDIRECT   = process.env.NEXT_PUBLIC_SP_REDIRECT || "https://app.hespor.com/api/sp/callback";
  const spAuthUrl =
    `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${encodeURIComponent(SP_APP_ID)}` +
    `&state=${encodeURIComponent(uid)}` +
    `&redirect_uri=${encodeURIComponent(SP_REDIRECT)}` +
    `&version=beta`;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-lg mx-auto rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold mb-2">Connect your Amazon account</h1>
        <p className="text-gray-600 mb-6">
          Authorize access to Amazon Ads and the Selling Partner API. You can revoke access anytime in Amazon.
        </p>

        <div className="space-y-3">
          <a href={ADS_CLIENT_ID ? adsAuthUrl : "#"} className={`block w-full rounded-lg border px-4 py-2 text-center font-medium ${ADS_CLIENT_ID ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}>
            1) Authorize Amazon Ads
          </a>
          <a href={SP_APP_ID ? spAuthUrl : "#"} className={`block w-full rounded-lg border px-4 py-2 text-center font-medium ${SP_APP_ID ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}>
            2) Authorize SP-API
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          By connecting, you accept our <a className="text-emerald-600 underline" href="/terms">Terms</a> and <a className="text-emerald-600 underline" href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
