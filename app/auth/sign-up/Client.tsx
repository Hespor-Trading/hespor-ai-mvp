"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignUpClient() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // 👇 no emailRedirectTo, we skip verification
      options: {
        data: { business_name: businessName },
      },
    });

    if (error) {
      setError(error.message);
    } else {
      // also save profile if table exists
      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          business_name: businessName,
          email,
        });
      }
      // go straight to sign-in after signup
      router.push("/auth/sign-in");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-emerald-900">
      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-700">
          Create Your Hespor Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-700 text-white py-2 px-4 rounded-md hover:bg-emerald-800 transition"
        >
          {loading ? "Creating…" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
