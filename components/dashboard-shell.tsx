"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { MessageSquare, TrendingUp, DollarSign, Target, LogOut, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "@supabase/supabase-js"

interface DashboardShellProps {
  user: User
}

export function DashboardShell({ user }: DashboardShellProps) {
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  // Simulate loading
  setTimeout(() => setIsLoading(false), 2000)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6F9F2] to-white">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold text-foreground">Hespor AI Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-border/50 bg-white/50 backdrop-blur-sm p-6 mt-16 lg:mt-0"
            >
              <div className="space-y-6">
                <div>
                  <Button className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-dark)]">
                    Connect to Amazon
                  </Button>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Campaign Selector</h3>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-border/50 bg-white/50 p-3 text-sm">All Campaigns</div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Last Applied Items</h3>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="rounded-lg border border-border/50 bg-white/50 p-2">
                      Bid +10% on "drawer organizer"
                    </div>
                    <div className="rounded-lg border border-border/50 bg-white/50 p-2">Negated "plastic tray"</div>
                    <div className="rounded-lg border border-border/50 bg-white/50 p-2">Reduced evening bids -25%</div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {isLoading ? (
            <div className="flex h-[600px] items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-16 w-16 animate-spin rounded-full border-4 border-[var(--brand-green)] border-t-transparent" />
                <p className="text-lg font-medium text-foreground">Learning your campaigns...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border/50 bg-white/50 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">ACOS</p>
                      <p className="text-2xl font-bold text-foreground">14.9%</p>
                      <p className="text-xs text-green-600">↓ 3.2% from last week</p>
                    </div>
                    <Target className="h-8 w-8 text-[var(--brand-green)]" />
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-white/50 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">ROAS</p>
                      <p className="text-2xl font-bold text-foreground">4.2×</p>
                      <p className="text-xs text-green-600">↑ 0.8× from last week</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[var(--brand-green)]" />
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-white/50 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spend</p>
                      <p className="text-2xl font-bold text-foreground">$8,432</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[var(--brand-green)]" />
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-white/50 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold text-foreground">$35,415</p>
                      <p className="text-xs text-green-600">↑ 12% from last week</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-[var(--brand-green)]" />
                  </div>
                </div>
              </div>

              {/* Charts Placeholder */}
              <div className="rounded-xl border border-border/50 bg-white/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Performance Overview</h3>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Charts will be displayed here (ACOS, ROAS, Spend, Sales)
                </div>
              </div>

              {/* Keyword Table */}
              <div className="rounded-xl border border-border/50 bg-white/50 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Top Keywords</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="pb-3 text-left font-semibold text-foreground">Keyword</th>
                        <th className="pb-3 text-right font-semibold text-foreground">ACOS</th>
                        <th className="pb-3 text-right font-semibold text-foreground">CTR</th>
                        <th className="pb-3 text-right font-semibold text-foreground">Conversions</th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b border-border/50">
                        <td className="py-3">drawer organizer</td>
                        <td className="py-3 text-right">12.3%</td>
                        <td className="py-3 text-right">3.2%</td>
                        <td className="py-3 text-right">47</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3">bamboo divider set</td>
                        <td className="py-3 text-right">14.1%</td>
                        <td className="py-3 text-right">2.8%</td>
                        <td className="py-3 text-right">32</td>
                      </tr>
                      <tr>
                        <td className="py-3">cutlery tray expandable</td>
                        <td className="py-3 text-right">13.7%</td>
                        <td className="py-3 text-right">3.5%</td>
                        <td className="py-3 text-right">28</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Chatbot Panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="fixed right-0 top-16 bottom-0 w-96 border-l border-border/50 bg-white/50 backdrop-blur-sm p-6 z-40"
            >
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Chat with Hespor AI</h3>
                  <button onClick={() => setIsChatOpen(false)}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 space-y-4 overflow-y-auto">
                  <div className="rounded-lg bg-white/80 p-4 text-sm">
                    <p className="text-muted-foreground">Ask me anything about your campaigns!</p>
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Type your question..."
                    className="w-full rounded-lg border border-border/50 bg-white/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-green)]"
                  />
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Floating Chat Button */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-green)] text-white shadow-lg hover:bg-[var(--brand-green-dark)] transition-colors z-50"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  )
}
