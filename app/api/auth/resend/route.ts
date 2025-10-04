export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return new NextResponse("Email required", { status: 400 });

    const key = `resend:${email}`;
    if (redis) {
      const exists = await redis.get(key);
      if (exists) return new NextResponse("Rate limited", { status: 429 });
    }

    const { error } = await supabase.auth.admin.resend({
      email,
      type: "signup",
      options: { emailRedirectTo: `${APP_URL}/auth/sign-in?verified=1` },
    });

    if (error) return new NextResponse(error.message, { status: 400 });
    if (redis) await redis.set(key, "1", "EX", 60);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("resend error", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
