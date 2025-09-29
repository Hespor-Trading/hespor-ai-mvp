import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Redis from "ioredis";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const redis = process.env.REDIS_URL ? new Redis(process.env.REDIS_URL) : null;

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (!email) return new NextResponse("Email required", { status: 400 });

  const key = `resend:${email}`;
  if (redis) {
    const ttl = await redis.ttl(key);
    if (ttl > 0) {
      return new NextResponse(`Please wait ${ttl}s`, { status: 429 });
    }
  }

  // Generate a new signup confirmation link (re-sends verification)
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-in?verified=1` },
  });

  if (error) return new NextResponse(error.message, { status: 400 });

  if (redis) await redis.set(key, "1", "EX", 60);

  return NextResponse.json({ ok: true, email: data?.user?.email ?? email });
}
