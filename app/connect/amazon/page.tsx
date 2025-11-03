import Link from "next/link"

export const dynamic = "force-dynamic"

const hasEnv = !!process.env.ADS_CLIENT_ID && !!process.env.ADS_REDIRECT_URI

export default function ConnectAmazonPage() {
  // If we ever want to require auth, we can gate here with Supabase session.
  // For now, show page regardless so users can start OAuth.

  const startUrl = "/api/ads/oauth/start"

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl shadow-sm border bg-white/80 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Connect Amazon Advertising</h1>
          <p className="text-sm text-gray-500 mt-2">
            Link your Amazon Ads account so HESPOR can read your campaigns and
            create optimization recommendations. You?ll be redirected to Amazon to approve access.
          </p>
        </div>

        <div className="space-y-3">
          <form action={startUrl} method="POST">
            <button
              type="submit"
              className="w-full rounded-xl border px-4 py-3 text-base font-medium hover:shadow-sm transition
                         bg-emerald-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!hasEnv}
            >
              Connect to Advertising Data
            </button>
          </form>

          {!hasEnv && (
            <p className="text-xs text-red-600">
              Missing env vars. Ask admin to set <code>ADS_CLIENT_ID</code> and <code>ADS_REDIRECT_URI</code>.
            </p>
          )}

          <p className="text-xs text-gray-500">
            By continuing, you agree to our{" "}
            <Link className="underline" href="/legal/terms">Terms</Link> and{" "}
            <Link className="underline" href="/legal/privacy">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
