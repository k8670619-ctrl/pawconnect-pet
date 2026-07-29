'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, ShieldCheck, CreditCard, Users, PawPrint,
  BarChart3, Bot, Settings, LogOut, Menu, X,
  ShieldAlert, Bell, ChevronRight,
} from 'lucide-react';
import { useAdminStore } from '@/lib/store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  superAdminOnly?: boolean;
  badge?: string;
}

const NAV: NavItem[] = [
  { label: 'Dashboard',     href: '/',               icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Verifications', href: '/verifications',  icon: <ShieldCheck className="w-4 h-4" />, badge: 'live' },
  { label: 'Payments',      href: '/payments',        icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Listings',      href: '/listings',        icon: <PawPrint className="w-4 h-4" /> },
  { label: 'Users',         href: '/users',           icon: <Users className="w-4 h-4" />, superAdminOnly: true },
  { label: 'Analytics',     href: '/analytics',       icon: <BarChart3 className="w-4 h-4" />, superAdminOnly: true },
  { label: 'Fraud Monitor', href: '/fraud',           icon: <Bot className="w-4 h-4" />, superAdminOnly: true },
  { label: 'Settings',      href: '/settings',        icon: <Settings className="w-4 h-4" />, superAdminOnly: true },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAdminStore();
  const isSuperAdmin = user?.role === 'super_admin';

  const visible = NAV.filter(n => !n.superAdminOnly || isSuperAdmin);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-white leading-none">PawConnect</p>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
              {isSuperAdmin ? 'Super Admin' : 'Admin Panel'}
            </p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {user?.full_name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.full_name ?? 'Admin'}</p>
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
              isSuperAdmin
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {user?.role?.replace('_', ' ') ?? 'admin'}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visible.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-600/90 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
              {item.superAdminOnly && (
                <span className="text-[9px] text-violet-400 font-bold">SA</span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/8 space-y-1">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/8 transition-all"
        >
          <PawPrint className="w-4 h-4" />
          View Public Site ↗
        </a>
        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const pageTitle = pathname === '/' ? 'Dashboard'
    : pathname.split('/').pop()?.replace(/-/g, ' ') ?? '';

  return (
    <div className="flex h-screen bg-[#080c14] overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-56 bg-[#0d1320] border-r border-white/8 flex-shrink-0">
        <SidebarNav />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative w-64 bg-[#0d1320] border-r border-white/8 z-10 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between px-5 py-3.5 bg-[#0d1320] border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg bg-white/8 text-gray-400 hover:text-white"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
              <span>Admin</span>
              {pathname !== '/' && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-gray-300 font-medium capitalize">{pageTitle}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              System Operational
            </span>
            <button className="relative p-2 rounded-lg bg-white/8 text-gray-400 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
