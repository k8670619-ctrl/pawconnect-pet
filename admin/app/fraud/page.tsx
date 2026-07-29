'use client';

import React, { useState } from 'react';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';
import { Bot, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

interface FraudItem {
  id: number;
  user_id: number;
  user_name: string;
  flag_type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  is_resolved: boolean;
  created_at: string;
}

const MOCK_FLAGS: FraudItem[] = [
  { id: 1, user_id: 9, user_name: 'Suspicious Account #9', flag_type: 'duplicate_phone', description: 'Mobile +91 9876543210 registered across 3 different seller profiles.', severity: 'high', is_resolved: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, user_id: 11, user_name: 'Breeder Account #11', flag_type: 'duplicate_pet_image', description: 'Identical Golden Retriever photo posted in two separate paid listings.', severity: 'medium', is_resolved: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, user_id: 14, user_name: 'Unverified Seller #14', flag_type: 'suspicious_pricing', description: 'Purebred French Bulldog listed for ₹1,200 (95% below market rate).', severity: 'low', is_resolved: true, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export default function AdminFraudPage() {
  const [flags, setFlags] = useState<FraudItem[]>(MOCK_FLAGS);

  const resolveFlag = (id: number) => {
    setFlags(prev => prev.map(f => f.id === id ? { ...f, is_resolved: true } : f));
  };

  return (
    <AdminGuard>
      <AdminSidebar>
        <div className="max-w-7xl mx-auto px-5 py-8 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Bot className="w-7 h-7 text-yellow-400" /> AI Fraud &amp; Ecosystem Shield
              </h1>
              <p className="text-xs text-gray-400 mt-1">Automated background security scans for duplicate phones, image cloning, and pricing outliers.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
              {flags.filter(f => !f.is_resolved).length} Active Flags
            </span>
          </div>

          <div className="space-y-3">
            {flags.map(f => (
              <div
                key={f.id}
                className={`rounded-2xl border p-5 flex items-start justify-between transition-all ${
                  f.is_resolved ? 'border-white/10 bg-white/5 opacity-50' : 'border-red-500/30 bg-red-900/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${f.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white capitalize">{f.flag_type.replace(/_/g, ' ')}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        f.severity === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {f.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">{f.description}</p>
                    <p className="text-[10px] text-gray-500">{f.user_name} • {timeAgo(f.created_at)}</p>
                  </div>
                </div>

                {!f.is_resolved && (
                  <button
                    onClick={() => resolveFlag(f.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </AdminSidebar>
    </AdminGuard>
  );
}
