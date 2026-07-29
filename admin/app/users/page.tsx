'use client';

import React, { useState } from 'react';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';
import { Users, Search, ShieldCheck, ShieldAlert, Lock, UserCheck } from 'lucide-react';

interface UserRecord {
  id: number;
  full_name: string;
  email: string;
  role: string;
  verification_status: string;
  trust_score: number;
  is_active: boolean;
}

const MOCK_USERS: UserRecord[] = [
  { id: 1, full_name: 'Super Admin', email: 'admin@pawconnect.ai', role: 'super_admin', verification_status: 'verified', trust_score: 100, is_active: true },
  { id: 2, full_name: 'Priya Sharma', email: 'priya@example.com', role: 'seller', verification_status: 'verified', trust_score: 95, is_active: true },
  { id: 3, full_name: 'Rescue Paws NGO', email: 'admin@rescuepaws.org', role: 'ngo', verification_status: 'verified', trust_score: 98, is_active: true },
  { id: 4, full_name: 'Dr. Ankit Rao', email: 'dr.ankit@vetsol.in', role: 'veterinarian', verification_status: 'pending', trust_score: 70, is_active: true },
  { id: 5, full_name: 'Rahul Verma', email: 'rahul@example.com', role: 'user', verification_status: 'unverified', trust_score: 50, is_active: true },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUserStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_active: !u.is_active } : u));
  };

  return (
    <AdminGuard>
      <AdminSidebar>
        <div className="max-w-7xl mx-auto px-5 py-8 space-y-6">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Users className="w-7 h-7 text-sky-400" /> Ecosystem User Management
              </h1>
              <p className="text-xs text-gray-400 mt-1">Super Admin access — view, manage, freeze, or promote user accounts across all 6 roles.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-500/30">
              Super Admin Mode
            </span>
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, role…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 font-semibold text-left">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Trust Score</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-bold text-white">{u.full_name}</p>
                      <p className="text-gray-400 text-[11px]">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-gray-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.verification_status === 'verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {u.verification_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{u.trust_score}/100</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {u.is_active ? 'Active' : 'Frozen'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-[10px] font-semibold text-gray-300"
                      >
                        {u.is_active ? 'Freeze Account' : 'Unfreeze'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </AdminSidebar>
    </AdminGuard>
  );
}
