import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function getSupabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookies().set({ name, value, ...options });
          } catch {
            // ignore if running in a context where setting is not allowed
          }
        },
        remove(name: string, options: any) {
          try {
            cookies().set({ name, value: "", ...options });
          } catch {
            // ignore
          }
        },
      },
    }
  );
}
