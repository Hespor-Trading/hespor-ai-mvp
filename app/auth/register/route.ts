export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
  first_name: z.string().trim().min(1),
  last_name: z.string().trim().min(1),
  business_name: z.string().trim().min(1),
  brand_name: z.string().trim().min(1),
  acceptedLegal: z.literal(true),
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message || "Invalid input";
      return new NextResponse(msg, { status: 400 });
    }
    const { email, password, first_name, last_name, business_name, brand_name } = parsed.data;

    const publicClient = createClient(SUPABASE_URL, ANON);
    const { data, error } = await publicClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name,
          last_name,
          business_name,
          brand_name,
          accepted_legal: true,
          accepted_legal_at: new Date().toISOString(),
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/sign-in?verified=1`,
      },
    });

    if (error) return new NextResponse(error.message, { status: 400 });

    const userId = data.user?.id;
    if (userId) {
      const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE);
      const { error: upsertErr } = await adminClient
        .from("profiles")
        .upsert({
          id: userId,
          email,
          first_name,
          last_name,
          business_name,
          brand_name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (upsertErr) {
        console.warn("profiles upsert error:", upsertErr);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("register error", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
