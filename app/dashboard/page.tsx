// app/dashboard/page.tsx
import dynamicImport from "next/dynamic";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const DashboardClient = dynamicImport(() => import("./page.client"), { ssr: false });

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id || "";

  return <DashboardClient userId={userId} />;
}
