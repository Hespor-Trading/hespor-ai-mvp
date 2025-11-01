import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in?redirect_to=/dashboard")
  }

  try {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-sm">Signed in as {user?.email}</p>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-6">
        Temporary issue loading your dashboard. Please refresh.
      </div>
    )
  }
}
