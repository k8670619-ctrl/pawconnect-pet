'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Public-facing route guard.
 * - Allows access to all public routes without authentication.
 * - Redirects unauthenticated users to /login for protected routes.
 * - /admin/* routes are EXCLUDED here — they use AdminGuard instead.
 */

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify',
  '/verify-otp',
  '/pets',
  '/adoption',
  '/marketplace',
  '/rescue',
  '/services',
  '/ai-assistant',
  '/community',
  '/lost-found',
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  // Public prefixes — pet detail, marketplace detail pages
  if (pathname.startsWith('/pets/')) return true;
  if (pathname.startsWith('/marketplace/')) return true;
  if (pathname.startsWith('/adoption/')) return true;
  // Admin routes are handled separately by AdminGuard — skip here
  if (pathname.startsWith('/admin')) return true;
  return false;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isPublicRoute(pathname) && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading PawConnect AI...</p>
      </div>
    );
  }

  if (!isPublicRoute(pathname) && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
