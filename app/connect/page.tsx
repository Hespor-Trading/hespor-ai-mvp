import dynamicImport from "next/dynamic";

export const dynamic = "force-dynamic";          // do not pre-render
export const revalidate = 0;                      // or: export const revalidate = false;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

const ConnectClient = dynamicImport(() => import("./page.client"), { ssr: false });

export default function Page() {
  return <ConnectClient />;
}
