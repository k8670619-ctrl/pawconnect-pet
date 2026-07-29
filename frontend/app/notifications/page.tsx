'use client';

import AuthGuard from '@/components/AuthGuard';
import { Bell, CheckCircle2, ShieldCheck, AlertTriangle, Package, Sparkles } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: 'Order Status Update',
      message: 'Your order ORD-98123 (Royal Canin Dog Food) is out for delivery.',
      time: '10 mins ago',
      icon: Package,
      color: 'text-purple-400',
    },
    {
      id: 2,
      title: 'Adoption Application Approved',
      message: 'Your application for Golden Retriever (Bella) was approved by Bangalore Pet Shelter!',
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'text-emerald-400',
    },
    {
      id: 3,
      title: 'SOS Rescue Alert Responded',
      message: 'Volunteer NGO team is en route to rescue report #9812.',
      time: '1 day ago',
      icon: AlertTriangle,
      color: 'text-rose-400',
    },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Notifications</h1>
              <p className="text-xs text-slate-400">System alerts, adoption updates, & order notifications</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl divide-y divide-slate-800">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-850 transition-colors">
                  <div className={`p-2.5 rounded-2xl bg-slate-950 border border-slate-800 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                      <span className="text-[10px] text-slate-500">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{item.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
