export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Sets Supabase auth cookies from client-provided tokens.
 * The client calls this immediately after sign-in.
 */
export async function POST(req: Request) {
  try {
    const { access_token, refresh_token } = await req.json();

    if (!access_token || !refresh_token) {
      return new NextResponse("Missing tokens", { status: 400 });
    }

    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );

    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) return new NextResponse(error.message, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("set-session error", e);
    return new NextResponse("Server error", { status: 500 });
  }
}
