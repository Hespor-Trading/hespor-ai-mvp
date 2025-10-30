import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Hespor',
  description: 'Hespor AI',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* Existing site already renders its own narrow top bar. No extra header here. */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
