'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyOTP, resendOTP, sendOTP } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { PawPrint, Mail, Phone, CheckCircle2, AlertCircle, Sparkles, KeyRound, ArrowRight, RefreshCw, Lock } from 'lucide-react';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useAuthStore();

  const emailParam = searchParams.get('email') || user?.email || '';
  const phoneParam = searchParams.get('phone') || user?.phone || '';
  const initialOtpHint = searchParams.get('otp_hint') || '';

  const [otpCode, setOtpCode] = useState(initialOtpHint || '');
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [otpHint, setOtpHint] = useState(initialOtpHint);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 60-second Cooldown Timer State
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const targetValue = activeTab === 'email' ? emailParam : phoneParam;

  // Countdown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResendOTP = async () => {
    if (!targetValue || cooldown > 0 || isResending) return;
    setIsResending(true);
    setResendMessage('');
    setErrorMessage('');

    try {
      const res = await resendOTP({
        target: targetValue,
        channel: activeTab,
      });

      if (res?.otp_hint) {
        setOtpHint(res.otp_hint);
        setOtpCode(res.otp_hint);
      }

      setCooldown(res?.cooldown_seconds || 60);
      setResendMessage(`A fresh 6-digit OTP code has been sent to ${targetValue}!`);
    } catch (err: any) {
      if (err.response?.status === 429) {
        setErrorMessage(err.response?.data?.detail || 'Please wait before requesting another OTP.');
      } else {
        setResendMessage('OTP dispatched! (Check backend console log in dev mode)');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!otpCode || otpCode.length < 6) {
      setErrorMessage('Please enter the full 6-digit OTP code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyOTP({
        target: targetValue,
        otp_code: otpCode,
      });

      if (res && (res.status === 'success' || res.access_token)) {
        setIsSuccess(true);

        // Auto-login: Store JWT session in auth store
        if (res.user && res.access_token) {
          setUser(res.user, res.access_token);
        }

        // Auto-redirect to /dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      } else {
        setErrorMessage(res?.message || 'Invalid or expired 6-digit OTP code.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.detail || 'Verification failed. Please check the 6-digit OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 space-y-6">
      
      {/* Target Tabs */}
      <div className="flex bg-slate-800/60 p-1.5 rounded-2xl">
        <button
          type="button"
          onClick={() => { setActiveTab('email'); setErrorMessage(''); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'email'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          Email OTP
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('phone'); setErrorMessage(''); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'phone'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          SMS OTP
        </button>
      </div>

      {/* Dev Mode OTP Hint Banner */}
      {otpHint && !isSuccess && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Dev Console OTP Code:</span>
          </div>
          <span className="font-mono text-sm font-black tracking-widest text-amber-200 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/40">
            {otpHint}
          </span>
        </div>
      )}

      {isSuccess ? (
        <div className="p-8 bg-emerald-950/80 border border-emerald-500/40 rounded-3xl text-center space-y-3 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Verification Successful!</h3>
          <p className="text-xs text-emerald-200 font-medium">
            JWT Session Active • Automatically logging into Dashboard…
          </p>
          <div className="w-full bg-emerald-950 rounded-full h-1.5 overflow-hidden border border-emerald-500/20 mt-4">
            <div className="bg-emerald-400 h-full animate-pulse rounded-full w-full" />
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {resendMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{resendMessage}</span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Enter 6-Digit Code
              </label>
              <span className="text-[11px] text-slate-400 truncate max-w-[200px] font-medium">
                Target: {targetValue || 'Registered User'}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full tracking-[0.5em] text-center text-2xl font-black py-4 bg-slate-950/90 border border-slate-700 focus:border-emerald-500 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Verifying OTP &amp; Logging In...</span>
            ) : (
              <>
                <span>Verify OTP &amp; Auto-Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Resend OTP with 60-second Cooldown */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800">
            <span>Didn't receive the OTP?</span>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={cooldown > 0 || isResending}
              className={`font-bold flex items-center gap-1.5 transition-colors ${
                cooldown > 0 || isResending
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              {cooldown > 0 ? (
                <span>Resend in {cooldown}s</span>
              ) : (
                <span>Resend OTP</span>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <PawPrint className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            PawConnect <span className="text-emerald-400">AI</span>
          </span>
        </Link>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          6-Digit OTP Verification
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter the OTP sent via Email or SMS to verify &amp; auto-login to Dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <Suspense fallback={<div className="text-center text-white text-xs py-10">Loading OTP verification form...</div>}>
          <VerifyOTPContent />
        </Suspense>
      </div>
    </div>
  );
}
