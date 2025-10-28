import { createClient } from "@supabase/supabase-js";

export type ConnectStatus = "missing" | "partial" | "complete";

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getConnectStatus(userId: string): Promise<ConnectStatus> {
  if (!userId) return "missing";
  const sb = admin();
  const [ads, sp] = await Promise.all([
    sb.from("amazon_ads_credentials").select("refresh_token, access_token, profile_id").eq("user_id", userId).maybeSingle(),
    sb.from("spapi_credentials").select("refresh_token").eq("user_id", userId).maybeSingle(),
  ]);

  const hasAds = !!(ads.data && (ads.data as any).refresh_token);
  const hasSp = !!(sp.data && (sp.data as any).refresh_token);
  if (hasAds && hasSp) return "complete";
  if (hasAds || hasSp) return "partial";
  return "missing";
}

export type InitialSyncState = "idle" | "running" | "done" | "error";

export async function getInitialSyncStatus(userId: string): Promise<InitialSyncState> {
  if (!userId) return "idle";
  const sb = admin();
  const { data } = await sb
    .from("job_status")
    .select("status")
    .eq("user_id", userId)
    .eq("type", "initial_sync")
    .maybeSingle();
  const status = (data as any)?.status as InitialSyncState | undefined;
  return status || "idle";
}
