import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
export const runtime = 'edge';
export async function POST() {
  const sb = supabaseServer();
  await sb.auth.signOut();
  return NextResponse.json({ ok: true });
}
