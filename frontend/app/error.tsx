'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Segment Error:', error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <h2 className="text-2xl font-bold text-red-400">Application Error</h2>
      <p className="text-xs text-gray-300">{error?.message || 'An error occurred while loading this section.'}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-lg"
      >
        Retry
      </button>
    </div>
  );
}
