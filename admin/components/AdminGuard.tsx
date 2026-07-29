'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/lib/store';
import { Loader2, Lock } from 'lucide-react';

interface Props { children: React.ReactNode; }

const ALLOWED_ROLES = ['admin', 'super_admin'];

export default function AdminGuard({ children }: Props) {
  const router = useRouter();
  const { isAuthenticated, user } = useAdminStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) router.push('/login');
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080c14]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080c14]">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="ml-3 text-sm text-gray-500">Redirecting to login…</p>
      </div>
    );
  }

  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#080c14] text-white gap-6 px-4">
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30">
          <Lock className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">Access Denied</h1>
          <p className="text-gray-400 mt-2 text-sm">
            This panel is restricted to <span className="text-red-400 font-semibold">Admin</span> and{' '}
            <span className="text-red-400 font-semibold">Super Admin</span> accounts only.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Signed in as: <span className="text-gray-400">{user?.email}</span> ({user?.role})
          </p>
        </div>
        <button
          onClick={() => { useAdminStore.getState().logout(); router.push('/login'); }}
          className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all"
        >
          Sign Out &amp; Try Again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
