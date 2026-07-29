'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, CreditCard, LifeBuoy } from 'lucide-react';

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || '1';
  const reason = searchParams.get('reason') || 'Transaction declined by issuer bank or network timeout.';

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-red-500/40 space-y-6 bg-gradient-to-b from-red-950/30 to-slate-950 shadow-2xl">
        
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
          <XCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">❌ Payment Failed</h1>
          <p className="text-xs text-red-300 font-semibold">{reason}</p>
          <p className="text-[11px] text-gray-400">Don't worry, your money was not deducted. If debited, auto-refund initiates within 24 hours.</p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href={`/checkout/payment?order_id=${orderId}`}
            className="w-full py-3.5 rounded-xl gradient-button text-xs font-bold text-white shadow-xl flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Payment
          </Link>

          <Link
            href="/checkout/payment"
            className="w-full py-3.5 rounded-xl glass-panel border border-white/20 hover:bg-white/10 text-xs font-bold text-gray-300 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-amber-400" /> Change Payment Method
          </Link>

          <a
            href="mailto:support@pawconnect.ai"
            className="w-full py-3 rounded-xl bg-white/5 text-xs font-bold text-gray-400 hover:text-white flex items-center justify-center gap-2"
          >
            <LifeBuoy className="w-4 h-4" /> Contact 24/7 Support
          </a>
        </div>

      </div>

    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-20 text-center text-gray-400">Loading error...</div>}>
      <FailedContent />
    </Suspense>
  );
}
