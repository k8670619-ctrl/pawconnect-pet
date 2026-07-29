'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Truck, CheckCircle2, Package, MapPin, ArrowLeft } from 'lucide-react';

function OrderTrackContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || '1';

  const trackingSteps = [
    { title: "Order Confirmed", date: "Today • 11:24 AM", desc: "Payment verified & seller notified", completed: true },
    { title: "Packed at Warehouse", date: "Today • 02:15 PM", desc: "Item packaged & quality checked", completed: true },
    { title: "Shipped via Express Logistics", date: "Expected Tomorrow", desc: "In transit to regional hub", completed: true },
    { title: "Out for Delivery", date: "Expected Aug 1", desc: "Delivery partner assigned", completed: false },
    { title: "Delivered", date: "Expected Aug 1", desc: "Package handed over", completed: false }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Live Order Tracking</h1>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-8">
        
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="text-[10px] text-gray-400 uppercase block">Tracking ID</span>
            <span className="font-bold text-white text-base">ORD-PAW-98412</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 uppercase block">Estimated Delivery</span>
            <span className="font-bold text-emerald-400 text-base">Thursday, 1 Aug 2026</span>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
          {trackingSteps.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              <div className={`absolute -left-[30px] top-0.5 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold ${
                step.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-900 border-white/20 text-gray-500'
              }`}>
                {step.completed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-3">
                  <h4 className={`font-bold text-sm ${step.completed ? 'text-white' : 'text-gray-400'}`}>
                    {step.title}
                  </h4>
                  <span className="text-[11px] text-emerald-400 font-semibold">{step.date}</span>
                </div>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Courier Details */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-emerald-400" />
            <div>
              <h5 className="font-bold text-white">BlueDart Express AWB #894109241</h5>
              <p className="text-gray-400 text-[11px]">Assigned Delivery Executive: Ramesh Kumar (+91 98111 22233)</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function OrderTrackPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400">Loading tracking info...</div>}>
      <OrderTrackContent />
    </Suspense>
  );
}
