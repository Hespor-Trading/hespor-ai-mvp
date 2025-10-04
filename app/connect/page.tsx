// Protect /connect on the SERVER so there is no client-side loop.
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// keep your existing client UI (no changes needed inside)
const ConnectClient = dynamic(() => import("./Client"), { ssr: false });

export default async function Page() {
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

  // SERVER session check (looks at HTTP-only cookies)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // Not logged in -> go to sign-in with next=/connect
    redirect(`/auth/sign-in?next=/connect`);
  }

  // Logged in -> render your existing client UI
  return <ConnectClient />;
}
