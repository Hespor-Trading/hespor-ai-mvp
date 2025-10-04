import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import NextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ConnectClient = NextDynamic(() => import("./Client"), { ssr: false });

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect(`/auth/sign-in?next=/connect`);
  return <ConnectClient />;
}
