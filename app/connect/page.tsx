// app/connect/page.tsx
import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

const ConnectClient = dynamicImport(() => import("./page.client"), { ssr: false });

export default function Page() {
  return <ConnectClient />;
}
