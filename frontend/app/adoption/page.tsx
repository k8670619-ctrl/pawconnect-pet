'use client';

import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, FileCheck, Home, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdoptionPage() {
  const steps = [
    { title: '1. Select Verified Pet', desc: 'Browse hundreds of shelter & rescue pets with verified medical records.' },
    { title: '2. Digital Application', desc: 'Submit home details, lifestyle context, and pet experience.' },
    { title: '3. Volunteer Home Check', desc: 'A regional NGO partner conducts a quick home safety check.' },
    { title: '4. Digital Agreement & Handover', desc: 'Sign non-abandonment agreement and welcome your companion home!' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Banner Header */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl relative overflow-hidden bg-gradient-to-r from-brand-900/40 to-slate-900 border border-emerald-500/30">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            <HeartHandshake className="w-4 h-4" /> Zero-Fee Ethical Adoption
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">Give a Stray or Rescue Pet a Forever Home</h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            PawConnect AI connects compassionate adopters with 40+ verified NGO shelters across India. Every adoption includes 1st-year rabies vaccination and digital health passport.
          </p>
          <div className="pt-2 flex gap-4">
            <Link href="/pets?listing_type=adoption" className="px-6 py-3 rounded-xl gradient-button text-xs font-bold text-white shadow-lg">
              Browse Adoption Pets
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Step Workflow Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Transparent 4-Step Adoption Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div key={idx} className="glass-panel p-6 rounded-2xl space-y-3 relative border border-white/10 hover:border-emerald-500/50 transition-all">
              <span className="text-xs font-bold text-emerald-400 block">{s.title}</span>
              <p className="text-xs text-gray-300 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Shelters Showcase */}
      <div className="glass-panel p-8 rounded-3xl space-y-6 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Featured NGO & Shelter Partners</h3>
            <p className="text-xs text-gray-400">Verified welfare organizations managing active rescues</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold">42 Active Partners</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { name: "CUPA Shelter Bengaluru", location: "Bengaluru, KA", count: "48 Pets Available" },
            { name: "YODA Animal Welfare NGO", location: "Mumbai, MH", count: "32 Pets Available" },
            { name: "Friendicoes SECA Shelter", location: "New Delhi", count: "64 Pets Available" }
          ].map((org, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm">{org.name}</h4>
              <p className="text-xs text-gray-400">{org.location}</p>
              <span className="inline-block text-[11px] text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                {org.count}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
