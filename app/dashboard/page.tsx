import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// Load the client component without SSR to avoid hydration/auth issues
const DashboardClient = dynamicImport(() => import("./page.client"), { ssr: false });

export default function Page() {
  return <DashboardClient />;
}
