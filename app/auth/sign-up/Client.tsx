"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character"),
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  business_name: z.string().trim().min(1, "Business name is required"),
  brand_name: z.string().trim().min(1, "Amazon brand name is required"),
  acceptedLegal: z.literal(true, {
    errorMap: () => ({ message: "You must agree to Terms & Privacy" }),
  }),
});

export default function SignUpClient() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get("email") || "").trim(),
      password: String(fd.get("password") || ""),
      first_name: String(fd.get("first_name") || "").trim(),
      last_name: String(fd.get("last_name") || "").trim(),
      business_name: String(fd.get("business_name") || "").trim(),
      brand_name: String(fd.get("brand_name") || "").trim(),
      acceptedLegal: Boolean(fd.get("acceptedLegal")),
    };

    const parsed = SignUpSchema.safeParse(payload);
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message || "Check your inputs";
      return toast.error(msg);
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Sign up failed");
        setSubmitting(false);
        return;
      }

      toast.success("Account created. Please sign in.");
      router.push("/auth/sign-in?created=1");
    } catch (err) {
      toast.error("Network error");
      setSubmitting(false);
    }
  }

  // 🔑 opens shared LegalModal
  function openLegal(e: React.MouseEvent) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-legal"));
    history.replaceState(null, "", "#legal");
  }

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white/95 shadow-xl p-8">
        <div className="flex flex-col items-center gap-3 mb-6">
          <Image src="/hespor-logo.png" alt="Hespor" width={80} height={80} priority />
          <h1 className="text-xl font-semibold">Create your Hespor account</h1>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Email</label>
            <input name="email" type="email" required className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Password</label>
            <input name="password" type="password" required className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring" placeholder="Min 8 chars, upper, number, symbol" />
          </div>

          <div>
            <label className="block text-sm font-medium">First name</label>
            <input name="first_name" type="text" required className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
          </div>
          <div>
            <label className="block text-sm font-medium">Last name</label>
            <input name="last_name" type="text" required className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
          </div>

          <div>
            <label className="block text-sm font-medium">Business name</label>
            <input name="business_name" type="text" required className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
          </div>
          <div>
            <label className="block text-sm font-medium">Amazon brand name</label>
            <input name="brand_name" type="text" required className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
          </div>

          <div className="md:col-span-2 flex items-start gap-2 rounded-md border p-3">
            <input id="acceptedLegal" name="acceptedLegal" type="checkbox" className="mt-1" required />
            <label htmlFor="acceptedLegal" className="text-sm">
              I agree to{" "}
              <a href="#legal" onClick={openLegal} className="underline">
                Terms &amp; Conditions and Privacy Policy
              </a>
              .
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              disabled={submitting}
              className="w-full rounded-lg bg-black text-white py-2.5 hover:opacity-90 disabled:opacity-50"
              type="submit"
            >
              {submitting ? "Creating..." : "Create account"}
            </button>
          </div>

          <div className="md:col-span-2 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
