import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ConnectStep from "@/components/ConnectStep";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function ConnectPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) {
    // middleware should handle redirect, but return null to satisfy types
    return null;
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [adsCred, spCred] = await Promise.all([
    admin.from("amazon_ads_credentials").select("refresh_token").eq("user_id", userId).maybeSingle(),
    admin.from("spapi_credentials").select("refresh_token").eq("user_id", userId).maybeSingle(),
  ]);

  const adsConnected = !!adsCred.data?.refresh_token;
  const spConnected = !!spCred.data?.refresh_token;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Connect your services</h1>
      <p className="text-gray-600">Connect both to get started. We’ll begin your first sync automatically.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <ConnectStep
          title="Amazon Ads"
          description="Authorize Hespor to read your Ads performance."
          connected={adsConnected}
          actionHref="/api/ads/authorize"
          actionLabel="Connect Amazon Ads"
        />
        <ConnectStep
          title="Amazon SP-API"
          description="Authorize Hespor to access product and sales data."
          connected={spConnected}
          actionHref="/api/sp/start"
          actionLabel="Connect SP-API"
        />
      </div>
    </div>
  );
}
