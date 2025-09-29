// app/layout.tsx
import "./globals.css"; // <- always present in /app now

export const metadata = { title: "HESPOR", description: "Hespor AI" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
