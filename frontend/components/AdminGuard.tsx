'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ShieldAlert, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

const ADMIN_ROLES = ['admin', 'super_admin'] as const;
type AdminRole = typeof ADMIN_ROLES[number];

interface AdminGuardProps {
  children: React.ReactNode;
  /** Which roles are allowed. Defaults to ['admin', 'super_admin'] */
  allowedRoles?: AdminRole[];
}

/**
 * AdminGuard — wraps any /admin/* page.
 * - Unauthenticated visitors are redirected to /login.
 * - Authenticated users without admin/super_admin role see a 403 block.
 * - Passes through for admin & super_admin.
 */
export default function AdminGuard({ children, allowedRoles = ['admin', 'super_admin'] }: AdminGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [hydrated, isAuthenticated, router]);

  // Waiting for hydration
  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#080c14] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-sm text-gray-500">Loading admin panel…</p>
      </div>
    );
  }

  // Not authenticated — blank while redirecting
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#080c14] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
        <p className="text-sm text-gray-500">Redirecting to login…</p>
      </div>
    );
  }

  // Authenticated but wrong role → 403 block
  const isAdmin = user && (allowedRoles as string[]).includes(user.role);
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#080c14] text-white gap-6 px-4">
        {/* Glow bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-red-600/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-center gap-4 max-w-sm text-center">
          <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30">
            <Lock className="w-10 h-10 text-red-400" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-white">Access Denied</h1>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
              This area is restricted to <span className="text-red-400 font-semibold">Admin</span> and{' '}
              <span className="text-red-400 font-semibold">Super Admin</span> accounts only.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 w-full text-left space-y-2">
            <p className="text-xs text-gray-400">Signed in as:</p>
            <p className="text-sm font-semibold text-white">{user?.full_name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {user?.role}
            </span>
          </div>

          <div className="flex gap-3 w-full">
            <Link
              href="/dashboard"
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold text-gray-300 text-center transition-all border border-white/10"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-bold text-white text-center transition-all shadow-lg shadow-emerald-500/20"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
