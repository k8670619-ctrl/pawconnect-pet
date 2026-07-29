'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, Send, ShieldAlert, HeartPulse, Dna, HelpCircle } from 'lucide-react';
import { sendAIChatPrompt } from '@/lib/api';

export default function AIAssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'breed' | 'symptom'>('chat');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; recs?: string[] }>>([
    {
      role: 'assistant',
      content: 'Welcome to PawConnect AI Health & Breed Consultation Center! Select a module below or type any question regarding your pet\'s well-being.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const query = queryText || prompt;
    if (!query.trim()) return;
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    const res = await sendAIChatPrompt(query, activeTab);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: res.reply,
      recs: res.recommendations
    }]);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" /> PawConnect AI Diagnostics & Consultation
        </h1>
        <p className="text-xs text-gray-400 mt-1">24/7 AI Veterinary advice, breed selector, and nutrition guidance grounded in veterinary science</p>
      </div>

      {/* Feature Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('chat')}
          className={`glass-panel p-5 rounded-2xl text-left border transition-all ${
            activeTab === 'chat' ? 'border-emerald-500 bg-emerald-950/30' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <Bot className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="font-bold text-white text-sm">General AI Vet Assistant</h3>
          <p className="text-[11px] text-gray-400 mt-1">Ask questions about diet, behavior, and care</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('breed');
            handleSend("Recommend top 3 breeds for an apartment in Mumbai with active lifestyle");
          }}
          className={`glass-panel p-5 rounded-2xl text-left border transition-all ${
            activeTab === 'breed' ? 'border-amber-500 bg-amber-950/30' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <Dna className="w-6 h-6 text-amber-400 mb-2" />
          <h3 className="font-bold text-white text-sm">AI Breed Selector</h3>
          <p className="text-[11px] text-gray-400 mt-1">Match pet breeds to home size & climate</p>
        </button>

        <button
          onClick={() => {
            setActiveTab('symptom');
            handleSend("Check symptoms: My dog has mild vomiting and fatigue since morning");
          }}
          className={`glass-panel p-5 rounded-2xl text-left border transition-all ${
            activeTab === 'symptom' ? 'border-red-500 bg-red-950/30' : 'border-white/10 hover:border-white/20'
          }`}
        >
          <HeartPulse className="w-6 h-6 text-red-400 mb-2" />
          <h3 className="font-bold text-white text-sm">Symptom & Urgency Checker</h3>
          <p className="text-[11px] text-gray-400 mt-1">Evaluate health symptoms and vet urgency</p>
        </button>
      </div>

      {/* Main Interactive Chat Box */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 h-[500px] flex flex-col">
        
        <div className="p-4 bg-slate-900 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
            <Bot className="w-4 h-4" /> Active Model: PawConnect AI Vet 2.0
          </span>
          <span className="text-[11px] text-gray-400">Response time: ~0.4s</span>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`p-4 rounded-2xl max-w-[80%] ${
                m.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-white/10 text-gray-200 rounded-tl-none space-y-2'
              }`}>
                <p className="whitespace-pre-line leading-relaxed text-xs">{m.content}</p>
                
                {m.recs && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="font-bold text-emerald-400 text-[10px]">Action Recommendations:</span>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {m.recs.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-emerald-400 text-xs italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" /> Analyzing veterinary knowledge base...
            </div>
          )}
        </div>

        {/* Query Input */}
        <div className="p-4 bg-slate-950 border-t border-white/10 flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your query e.g. 'Vaccination chart for 2 month old golden retriever'..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            className="px-6 py-3 rounded-xl gradient-button font-bold text-xs text-white flex items-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>

      </div>

    </div>
  );
}
