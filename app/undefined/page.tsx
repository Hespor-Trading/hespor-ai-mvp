// app/undefined/page.tsx
import { redirect } from "next/navigation";

export default function Page() {
  redirect("/"); // send anyone who hits /undefined back home
}
