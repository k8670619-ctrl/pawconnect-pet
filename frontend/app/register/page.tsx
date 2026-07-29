'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser, checkUsernameAvailability, requestOTP } from '@/lib/api';

import { useAuthStore } from '@/lib/store';
import {
  PawPrint,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Stethoscope,
  Scissors,
  Store,
  Sparkles,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'seller' | 'shelter' | 'ngo' | 'veterinarian' | 'groomer'>('user');
  
  const [showPassword, setShowPassword] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<{ checked: boolean; available: boolean; message: string }>({
    checked: false,
    available: false,
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password strength check
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleUsernameBlur = async () => {
    if (!username.trim() || username.length < 3) return;
    const res = await checkUsernameAvailability(username);
    setUsernameCheck({
      checked: true,
      available: res.available,
      message: res.message,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all strength requirements.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerUser({
        full_name: fullName,
        username: username || undefined,
        email,
        phone: phone || undefined,
        password,
        role,
      });

      if (res && res.status === 'success') {
        // Request OTP for the newly registered email
        let otpHint = '123456';
        try {
          const otpRes = await requestOTP({ target: email, otp_type: 'email_verification' });
          if (otpRes?.otp_hint) {
            otpHint = otpRes.otp_hint;
          }
        } catch (otpErr) {
          console.log('OTP generation notice:', otpErr);
        }

        router.push(
          `/verify-otp?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&otp_hint=${encodeURIComponent(otpHint)}`
        );
      } else {
        setErrorMessage(res?.message || 'Registration failed. Please check form fields.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.detail || 'Failed to create account. Email or phone may already exist.');
    } finally {
      setIsLoading(false);
    }
  };

  const rolesList = [
    { id: 'user', label: 'Pet Parent', desc: 'Adopt, buy, & care for pets', icon: User, color: 'text-emerald-400' },
    { id: 'seller', label: 'Pet Breeder / Seller', desc: 'Sell verified healthy pets', icon: Store, color: 'text-blue-400' },
    { id: 'shelter', label: 'Pet Shelter', desc: 'List pets for adoption', icon: Building2, color: 'text-amber-400' },
    { id: 'ngo', label: 'Animal NGO', desc: 'SOS emergency rescue & fund', icon: ShieldCheck, color: 'text-rose-400' },
    { id: 'veterinarian', label: 'Veterinarian', desc: '24/7 online consultations', icon: Stethoscope, color: 'text-teal-400' },
    { id: 'groomer', label: 'Pet Groomer', desc: 'Spa & grooming bookings', icon: Scissors, color: 'text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/3 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <PawPrint className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            PawConnect <span className="text-emerald-400">AI</span>
          </span>
        </Link>

        <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
          Join India's Verified Pet Platform
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Create your verified account in under 60 seconds
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selection Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {rolesList.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className={`w-5 h-5 ${r.color}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-bold text-white leading-tight">{r.label}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Username
                  </label>
                  {usernameCheck.checked && (
                    <span className={`text-[10px] font-bold ${usernameCheck.available ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {usernameCheck.available ? '✓ Available' : '✗ Taken'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 text-xs">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    onBlur={handleUsernameBlur}
                    placeholder="priyasharma"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
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

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Checklist */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
              <p className="text-[11px] font-bold text-slate-400 mb-1">Password Requirements:</p>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <span className={hasMinLength ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓ At least 8 characters</span>
                <span className={hasUpper ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓ Uppercase letter (A-Z)</span>
                <span className={hasLower ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓ Lowercase letter (a-z)</span>
                <span className={hasNumber ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓ One number (0-9)</span>
                <span className={hasSpecial ? 'text-emerald-400 font-bold' : 'text-slate-500'}>✓ Special symbol (!@#$)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <span>Creating PawConnect Account...</span>
              ) : (
                <>
                  <span>Create Account & Verify OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already registered on PawConnect?{' '}
            <Link href="/login" className="font-bold text-emerald-400 hover:text-emerald-300">
              Log In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
