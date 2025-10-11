// lib/db/ads.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getCreds(user_id: string) {
  const { data, error } = await supabase
    .from('amazon_ads_credentials')
    .select('*')
    .eq('user_id', user_id)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertAdsProfile(user_id: string, profile_id: string, region: string) {
  const { error } = await supabase
    .from('ads_profiles')
    .upsert({ user_id, profile_id, country: region }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function saveSearchTerms(rows: any[]) {
  if (!rows.length) return;
  const { error } = await supabase.from('ads_search_terms').insert(rows);
  if (error) throw error;
}
