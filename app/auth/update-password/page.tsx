"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";

const strongPw = (pw: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.{8,64})/.test(pw);

function Logo() {
  return (
    <div className="flex justify-center mb-6">
      <Image
        src="/hespor-logo.png"
        alt="HESPOR"
        width={160}
        height={40}
        onError={(e) => {
          (e.target as any).style.display = "none";
          const f = document.getElementById("logo-fallback");
          if (f) (f as any).style.display = "block";
        }}
      />
      <img
        id="logo-fallback"
        src="/hespor-logo.png"
        alt="HESPOR"
        width={160}
        height={40}
        style={{ display: "none" }}
      />
    </div>
  );
}

export default function UpdatePassword() {
  const [err, setErr] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const f = e.currentTarget as any;
    const p1 = f.password.value;
    const p2 = f.password2.value;
    if (p1 !== p2) {
      setErr("Passwords do not match.");
      return;
    }
    if (!strongPw(p1)) {
      setErr(
        "Password must be 8+ chars and include upper, lower, and a number."
      );
      return;
    }
    const { error } = await supabaseBrowser().auth.updateUser({ password: p1 });
    if (error) setErr(error.message);
    else router.push("/auth/sign-in?reset=1");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-500">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <Logo />
        <h1 className="text-2xl font-bold text-center mb-4">
          Set a new password
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            name="password"
            placeholder="New password"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="password"
            name="password2"
            placeholder="Confirm new password"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500"
          />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button className="w-full rounded-lg bg-emerald-500 py-2 font-semibold text-white hover:bg-emerald-600 transition">
            Save password
          </button>
        </form>
      </div>
    </div>
  );
}
