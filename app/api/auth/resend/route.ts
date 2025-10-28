export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "";

export async function POST(req: Request) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return new NextResponse("Supabase environment not configured", { status: 500 });
  }
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  try {
    const { email } = await req.json();
    if (!email) return new NextResponse("Email required", { status: 400 });

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${APP_URL}/auth/sign-in?verified=1`,
      },
    });

    if (error) return new NextResponse(error.message, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return new NextResponse("Server error", { status: 500 });
  }
}
