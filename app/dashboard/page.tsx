import DashboardClient from "./page.client";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

async function getUserId() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

export default async function Page() {
  const userId = await getUserId();
  return <DashboardClient initialUserId={userId} />;
}
