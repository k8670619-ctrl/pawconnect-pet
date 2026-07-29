import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AIChatWidget from '@/components/AIChatWidget';

export const metadata: Metadata = {
  title: 'PawConnect AI | India\'s Premier Pet Ecosystem',
  description: 'Adopt, buy, sell, rescue, and care for pets with AI assistance, verified background checks, and 24/7 online veterinary consultation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <AIChatWidget />
        <Footer />
      </body>
    </html>
  );
}
