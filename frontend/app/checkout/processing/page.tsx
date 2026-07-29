'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || '1';
  const orderNumber = searchParams.get('order_number') || 'ORD-PAW-89412';
  const method = searchParams.get('method') || 'Razorpay';

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await api.post('/payments/verify', {
          order_id: Number(orderId),
          razorpay_order_id: `order_${orderNumber.replace('-', '_')}`,
          razorpay_payment_id: `pay_rzp_${Date.now().toString().slice(-8)}`,
          razorpay_signature: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        });
        router.push(`/checkout/success?order_id=${orderId}&order_number=${orderNumber}&method=${method}`);
      } catch (err) {
        console.error(err);
        router.push(`/checkout/failed?order_id=${orderId}&reason=Verification%20failed`);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [orderId, orderNumber, method, router]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      
      <div className="glass-panel p-10 rounded-3xl border border-emerald-500/30 space-y-6 shadow-2xl">
        
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto relative">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">Processing Payment...</h2>
          <p className="text-xs text-emerald-400 font-semibold">Connecting to {method} Gateway</p>
          <p className="text-[11px] text-gray-400">Please wait. Do not refresh or close this browser tab.</p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center gap-2 text-[11px] text-gray-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted Session • Order #{orderNumber}
        </div>

      </div>

    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto py-24 text-center text-gray-400">Processing...</div>}>
      <ProcessingContent />
    </Suspense>
  );
}
