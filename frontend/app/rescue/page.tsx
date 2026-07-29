'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Phone, Shield, Radio, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function RescuePage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    animal_type: 'Dog',
    location: '',
    urgency: 'Critical',
    description: '',
    reporter_phone: ''
  });
  const [broadcasted, setBroadcasted] = useState(false);

  useEffect(() => {
    api.get('/rescue/alerts').then(res => setAlerts(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/rescue/alert', form);
      setBroadcasted(true);
      api.get('/rescue/alerts').then(res => setAlerts(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Emergency Header Banner */}
      <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-red-950/60 to-slate-900 border border-red-500/40 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center animate-pulse">
            <Radio className="w-7 h-7" />
          </div>
          <div>
            <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider">
              24x7 Pan-India NGO Alert Dispatch
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">Emergency Animal Rescue SOS</h1>
          </div>
        </div>
        <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
          Report injured, trapped, or critically ill stray animals. Your alert instantly pings 40+ verified NGO animal welfare partners with GPS coordinates.
        </p>
      </div>

      {/* Grid Layout: Report Form + Live Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOS Alert Form */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl space-y-5 border border-red-500/30">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" /> Broadcast Emergency Alert
          </h3>

          {broadcasted ? (
            <div className="p-5 rounded-2xl bg-red-950/60 border border-red-500 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-white text-sm">Alert Broadcasted!</h4>
              <p className="text-xs text-gray-300">Nearest NGO ambulance unit notified. Stand by for a call on your provided phone number.</p>
              <button onClick={() => setBroadcasted(false)} className="mt-2 text-xs text-red-400 font-bold underline">
                Send another alert
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Issue Headline</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="e.g. Injured stray dog hit by car"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Animal Type</label>
                  <select
                    value={form.animal_type}
                    onChange={(e) => setForm({...form, animal_type: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Cattle">Cattle / Cow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Urgency</label>
                  <select
                    value={form.urgency}
                    onChange={(e) => setForm({...form, urgency: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                  >
                    <option value="Critical">Critical (Immediate)</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Exact Spot / Landmark</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  placeholder="e.g. Koramangala 4th Block, opposite Sony signal"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Your Mobile Number (For NGO Dispatch)</label>
                <input
                  type="text"
                  required
                  value={form.reporter_phone}
                  onChange={(e) => setForm({...form, reporter_phone: e.target.value})}
                  placeholder="+91 98000 00000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description of Injury / Condition</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Describe injury, bleeding, or trapped condition..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30"
              >
                DISPATCH SOS ALERT NOW
              </button>
            </form>
          )}
        </div>

        {/* Live Broadcast Feed */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" /> Active NGO Dispatch Network Alerts
          </h3>

          <div className="space-y-4">
            {alerts.map((a) => (
              <div key={a.id} className="glass-panel p-5 rounded-2xl border border-white/10 flex gap-4">
                <div className="w-3 rounded-full bg-red-500 shrink-0" />
                <div className="space-y-1.5 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 font-extrabold text-[10px]">
                      {a.urgency} Urgency
                    </span>
                    <span className="text-gray-400 text-[10px]">Status: {a.status}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{a.title}</h4>
                  <p className="text-gray-300 text-[11px] leading-relaxed">{a.description}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-red-400" /> {a.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
