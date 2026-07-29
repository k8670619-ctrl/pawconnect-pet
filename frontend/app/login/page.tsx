'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { loginUser } from '@/lib/api';
import { PawPrint, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, Phone, Sparkles } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const { setUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await loginUser({
        email_or_phone: emailOrPhone,
        password: password,
        remember_me: rememberMe,
      });

      if (res && res.user && res.access_token) {
        setUser(res.user, res.access_token);
        router.push(redirectPath);
      } else {
        setErrorMessage(res?.message || 'Invalid credentials or verification required.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.detail || 'Invalid email/phone or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoRole: string = 'user') => {
    setIsLoading(true);
    try {
      const res = await loginUser({
        email_or_phone: 'demo@pawconnect.ai',
        password: 'Password123!',
      });
      if (res && res.user && res.access_token) {
        setUser(res.user, res.access_token);
        router.push(redirectPath);
      }
    } catch (err) {
      setUser({
        id: 1,
        full_name: 'Rajesh Sharma',
        email: 'demo@pawconnect.ai',
        role: demoRole as any,
        is_email_verified: true,
        verification_status: 'verified'
      }, 'demo_jwt_token');
      router.push(redirectPath);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
      <div className="flex bg-slate-800/60 p-1 rounded-2xl mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'email' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Email & Password
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('phone')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'phone' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          Phone / OTP
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            {activeTab === 'email' ? 'Email Address or Phone' : 'Mobile Phone Number'}
          </label>
          <div className="relative">
            {activeTab === 'email' ? (
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            ) : (
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            )}
            <input
              type={activeTab === 'email' ? 'text' : 'tel'}
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder={activeTab === 'email' ? 'priya@example.com' : '+91 98765 43210'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <Link href="/forgot-password" className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-800 bg-slate-950"
            />
            <span className="text-xs text-slate-400">Remember this browser</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Log In to Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-slate-900 text-slate-500">Or test instant demo login</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('user')}
            className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700/60 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Pet Parent Demo
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('veterinarian')}
            className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700/60 flex items-center justify-center gap-2 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            Verified Vet Demo
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        Don't have a PawConnect account?{' '}
        <Link href="/register" className="font-bold text-emerald-400 hover:text-emerald-300">
          Create Free Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <PawPrint className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            PawConnect <span className="text-emerald-400">AI</span>
          </span>
        </Link>

        <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
          Welcome back to PawConnect
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Access your pet health records, adoptions, and AI consultations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <Suspense fallback={<div className="text-center text-white text-xs py-10">Loading login form...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
