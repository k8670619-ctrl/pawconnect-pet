'use client';

import Link from 'next/link';
import { PawPrint, PhoneCall, ShieldCheck, Heart, Mail, Send, Award, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 relative overflow-hidden">
      {/* Subtle Background Glow Effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top 24/7 SOS Emergency Hotline Banner */}
        <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-emerald-950/80 border border-rose-900/40 rounded-3xl p-6 mb-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/30 animate-pulse">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-1">
                24/7 National Emergency SOS
              </span>
              <h4 className="text-lg font-bold text-white">Animal In Distress or Immediate Medical Need?</h4>
              <p className="text-xs text-slate-300">Tap to alert nearby verified rescue volunteers, NGOs, & tele-vets instantly.</p>
            </div>
          </div>

          <a
            href="tel:1800-PAW-HELP"
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-rose-600/30 transition-all hover:scale-105 shrink-0 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            Call 1800-PAW-HELP
          </a>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <PawPrint className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                PawConnect <span className="text-emerald-500">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier AI-powered pet care ecosystem. Empowering pet parents, verified shelters, NGOs, and veterinarians with AI diagnosis, verified background checks, and instant adoption.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Background Verified
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-teal-400 bg-teal-950/60 px-3 py-1.5 rounded-full border border-teal-800/40">
                <Award className="w-3.5 h-3.5" />
                ISO 27001 Certified
              </div>
            </div>
          </div>

          {/* Column 1: Services */}
          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-wider mb-4">Core Ecosystem</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/pets" className="hover:text-emerald-400 transition-colors">Adopt or Buy Pets</Link></li>
              <li><Link href="/adoption" className="hover:text-emerald-400 transition-colors">Shelter Adoption Process</Link></li>
              <li><Link href="/marketplace" className="hover:text-emerald-400 transition-colors">Pet Food & Care Supplies</Link></li>
              <li><Link href="/services" className="hover:text-emerald-400 transition-colors">Book Grooming & Tele-Vet</Link></li>
              <li><Link href="/ai-assistant" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                <span>AI Health Assistant</span>
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </Link></li>
            </ul>
          </div>

          {/* Column 2: Emergency & NGO */}
          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-wider mb-4">Emergency & NGO</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/rescue" className="hover:text-rose-400 transition-colors">Report SOS Animal Rescue</Link></li>
              <li><Link href="/lost-found" className="hover:text-amber-400 transition-colors">Lost & Found Pet Registry</Link></li>
              <li><Link href="/ngo-donate" className="hover:text-emerald-400 transition-colors">Donate to NGO & Shelters</Link></li>
              <li><Link href="/veterinarians" className="hover:text-emerald-400 transition-colors">Verified Vet Directory</Link></li>
              <li><Link href="/seller-onboarding" className="hover:text-emerald-400 transition-colors">Become Verified Seller</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-wider mb-4">Pet Care Digest</h5>
            <p className="text-xs text-slate-400 mb-3">Get weekly AI pet health tips, vaccination reminders, and adoption alerts.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Subscribe</span>
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} PawConnect AI Platform Inc. All rights reserved. Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 inline mx-0.5" /> for pet lovers.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/security" className="hover:text-slate-300">Security Audit</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
