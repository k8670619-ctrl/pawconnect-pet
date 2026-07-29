'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, Truck, Download } from 'lucide-react';
import CheckoutStepsBar from '@/components/CheckoutStepsBar';
import { formatCurrency } from '@/lib/utils';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || '1';
  const orderNumber = searchParams.get('order_number') || 'ORD-PAW-98412';
  const method = searchParams.get('method') || 'Razorpay';
  const paymentId = `PAY-RZP-${Date.now().toString().slice(-8)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <CheckoutStepsBar currentStep="success" />

      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 text-center space-y-6 shadow-2xl bg-gradient-to-b from-emerald-950/30 to-slate-950">
        
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-white">✅ Payment Successful!</h1>
          <p className="text-xs text-gray-300">Your order has been confirmed and dispatched to our logistics network.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs text-left">
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Order Number</span>
            <span className="font-bold text-white text-xs">{orderNumber}</span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Payment ID</span>
            <span className="font-bold text-emerald-400 text-xs">{paymentId}</span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Payment Method</span>
            <span className="font-bold text-white text-xs">{method}</span>
          </div>

          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Amount Paid</span>
            <span className="font-bold text-emerald-400 text-xs">{formatCurrency(5766.90)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href={`/orders/track?order_id=${orderId}`}
            className="px-6 py-3.5 rounded-xl gradient-button text-xs font-bold text-white shadow-xl flex items-center gap-2"
          >
            <Truck className="w-4 h-4" /> Track Order Status
          </Link>

          <a
            href={`http://localhost:8000/api/v1/payments/invoice/INV-PAW-2026-9821`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 rounded-xl glass-panel border border-white/20 hover:bg-white/10 text-xs font-bold text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Download Invoice (PDF)
          </a>

          <Link
            href="/marketplace"
            className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

      </div>

    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto py-20 text-center text-gray-400">Loading receipt...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
