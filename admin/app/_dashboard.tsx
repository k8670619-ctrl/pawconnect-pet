'use client';

import React, { useEffect, useState } from 'react';
import {
  Users, PawPrint, DollarSign, ShieldCheck, Activity,
  TrendingUp, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAdminStore } from '@/lib/store';

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className={`glass rounded-2xl p-5 flex items-center gap-4 border ${color}`}>
      <div className="p-3 rounded-xl bg-white/10">{icon}</div>
      <div>
        <p className="text-xs text-white/50 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-2xl font-extrabold text-white">{value}</p>
        {sub && <p className="text-[10px] text-emerald-400 font-bold mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAdminStore();
  const [metrics, setMetrics] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    api.get('/admin/metrics').then(r => setMetrics(r.data)).catch(() => {});
  }, []);

  const summary = (metrics?.summary as Record<string, number>) || {};

  return (
    <div className="max-w-7xl mx-auto px-5 py-8 space-y-8">

      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Welcome back, {user?.full_name?.split(' ')[0] ?? 'Admin'} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {user?.role === 'super_admin'
              ? 'Super Admin — full system access'
              : 'Admin — verification & moderation access'}
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          ● System Operational
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5 text-sky-300" />}     label="Total Users"     value={summary.total_users ?? 1480}           sub="+18% this month"   color="border-sky-500/20" />
        <StatCard icon={<PawPrint className="w-5 h-5 text-amber-300" />} label="Pet Listings"    value={summary.total_pets_listed ?? 320}       sub="180 Adopt / 140 Sale" color="border-amber-500/20" />
        <StatCard icon={<DollarSign className="w-5 h-5 text-emerald-300" />} label="Gross Revenue" value={formatCurrency(summary.total_revenue_inr ?? 482900)} sub="Razorpay processed" color="border-emerald-500/20" />
        <StatCard icon={<ShieldCheck className="w-5 h-5 text-violet-300" />} label="Verified NGOs" value={summary.active_ngos_verified ?? 42}   sub="Pan-India active"  color="border-violet-500/20" />
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pet distribution */}
        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white">Pet Category Distribution</h2>
          </div>
          {[
            { label: 'Dogs', count: 180, pct: 56 },
            { label: 'Cats', count: 95,  pct: 30 },
            { label: 'Birds', count: 25, pct: 8  },
            { label: 'Rabbits & Exotic', count: 20, pct: 6 },
          ].map(c => (
            <div key={c.label} className="space-y-1">
              <div className="flex justify-between text-xs text-gray-300">
                <span>{c.label} ({c.count})</span>
                <span className="font-bold text-emerald-400">{c.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-white">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Review Pending Verifications', href: '/verifications', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, badge: '3 pending' },
              { label: 'View Revenue Analytics',       href: '/payments',      icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
              { label: 'Fraud Monitor',                href: '/fraud',         icon: <AlertTriangle className="w-4 h-4 text-red-400" />, badge: '2 flags' },
              { label: 'Approved Today',               href: '/verifications', icon: <CheckCircle2 className="w-4 h-4 text-sky-400" />, badge: '5 done' },
            ].map((a, i) => (
              <a
                key={i}
                href={a.href}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  {a.icon}
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{a.label}</span>
                </div>
                {a.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                    {a.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
