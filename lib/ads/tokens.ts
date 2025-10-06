// lib/ads/tokens.ts
export async function refreshAdsToken(refresh_token: string) {
  const client_id =
    process.env.ADS_LWA_CLIENT_ID || process.env.NEXT_PUBLIC_ADS_CLIENT_ID!;
  const client_secret =
    process.env.ADS_LWA_CLIENT_SECRET || process.env.SP_LWA_CLIENT_SECRET!;
  const r = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
      client_id,
      client_secret,
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()) as { access_token: string; expires_in: number };
}
