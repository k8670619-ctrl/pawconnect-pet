'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#090d16] text-white flex items-center justify-center min-h-screen p-4 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Something went wrong!</h2>
          <p className="text-xs text-gray-300">{error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
