"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function Connect() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) return router.replace("/auth/sign-in");

      // If already connected (any credential rows), go to loading then dashboard
      const { data: ads } = await sb.from("amazon_ads_credentials").select("user_id").eq("user_id", user.id).maybeSingle();
      const { data: sp }  = await sb.from("spapi_credentials").select("user_id").eq("user_id", user.id).maybeSingle();

      if (ads || sp) {
        router.replace("/loading");
        setTimeout(() => router.replace("/dashboard"), 1200);
        return;
      }
      setChecking(false);
    })();
  }, [router]);

  if (checking) return null;

  const ADS_URL  = process.env.NEXT_PUBLIC_ADS_OAUTH_URL;  // you already created these
  const SP_URL   = process.env.NEXT_PUBLIC_SP_OAUTH_URL;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-lg mx-auto rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold mb-2">Connect your Amazon account</h1>
        <p className="text-gray-600 mb-6">
          We’ll request access to Amazon Ads and the Selling Partner API to fetch your data. You
          can revoke access anytime in your Amazon settings.
        </p>

        <div className="space-y-3">
          <a
            href={ADS_URL || "#"}
            className={`block w-full rounded-lg border px-4 py-2 text-center font-medium ${ADS_URL ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
          >
            1) Authorize Amazon Ads
          </a>
          <a
            href={SP_URL || "#"}
            className={`block w-full rounded-lg border px-4 py-2 text-center font-medium ${SP_URL ? "hover:bg-gray-50" : "opacity-50 cursor-not-allowed"}`}
          >
            2) Authorize SP-API
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          By connecting, you accept our <a className="text-emerald-600 underline" href="/terms">Terms</a> and{" "}
          <a className="text-emerald-600 underline" href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
