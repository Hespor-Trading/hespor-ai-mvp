export const SUPABASE_URL =
  process.env.HES_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL_OVERRIDE ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  '';

export const SUPABASE_ANON_KEY =
  process.env.HES_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_OVERRIDE ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';
