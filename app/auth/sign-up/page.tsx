// app/auth/sign-up/page.tsx
import NextDynamic from "next/dynamic";

// Prevent prerendering issues and keep this page as a client-driven screen
export const dynamic = "force-dynamic";

// Load the client-side sign-up UI (which also controls the LegalModal)
const Client = NextDynamic(() => import("./Client"), { ssr: false });

export default function Page() {
  return <Client />;
}
