'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Smartphone, Building, Wallet, Banknote, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import CheckoutStepsBar from '@/components/CheckoutStepsBar';
import { api } from '@/lib/api';

export default function PaymentMethodPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallet' | 'Razorpay' | 'Cash on Delivery'>('Razorpay');
  const [loading, setLoading] = useState(false);

  const methods = [
    { key: 'Razorpay', label: 'Razorpay Smart Gateway', desc: 'UPI, Credit/Debit Cards, NetBanking, Wallets (Recommended)', icon: ShieldCheck, badge: 'Fastest' },
    { key: 'UPI', label: 'UPI / VPA Instant Payment', desc: 'Google Pay, PhonePe, Paytm, BHIM UPI', icon: Smartphone, badge: 'Zero Fee' },
    { key: 'Credit Card', label: 'Credit Card', desc: 'Visa, Mastercard, RuPay, Amex', icon: CreditCard },
    { key: 'Debit Card', label: 'Debit Card', desc: 'All major Indian bank cards', icon: CreditCard },
    { key: 'Net Banking', label: 'Net Banking', desc: 'HDFC, ICICI, SBI, Axis, Kotak & 50+ Banks', icon: Building },
    { key: 'Wallet', label: 'PawConnect Wallet & Paytm', desc: 'Use bonus wallet credits (₹500 Balance)', icon: Wallet },
    { key: 'Cash on Delivery', label: 'Cash on Delivery (COD)', desc: 'Pay cash upon delivery (Marketplace products only)', icon: Banknote }
  ];

  const handleProceedPayment = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payments/create-order', {
        use_case: "Marketplace Orders",
        payment_method: paymentMethod,
        shipping_address: "123 Indiranagar, Bengaluru, KA - 560038",
        items: [
          {
            title: "Royal Canin Breed Health Nutrition Adult Dry Dog Food (3kg)",
            unit_price: 2450.0,
            quantity: 1,
            total_price: 2450.0
          }
        ]
      });

      const orderId = res.data.id;
      const orderNum = res.data.order_number;

      if (paymentMethod === 'Cash on Delivery') {
        router.push(`/checkout/success?order_id=${orderId}&order_number=${orderNum}&method=COD`);
      } else {
        router.push(`/checkout/processing?order_id=${orderId}&order_number=${orderNum}&method=${paymentMethod}`);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <CheckoutStepsBar currentStep="payment" />

      <div className="flex items-center justify-between">
        <Link href="/checkout/address" className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Address
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Choose Payment Method</h1>
      </div>

      {/* Payment Methods Grid */}
      <div className="space-y-3">
        {methods.map((m) => {
          const isSelected = paymentMethod === m.key;
          const Icon = m.icon;

          return (
            <div
              key={m.key}
              onClick={() => setPaymentMethod(m.key as any)}
              className={`glass-panel p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isSelected ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{m.label}</h3>
                    {m.badge && (
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[10px]">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{m.desc}</p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-white/20'
              }`}>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-3 text-xs text-emerald-300">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
        <span>PCI-DSS Compliant 256-bit SSL Encrypted Transactions with HMAC SHA-256 Signature Security.</span>
      </div>

      <button
        onClick={handleProceedPayment}
        disabled={loading}
        className="w-full py-4 rounded-2xl gradient-button text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2"
      >
        {loading ? 'Initializing Payment...' : `Pay & Complete Order (${paymentMethod})`}
      </button>

    </div>
  );
}
