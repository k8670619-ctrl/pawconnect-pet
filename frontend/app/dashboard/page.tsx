'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import AuthGuard from '@/components/AuthGuard';
import {
  PawPrint,
  User,
  ShieldCheck,
  Sparkles,
  Dog,
  Stethoscope,
  ShoppingBag,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  Bell,
  Package,
  Heart,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Bella',
      breed: 'Golden Retriever',
      age: '1 Year 2 Months',
      status: 'Healthy',
      lastVaccine: '2026-06-15',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      name: 'Milo',
      breed: 'Persian Cat',
      age: '4 Months',
      status: 'Vaccination Due',
      lastVaccine: '2026-05-10',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    },
  ]);

  const reminders = [
    { id: 1, title: 'Milo Rabies Booster Dose', date: 'Tomorrow, 10:00 AM', type: 'Vaccine', urgent: true },
    { id: 2, title: 'Full Grooming & Flea Bath', date: 'Aug 5, 2026', type: 'Grooming', urgent: false },
    { id: 3, title: 'Vet Routine Health Checkup', date: 'Aug 12, 2026', type: 'Vet Consult', urgent: false },
  ];

  const recentOrders = [
    { id: 'ORD-98123', item: 'Royal Canin Adult Dog Food 3kg', date: 'Jul 28, 2026', amount: '₹2,450', status: 'Out for Delivery' },
    { id: 'ORD-97412', item: 'Anti-Flea Shampoo & Grooming Kit', date: 'Jul 20, 2026', amount: '₹890', status: 'Delivered' },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* ==================== WELCOME HEADER CARD ==================== */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/30 shrink-0">
                  {user?.profile_photo ? (
                    <img src={user.profile_photo} alt={user.full_name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    user?.full_name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white">
                      Welcome back, {user?.full_name?.split(' ')[0] || 'Pet Parent'}! 👋
                    </h1>
                    <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                      {user?.role || 'User'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Here is your pet care overview, health schedule, and recent activity.
                  </p>
                </div>
              </div>

              {/* Verification Status Pill */}
              <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Account Status</p>
                  <p className="text-[11px] text-emerald-400 font-semibold capitalize">
                    {user?.is_identity_verified ? '✓ Background Verified' : 'Email Verified • Verification Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== QUICK ACTIONS BAR ==================== */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: 'Ask AI Health Vet', icon: Sparkles, color: 'from-emerald-500 to-teal-600', link: '/ai-assistant' },
              { label: 'Adopt / Buy Pet', icon: Dog, color: 'from-blue-500 to-cyan-600', link: '/pets' },
              { label: 'Book Tele-Vet', icon: Stethoscope, color: 'from-teal-500 to-emerald-600', link: '/services' },
              { label: 'Order Supplies', icon: ShoppingBag, color: 'from-purple-500 to-indigo-600', link: '/marketplace' },
              { label: 'Post SOS Alert', icon: AlertTriangle, color: 'from-rose-500 to-amber-600', link: '/rescue' },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  href={action.link}
                  className="bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 group transition-all hover:scale-[1.03]"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* ==================== MY PETS & REMINDERS GRID ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: My Pets Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dog className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">My Pets Profile</h2>
                </div>
                <Link href="/pets" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add New Pet
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex gap-4 items-center">
                    <img src={pet.image} alt={pet.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">{pet.name}</h3>
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${
                          pet.status === 'Healthy' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                        }`}>
                          {pet.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{pet.breed}</p>
                      <p className="text-[11px] text-slate-500">Age: {pet.age}</p>
                      <p className="text-[10px] text-slate-400 pt-1">Last Vaccine: {pet.lastVaccine}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Identity Document Verification Upload Card */}
              {!user?.is_identity_verified && (
                <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Complete Identity Verification</h4>
                      <p className="text-xs text-slate-400">Upload Govt ID or Seller License to gain verified status badge.</p>
                    </div>
                  </div>
                  <Link
                    href="/onboarding"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shrink-0"
                  >
                    Upload ID Document
                  </Link>
                </div>
              )}
            </div>

            {/* Right Column: Upcoming Reminders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-teal-400" />
                  <h2 className="text-lg font-bold text-white">Upcoming Health Reminders</h2>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                {reminders.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      r.urgent ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{r.title}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {r.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ==================== RECENT ORDERS TIMELINE ==================== */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Recent Marketplace Orders</h2>
              </div>
              <Link href="/orders" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
                View All Orders →
              </Link>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{ord.item}</p>
                      <p className="text-[11px] text-slate-500">{ord.id} • Ordered on {ord.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-400">{ord.amount}</p>
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded-full">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
