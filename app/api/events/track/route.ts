import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { action, brand } = await req.json();

  await supabase.from("events").insert({
    user_id: user.id,
    action,
    brand: brand || null,
  });

  return NextResponse.json({ ok: true });
}
