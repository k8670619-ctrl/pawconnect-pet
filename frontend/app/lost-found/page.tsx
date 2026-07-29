'use client';

import React, { useState } from 'react';
import { AlertCircle, MapPin, Phone, Sparkles, Upload, Search, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function LostFoundPage() {
  const [reportType, setReportType] = useState<'Lost' | 'Found'>('Lost');
  const [imageUrl, setImageUrl] = useState('');
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const sampleReports = [
    {
      id: 101,
      type: "Lost",
      pet_name: "Sheru",
      category: "Dog",
      breed: "Indie / Pariah",
      location: "HSR Layout Sector 1, Bengaluru",
      reward: 5000,
      phone: "+91 99887 76655",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600"
    },
    {
      id: 102,
      type: "Found",
      pet_name: "Unknown Persian",
      category: "Cat",
      breed: "Persian",
      location: "Bandra West, Mumbai",
      reward: 0,
      phone: "+91 98200 11223",
      image: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600"
    }
  ];

  const handleAIMatch = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post('/ai/match-image', {
        image_url: imageUrl || "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500",
        description: "Beagle with brown ear spots"
      });
      setMatchResults(res.data.matches || []);
    } catch (err) {
      console.error(err);
    }
    setAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* High Priority Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-rose-950/60 border border-rose-500/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-extrabold mb-2 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Emergency Lost &amp; Found Network</span>
          </div>
          <h1 className="text-3xl font-black text-white">
            Lost &amp; Found Pets
          </h1>
          <p className="text-xs text-rose-200 mt-1">Reuniting lost pets in Chennai via 5km radius alerts and AI visual similarity search.</p>
        </div>

        <button 
          onClick={() => setReportType(reportType === 'Lost' ? 'Found' : 'Lost')}
          className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-extrabold text-sm shadow-xl shadow-rose-950/50 flex items-center justify-center gap-2 transition-all hover:scale-105"
        >
          <AlertCircle className="w-5 h-5" />
          <span>Report {reportType === 'Lost' ? 'Lost Pet' : 'Found Pet'}</span>
        </button>
      </div>

      {/* Chennai Live Emergency Map Placeholder */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <MapPin className="w-5 h-5 text-rose-400" />
            <span>Chennai Geo-Fenced Rescue Map (5km Alerts)</span>
          </div>
          <span className="text-[11px] text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Active Hub: Chennai, TN
          </span>
        </div>

        <div className="h-48 w-full rounded-2xl bg-slate-950 border border-slate-800/80 relative overflow-hidden flex items-center justify-center text-center p-6">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto animate-ping">
              <MapPin className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-300">Live Lost Pet Alert Radius Active in Chennai</p>
            <p className="text-[11px] text-slate-500">Connecting 50+ local NGO rescuers in Adyar, Anna Nagar &amp; Velachery</p>
          </div>
        </div>
      </div>

      {/* AI Visual Matching Upload Box */}
      <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Instant AI Visual Image Matcher</h3>
            <p className="text-xs text-gray-300">Upload photo of a lost or found pet to run instant similarity vector search across our database.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste pet photo URL or upload photo link..."
            className="sm:col-span-9 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleAIMatch}
            disabled={analyzing}
            className="sm:col-span-3 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> {analyzing ? 'Matching Vector...' : 'Run AI Search'}
          </button>
        </div>

        {/* AI Match Results */}
        {matchResults.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-amber-400">AI High Confidence Matches Found ({matchResults.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchResults.map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex gap-4">
                  <img src={m.image_url} alt={m.pet_name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="space-y-1 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                      {(m.confidence_score * 100).toFixed(0)}% Similarity Match
                    </span>
                    <h5 className="font-bold text-white">{m.pet_name} ({m.breed})</h5>
                    <p className="text-gray-400 text-[11px]">{m.last_seen}</p>
                    <p className="text-amber-400 font-bold text-[11px]">Contact: {m.contact_phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Reports List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Active Lost & Found Community Bulletins</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sampleReports.map((r) => (
            <div key={r.id} className="glass-panel p-5 rounded-2xl flex gap-5 border border-white/10">
              <img src={r.image} alt={r.pet_name} className="w-28 h-28 rounded-xl object-cover shrink-0" />
              <div className="space-y-2 text-xs flex-1">
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    r.type === 'Lost' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {r.type} Pet Report
                  </span>
                  {r.reward > 0 && (
                    <span className="text-amber-400 font-extrabold text-[11px]">₹{r.reward} Reward</span>
                  )}
                </div>

                <h4 className="font-bold text-white text-sm">{r.pet_name} ({r.breed})</h4>

                <div className="flex items-center gap-1.5 text-gray-300 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> {r.location}
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <a href={`tel:${r.phone}`} className="text-emerald-400 font-bold flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Call Reporter
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
