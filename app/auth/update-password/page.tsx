"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = (e.currentTarget as any).password.value as string;
    const { error } = await supabaseBrowser().auth.updateUser({ password });
    if (error) setMsg(error.message);
    else router.push("/auth/sign-in");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-emerald-50 p-6">
      <form onSubmit={onSubmit} className="bg-white rounded-2xl p-6 shadow w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Set new password</h1>
        <input name="password" type="password" placeholder="New password" className="w-full rounded-lg border px-4 py-2 mb-3" required />
        <button className="w-full rounded-lg bg-emerald-500 py-2 text-white">Update</button>
        {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
      </form>
    </div>
  );
}
