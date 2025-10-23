import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Hespor – AI Advertising Engine for Amazon & E-commerce Sellers",
  description:
    "Hespor is an AI-powered advertising automation engine that helps Amazon and e-commerce sellers increase sales, optimize bids, and scale efficiently.",
  icons: {
    icon: "/favicon.png",            // <- uses public/favicon.png
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://hespor.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-emerald-50 text-slate-900">
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
