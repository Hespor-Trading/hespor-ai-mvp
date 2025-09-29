// app/layout.tsx
import "../styles/globals.css";   // <-- fix the path!

export const metadata = {
  title: "HESPOR",
  description: "Hespor AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50">{children}</body>
    </html>
  );
}
