// app/auth/sign-in/page.tsx
import dynamic from "next/dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Client = dynamic(() => import("./Client"), {
  ssr: false,
});

export default function Page() {
  return <Client />;
}
