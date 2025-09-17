"use client";
import { useState } from "react";

export default function ConnectPage() {
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState<any>(null);

  const [form, setForm] = useState({
    brand: "",
    ads_client_id: "",
    ads_client_secret: "",
    ads_refresh_token: "",
    ads_profile_id: "",
    ads_api_region: "na",
    sp_client_id: "",
    sp_client_secret: "",
    sp_refresh_token: "",
    sp_region: "na",
    breakEvenACOS: "0.25",
    salePrice: "20",
    primaryASIN: "",
    thresholdUnits: "50",
  });

  const update = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    setBusy(true); setOut(null);
    const payload: any = {
      brand: form.brand.toUpperCase(),
      ads: {
        client_id: form.ads_client_id,
        client_secret: form.ads_client_secret,
        refresh_token: form.ads_refresh_token,
        profile_id: form.ads_profile_id,
        api_region: form.ads_api_region
      },
      config: {
        breakEvenACOS: parseFloat(form.breakEvenACOS),
        salePrice: parseFloat(form.salePrice),
        primaryASIN: form.primaryASIN,
        thresholdUnits: parseInt(form.thresholdUnits, 10)
      }
    };
    if (form.sp_client_id && form.sp_refresh_token) {
      payload.spapi = {
        SP_LWA_CLIENT_ID: form.sp_client_id,
        SP_LWA_CLIENT_SECRET: form.sp_client_secret,
        SP_REFRESH_TOKEN: form.sp_refresh_token,
        SP_REGION: form.sp_region
      };
    }

    const raw = JSON.stringify(payload);
    const secret = process.env.NEXT_PUBLIC_PROVISION_HMAC || ""; // optional if you want client → server HMAC
    const res = await fetch("/api/provision", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        // "x-hespor-signature": signature(raw, secret)  // omit unless you implement client HMAC
      },
      body: raw
    });
    const json = await res.json();
    setOut(json);
    setBusy(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Connect a Brand</h1>
      <p className="text-sm opacity-80">Enter details (later these will come from OAuth automatically).</p>

      <div className="grid gap-2">
        <input className="border p-2 rounded" placeholder="Brand (e.g., ACME)" value={form.brand} onChange={update("brand")} />

        <h3 className="font-medium mt-4">Amazon Ads (required)</h3>
        <input className="border p-2 rounded" placeholder="ADS client_id" value={form.ads_client_id} onChange={update("ads_client_id")} />
        <input className="border p-2 rounded" placeholder="ADS client_secret" value={form.ads_client_secret} onChange={update("ads_client_secret")} />
        <input className="border p-2 rounded" placeholder="ADS refresh_token" value={form.ads_refresh_token} onChange={update("ads_refresh_token")} />
        <input className="border p-2 rounded" placeholder="ADS profile_id" value={form.ads_profile_id} onChange={update("ads_profile_id")} />
        <input className="border p-2 rounded" placeholder="ADS api_region (na/eu/fe)" value={form.ads_api_region} onChange={update("ads_api_region")} />

        <h3 className="font-medium mt-4">SP-API (optional)</h3>
        <input className="border p-2 rounded" placeholder="SP client_id" value={form.sp_client_id} onChange={update("sp_client_id")} />
        <input className="border p-2 rounded" placeholder="SP client_secret" value={form.sp_client_secret} onChange={update("sp_client_secret")} />
        <input className="border p-2 rounded" placeholder="SP refresh_token" value={form.sp_refresh_token} onChange={update("sp_refresh_token")} />
        <input className="border p-2 rounded" placeholder="SP region (na/eu/fe)" value={form.sp_region} onChange={update("sp_region")} />

        <h3 className="font-medium mt-4">Rules</h3>
        <input className="border p-2 rounded" placeholder="breakEvenACOS (0.25)" value={form.breakEvenACOS} onChange={update("breakEvenACOS")} />
        <input className="border p-2 rounded" placeholder="salePrice (20)" value={form.salePrice} onChange={update("salePrice")} />
        <input className="border p-2 rounded" placeholder="primaryASIN" value={form.primaryASIN} onChange={update("primaryASIN")} />
        <input className="border p-2 rounded" placeholder="thresholdUnits (50)" value={form.thresholdUnits} onChange={update("thresholdUnits")} />
      </div>

      <button disabled={busy} onClick={submit} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
        {busy ? "Provisioning..." : "Create Pipeline"}
      </button>

      {out && (
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">{JSON.stringify(out, null, 2)}</pre>
      )}
    </div>
  );
}
