// lib/ads/auth.ts
import { createClient } from '@/lib/db';

const LWA_CLIENT_ID = process.env.ADS_LWA_CLIENT_ID!;
const LWA_CLIENT_SECRET = process.env.ADS_LWA_CLIENT_SECRET!;

if (!LWA_CLIENT_ID || !LWA_CLIENT_SECRET) {
  throw new Error('Missing ADS_LWA_CLIENT_ID or ADS_LWA_CLIENT_SECRET');
}

export async function getUserAdsCredentials(userId: string) {
  const db = createClient();
  const { data, error } = await db
    .from('amazon_ads_credentials')
    .select('refresh_token, profile_id, region')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

export async function getLWAToken(refreshToken: string) {
  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: LWA_CLIENT_ID,
      client_secret: LWA_CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LWA token error: ${res.status} ${text}`);
  }
  return (await res.json()) as { access_token: string; expires_in: number; token_type: string };
}
