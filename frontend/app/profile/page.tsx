'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import AuthGuard from '@/components/AuthGuard';
import { User, ShieldCheck, Mail, Phone, MapPin, Edit3, KeyRound, Bell, LogOut, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ full_name: fullName, phone });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-3xl flex items-center justify-center shadow-xl">
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{user?.full_name}</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Status: {user?.verification_status || 'Email Verified'}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-emerald-400" />
              Account Settings
            </h2>

            {isSaved && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address (Verified)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-4 py-2.5 bg-slate-950/40 border border-slate-800/50 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                Save Changes
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => logout()}
              className="px-6 py-3 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-400 font-bold text-xs rounded-2xl flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
