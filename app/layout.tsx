// app/layout.tsx
import "../styles/globals.css"; // keep your compiled CSS pipeline too
import type { ReactNode } from "react";

export const metadata = {
  title: "HESPOR",
  description: "Hespor AI",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 🔥 HOT-FIX: Tailwind CDN so pages are styled immediately */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Optional: tune Tailwind CDN if you need */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: { extend: {} }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
