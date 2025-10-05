import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Hespor",
  description: "Hespor Ads Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* ✅ Ensure emerald background is visible everywhere */}
      <body className="min-h-screen bg-emerald-50 text-slate-900">
        {/* ✅ Global toast host so signup/signin messages always show */}
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
