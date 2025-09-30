// app/auth/sign-in/page.tsx
import dynamic from "next/dynamic";

export const dynamic = "force-dynamic"; // avoid static prerender/export errors

const Client = dynamic(() => import("./Client"), { ssr: false });

export default function Page() {
  return <Client />;
}
