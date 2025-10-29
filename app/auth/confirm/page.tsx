import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Loader2 } from "lucide-react"

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { code?: string; next?: string }
}) {
  const code = searchParams?.code
  const next = searchParams?.next || "/onboarding"

  if (code) {
    const supabase = await createClient()
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch {
      // ignore; will fall back to login
    }
    redirect(next)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div>
          <h1 className="text-xl font-semibold">Check your email to confirm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a confirmation link from noreply@notifications.hespor.com. After confirming, you'll be
            redirected automatically.
          </p>
        </div>
      </div>
    </div>
  )
}
