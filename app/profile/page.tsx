"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [values, setValues] = useState({
    full_name: "",
    email: "",
    brand_name: "",
    business_name: "",
  });

  useEffect(() => {
    (async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name,email,brand_name,business_name")
          .eq("id", user.id)
          .single();

        setValues({
          full_name: data?.full_name ?? user.user_metadata?.full_name ?? "",
          email: data?.email ?? user.email ?? "",
          brand_name: data?.brand_name ?? "",
          business_name: data?.business_name ?? "",
        });
      }
      setLoading(false);
    })();
  }, []);

  async function save() {
    const supabase = supabaseBrowser();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Not signed in");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...values,
      updated_at: new Date().toISOString(),
    });
    if (error) alert(error.message);
    else alert("Saved");
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <img src="/hespor-logo.png" className="h-7" alt="Hespor" />
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
      </div>

      <div className="rounded-2xl border bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <div className="text-slate-600 mb-1">Full name</div>
            <input name="full_name" value={values.full_name} onChange={onChange} className="w-full rounded-lg border px-3 py-2" />
          </label>
          <label className="text-sm">
            <div className="text-slate-600 mb-1">Email</div>
            <input name="email" value={values.email} onChange={onChange} className="w-full rounded-lg border px-3 py-2" />
          </label>
          <label className="text-sm">
            <div className="text-slate-600 mb-1">Brand name</div>
            <input name="brand_name" value={values.brand_name} onChange={onChange} className="w-full rounded-lg border px-3 py-2" />
          </label>
          <label className="text-sm">
            <div className="text-slate-600 mb-1">Business name</div>
            <input name="business_name" value={values.business_name} onChange={onChange} className="w-full rounded-lg border px-3 py-2" />
          </label>
        </div>

        <div className="flex gap-2">
          <button onClick={save} className="rounded-lg bg-emerald-500 text-black px-4 py-2">Save</button>
          <a href="/dashboard" className="rounded-lg border px-4 py-2">Back</a>
        </div>
      </div>
    </div>
  );
}
