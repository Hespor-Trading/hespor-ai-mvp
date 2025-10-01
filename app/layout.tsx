import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hespor",
  description: "Hespor Ads Assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-emerald-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
