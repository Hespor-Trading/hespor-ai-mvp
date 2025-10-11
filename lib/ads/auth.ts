// lib/ads/auth.ts
export async function getLwaAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.ADS_LWA_CLIENT_ID!,
    client_secret: process.env.ADS_LWA_CLIENT_SECRET!,
  });

  const res = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    // no cache
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`LWA token failed: ${res.status} ${t}`);
  }
  return (await res.json()) as { access_token: string; expires_in: number };
}
