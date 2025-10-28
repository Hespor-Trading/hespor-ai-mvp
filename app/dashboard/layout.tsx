import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard - Hespor AI",
  description: "Manage your Amazon PPC campaigns with AI-powered automation",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen">{children}</div>
}
