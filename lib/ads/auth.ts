// lib/ads/auth.ts
import { db } from '@/lib/db';

type Region = 'na' | 'eu' | 'fe'; // NA, EU, Far East (APAC)

export async function getUserAmazonRefreshToken(userId: string) {
  const { data, error } = await db
    .from('amazon_ads_credentials')
    .select('refresh_token, region')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data?.refresh_token) throw new Error('No refresh token for user');
  const region = (data.region as Region) || 'na';
  return { refreshToken: data.refresh_token, region };
}

export async function exchangeForAccessToken(refreshToken: string, region: Region) {
  // Amazon Ads LWA token endpoint is global
  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.AMAZON_ADS_CLIENT_ID!,
      client_secret: process.env.AMAZON_ADS_CLIENT_SECRET!,
    }),
    // avoid Next fetch caching
    cache: 'no-store',
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`LWA token exchange failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  return { accessToken: json.access_token as string, region };
}

// base URL by region for Amazon Ads API
export function adsApiBaseByRegion(region: Region) {
  switch (region) {
    case 'eu': return 'https://advertising-api-eu.amazon.com';
    case 'fe': return 'https://advertising-api-fe.amazon.com';
    default:   return 'https://advertising-api.amazon.com'; // na
  }
}
