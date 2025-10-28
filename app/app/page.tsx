import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { getConnectStatus, getInitialSyncStatus } from "@/lib/onboarding";
import FetchingData from "@/components/FetchingData";
import DashboardClient from "@/app/dashboard/page.client";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return redirect("/auth/sign-in");

  // 1) Gate on connections
  const connect = await getConnectStatus(userId);
  if (connect !== "complete") return redirect("/app/(onboarding)/connect");

  // 2) Initial sync status
  let status = await getInitialSyncStatus(userId);
  if (status === "idle" || status === "error") {
    // kick off initial sync stub directly (server-side) and proceed
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await admin.from("job_status").upsert({ user_id: userId, type: "initial_sync", status: "running", progress: 5 } as any);
    await admin.from("job_status").upsert({ user_id: userId, type: "initial_sync", status: "done", progress: 100 } as any);
    status = "done";
  }

  if (status !== "done") {
    return <FetchingData userId={userId} />;
  }

  // 3) Determine plan (free vs paid)
  const { data: prof } = await supabase.from("profiles").select("plan").maybeSingle();
  const plan = (prof as any)?.plan || "free";

  return <DashboardClient initialUserId={userId} plan={plan} />;
}
