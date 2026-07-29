'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { RefreshCw, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';

export default function RefundPage() {
  const [reason, setReason] = useState('Product damaged during transit');
  const [requested, setRequested] = useState(false);
  const [refundData, setRefundData] = useState<any>(null);

  const handleRequestRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/payments/refund', {
        order_id: 1,
        reason: reason,
        amount: 2616.90
      });
      setRefundData(res.data.refund);
      setRequested(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Refund Request & Status</h1>
      </div>

      <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 space-y-6">
        {requested ? (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Refund Requested & Auto-Approved</h3>
              <p className="text-xs text-emerald-200">Your refund is being credited back to your original payment source.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900 border border-white/10 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Refund ID</span>
                <span className="font-bold text-white text-xs">{refundData?.refund_id || 'REF-PAW-98123'}</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Refund Amount</span>
                <span className="font-bold text-emerald-400 text-xs">{formatCurrency(refundData?.amount || 2616.90)}</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Status</span>
                <span className="font-bold text-amber-400 text-xs">{refundData?.status || 'Approved'}</span>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Expected Credit</span>
                <span className="font-bold text-white text-xs">{refundData?.expected_date || '3-5 Business Days'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300">
              <span className="font-bold text-white block mb-1">Refund Reason:</span>
              <p>{reason}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRequestRefund} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-300 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>You can request a 100% full refund within 7 days of delivery for any order or service.</span>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Select Order to Refund</label>
              <select className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white">
                <option value="1">Order #ORD-PAW-98412 - Royal Canin Dog Food (₹2,616.90)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Reason for Refund</label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain issue..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Submit Refund Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
