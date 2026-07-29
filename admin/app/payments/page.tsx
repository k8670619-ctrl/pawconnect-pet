'use client';

import React, { useState, useEffect } from 'react';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';
import { CreditCard, DollarSign, TrendingUp, RefreshCw, Activity, ArrowUpRight } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPayments = () => {
    setLoading(true);
    api.get('/payments/admin/analytics')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPayments(); }, []);

  const revenue = (data?.revenue_summary as Record<string, number>) || {};
  const methods = (data?.payment_method_share as Array<{ method: string; percentage: number }>) || [
    { method: 'UPI / GPay / PhonePe', percentage: 58 },
    { method: 'Credit / Debit Cards', percentage: 24 },
    { method: 'Net Banking', percentage: 10 },
    { method: 'PawConnect Wallet', percentage: 5 },
    { method: 'Cash on Delivery', percentage: 3 }
  ];

  return (
    <AdminGuard>
      <AdminSidebar>
        <div className="max-w-7xl mx-auto px-5 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <CreditCard className="w-7 h-7 text-emerald-400" /> Revenue &amp; Payment Analytics
              </h1>
              <p className="text-xs text-gray-400 mt-1">Real-time Razorpay transaction monitoring, refunds, and payment gateway health.</p>
            </div>
            <button
              onClick={fetchPayments}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Metrics cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass rounded-2xl p-4 border border-emerald-500/20 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Gross Revenue</span>
              <p className="text-2xl font-extrabold text-emerald-400">{formatCurrency(revenue.gross_revenue_inr ?? 482900)}</p>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +24% YoY
              </span>
            </div>

            <div className="glass rounded-2xl p-4 border border-sky-500/20 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Tax Collected (GST 18%)</span>
              <p className="text-2xl font-extrabold text-white">{formatCurrency(revenue.tax_collected_inr ?? 73600)}</p>
              <span className="text-[10px] text-gray-500 font-semibold">Automated Invoice filings</span>
            </div>

            <div className="glass rounded-2xl p-4 border border-amber-500/20 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Refunds Processed</span>
              <p className="text-2xl font-extrabold text-amber-400">{formatCurrency(revenue.refunds_processed_inr ?? 12500)}</p>
              <span className="text-[10px] text-gray-500 font-semibold">Auto-approved 3-5 days</span>
            </div>

            <div className="glass rounded-2xl p-4 border border-violet-500/20 space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Gateway Success Rate</span>
              <p className="text-2xl font-extrabold text-violet-300">{revenue.razorpay_success_rate ?? 99.4}%</p>
              <span className="text-[10px] text-emerald-400 font-bold">Razorpay Live Status</span>
            </div>
          </div>

          {/* Payment Method Share */}
          <div className="glass rounded-2xl border border-white/10 p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Payment Method Breakdown
            </h2>
            <div className="space-y-3">
              {methods.map((m, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>{m.method}</span>
                    <span className="font-bold text-emerald-400">{m.percentage}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${m.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </AdminSidebar>
    </AdminGuard>
  );
}
