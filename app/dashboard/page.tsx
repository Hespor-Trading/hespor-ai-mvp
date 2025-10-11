import DashboardClient from "./page.client";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// ✅ get logged-in user ID server-side
async function getUserId() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

export default async function Page() {
  const userId = await getUserId();

  if (!userId) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return <DashboardClient userId={userId} days={30} />;
}
