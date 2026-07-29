import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PawConnect Admin Panel',
  description: 'Admin & Super Admin Dashboard — PawConnect AI',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#080c14] text-white">
        {children}
      </body>
    </html>
  );
}
