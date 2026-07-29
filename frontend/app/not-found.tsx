import React from 'react';
import Link from 'next/link';
import { PawPrint, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
        <PawPrint className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">404 - Page Not Found</h1>
      <p className="text-xs text-gray-400">The requested PawConnect page or resource could not be found.</p>
      <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-button text-xs font-bold text-white shadow-lg">
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
