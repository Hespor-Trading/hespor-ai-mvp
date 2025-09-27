"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function ConnectPage() {
  const router = useRouter();
  const search = useSearchParams();

  const [uid, setUid] = useState<string | null>(null);
  const [adsOk, setAdsOk] = useState(false);
  const [spOk, setSpOk] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) Make sure user is signed in, then poll connection status briefly
  useEffect(() => {
    let timer: any;
    (async () => {
      const sb = supabaseBrowser();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return router.replace("/auth/sign-in");
      setUid(session.user.id);

      const check = async () => {
        const [{ data: a }, { data: s }] = await Promise.all([
          sb.from("amazon_ads_credentials").select("user_id").eq("user_id", session.user.id).maybeSingle(),
          sb.from("spapi_credentials").select("user_id").eq("user_id", session.user.id).maybeSingle(),
        ]);
        setAdsOk(!!a?.user_id);
        setSpOk(!!s?.user_id);
        setLoading(false);
      };

      await check();
      // After coming back from callbacks we may need a moment, so poll a few times
      timer = setInterval(check, 2000);
      setTimeout(() => clearInterval(timer), 15000);
    })();
    return () => clearInterval(timer);
  }, [router, search]);

  // 2) If both connected → go to dashboard with first-load flag
  useEffect(() => {
    if (uid && adsOk && spOk) router.replace("/dashboard?first=1");
  }, [uid, adsOk, spOk, router]);

  if (!uid || loading) return null;

  // Build OAuth URLs (NA)
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.hespor.com";

  // Amazon Ads LWA (includes state=uid so callback can attach even if session cookie is missing)
  const adsAuthUrl =
    "https://www.amazon.com/ap/oa"
    + `?client_id=${process.env.NEXT_PUBLIC_ADS_LWA_CLIENT_ID}`
    + "&scope=advertising%3A%3Acampaign_management"
    + "&response_type=code"
    + `&redirect_uri=${encodeURIComponent(`${base}/api/ads/callback`)}`
    + `&state=${encodeURIComponent(uid)}`;

  // SP-API Consent (Seller Central). Your app must be approved to work for external sellers.
  const spAuthUrl =
    "https://sellercentral.amazon.com/apps/authorize/consent"
    + `?application_id=${encodeURIComponent(process.env.NEXT_PUBLIC_SP_APP_ID as string)}`
    + `&state=${encodeURIComponent(uid)}`
    + `&redirect_uri=${encodeURIComponent(`${base}/api/sp/callback`)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-2">Connect your Amazon account</h1>
        <p className="text-gray-600 mb-8">
          Authorize access to Amazon Ads and the Selling Partner API. You can revoke access anytime in Amazon.
        </p>

        <div className="space-y-4">
          {/* ADS button */}
          <a
            href={adsAuthUrl}
            className={[
              "block w-full text-center rounded-lg border py-3 font-semibold transition",
              adsOk ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "hover:bg-gray-50",
              !adsOk ? "ring-2 ring-amber-300" : ""
            ].join(" ")}
          >
            {adsOk ? "✓ Amazon Ads connected" : "1) Authorize Amazon Ads"}
          </a>

          {/* SP-API button */}
          <a
            href={spAuthUrl}
            className={[
              "block w-full text-center rounded-lg border py-3 font-semibold transition",
              spOk ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "hover:bg-gray-50",
              !spOk ? "ring-2 ring-amber-300" : ""
            ].join(" ")}
          >
            {spOk ? "✓ SP-API connected" : "2) Authorize SP-API"}
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          By connecting, you accept our <a href="/terms" className="underline text-emerald-700">Terms</a> and{" "}
          <a href="/privacy" className="underline text-emerald-700">Privacy Policy</a>.
        </p>

        {!adsOk || !spOk ? (
          <p className="mt-4 text-sm text-gray-500">
            After you click <em>Allow</em> at Amazon, you’ll return here. The connected item will turn green;
            then connect the other one. Once both are connected you’ll be taken to your dashboard.
          </p>
        ) : null}
      </div>
    </div>
  );
}
