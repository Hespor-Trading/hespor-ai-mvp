// Force Node runtime (Redis requires Node, not Edge)
export const runtime = "nodejs";
// Avoid static caching of this route
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";

// Validate required envs early (helps diagnose misconfig)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
if (!SUPABASE_URL || !SERVICE_ROLE || !APP_URL) {
  // Don't throw here to avoid build-time issues; fail gracefully at runtime
  console.warn(
    "[/api/auth/resend] Missing env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or NEXT_PUBLIC_APP_URL"
  );
}

const supabase = createClient(SUPABASE_URL!, SERVICE_ROLE!);

// Upstash / Redis connection (optional, but used for rate limit)
const redisUrl = process.env.REDIS_URL;
const redis = redisUrl ? new Redis(redisUrl) : null;

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email || typeof email !== "string") {
      return new NextResponse("Email required", { status: 400 });
    }

    // Basic email sanity check
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      return new NextResponse("Invalid email", { status: 400 });
    }

    // 60s rate limiter
    const key = `resend:${email}`;
    if (redis) {
      const ttl = await redis.ttl(key);
      if (ttl > 0) {
        return new NextResponse(`Please wait ${ttl}s`, { status: 429 });
      }
    }

    // Ask Supabase to send a fresh verification email
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "signup",
      email,
      options: { emailRedirectTo: `${APP_URL}/auth/sign-in?verified=1` }
    });

    if (error) {
      return new NextResponse(error.message, { status: 400 });
    }

    if (redis) {
      await redis.set(key, "1", "EX", 60);
    }

    return NextResponse.json({ ok: true, email: data?.user?.email ?? email });
  } catch (e: any) {
    console.error("[/api/auth/resend] Error:", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
