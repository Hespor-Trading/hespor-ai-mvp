"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

export default function SignUpClient() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [amazonBrand, setAmazonBrand] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!agree) {
      toast.error("Please agree to the Terms & Privacy.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "";

      // 1) Create user (Supabase will send verification email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${appUrl}/auth/sign-in?verified=1`,
          data: {
            first_name: firstName,
            last_name: lastName,
            business_name: businessName,
            amazon_brand: amazonBrand,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      // 2) Store/merge profile (safe if table exists)
      if (data.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: data.user.id,
              email,
              first_name: firstName,
              last_name: lastName,
              business_name: businessName,
              amazon_brand: amazonBrand,
            },
            { onConflict: "id" }
          );

        if (profileError) {
          // Don’t block the flow; just log for diagnostics
          console.warn("profiles upsert warning:", profileError.message);
        }
      }

      // 3) Fallback: attempt a resend to guarantee delivery (non-blocking)
      try {
        await fetch("/api/auth/resend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch (err) {
        console.warn("resend network warning:", err);
      }

      toast.success("Verification email sent. Please check your inbox.");
      router.replace("/auth/sign-in?awaiting=1");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow">
        <div className="flex items-center justify-center mb-4">
          <Image src="/hespor-logo.png" alt="Hespor" width={40} height={40} />
        </div>

        <h1 className="text-lg font-semibold text-center mb-6">
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Business name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amazon brand name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={amazonBrand}
              onChange={(e) => setAmazonBrand(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm password
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I agree to the{" "}
            <Link href="/legal/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline">
              Privacy
            </Link>
            .
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-600 text-white px-4 py-3 font-medium hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/sign-in" className="underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
