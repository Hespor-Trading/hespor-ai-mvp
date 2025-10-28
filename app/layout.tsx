import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://hespor.ai"),
  title: {
    default: "Hespor AI - Amazon PPC Automation & Analytics",
    template: "%s - Hespor AI",
  },
  description:
    "AI-powered Amazon seller analytics and PPC automation. Talk to your data, learn while executing, and scale your Amazon business with confidence.",
  keywords: [
    "Amazon PPC",
    "Amazon advertising",
    "PPC automation",
    "Amazon analytics",
    "Amazon seller tools",
    "AI advertising",
    "Amazon PPC optimization",
    "Amazon bid management",
    "Amazon campaign automation",
    "Amazon seller software",
  ],
  authors: [{ name: "Hespor" }],
  creator: "Hespor",
  publisher: "Hespor",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hespor.ai",
    title: "Hespor AI - Amazon PPC Automation & Analytics",
    description: "AI-powered Amazon seller analytics and PPC automation platform",
    siteName: "Hespor AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hespor AI - Amazon PPC Automation & Analytics",
    description: "AI-powered Amazon seller analytics and PPC automation platform",
    creator: "@hespor",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SiteHeader />
        <main className="min-h-screen">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  )
}
