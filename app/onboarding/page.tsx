import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getAmazonIntegration } from "@/lib/amazon"
import { OnboardingForm } from "@/components/onboarding-form"

export default async function OnboardingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user already has Amazon integration
  const integration = await getAmazonIntegration(user.id)

  // If fully connected, redirect to dashboard
  if (integration?.is_fully_connected) {
    redirect("/dashboard")
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Connect Your Amazon Account</h1>
          <p className="text-muted-foreground">
            To use Hespor AI, we need to connect to your Amazon Advertising and Seller Central accounts.
          </p>
        </div>
        <OnboardingForm userId={user.id} existingIntegration={integration} />
      </div>
    </div>
  )
}
