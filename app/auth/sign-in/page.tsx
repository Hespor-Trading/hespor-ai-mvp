// app/auth/sign-in/page.tsx
import NextDynamic from "next/dynamic";

// Tell Next not to prerender this page (prevents the sign-in export error)
export const dynamic = "force-dynamic";

const Client = NextDynamic(() => import("./Client"), { ssr: false });

export default function Page() {
  return <Client />;
}
