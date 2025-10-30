"use client"

import type { ReactNode } from "react"

interface SiteShellProps {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-gradient-bg">
      <div className="relative z-10">{children}</div>
    </div>
  )
}
