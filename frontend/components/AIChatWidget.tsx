'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, X, AlertTriangle } from 'lucide-react';
import { sendAIChatPrompt } from '@/lib/api';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; recs?: string[]; urgency?: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am PawConnect AI assistant. How can I help your pet today? Ask me about breed recommendations, health symptoms, or vaccination guidelines!'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    const res = await sendAIChatPrompt(userMsg);
    setMessages(prev => [...prev, {
      sender: 'ai',
      text: res.reply,
      recs: res.recommendations,
      urgency: res.urgency_level
    }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating launcher trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-tr from-brand-600 to-amberBrand-500 text-white shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all flex items-center gap-2 group"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="font-bold text-sm hidden sm:inline">Ask PawConnect AI</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[550px] glass-panel rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-700 to-amberBrand-600 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">PawConnect AI Assistant</h3>
                <span className="text-[10px] text-emerald-200 block">24/7 Vet & Breed Advisor</span>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`p-3 rounded-2xl max-w-[80%] ${
                  m.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-gray-200 border border-white/10 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  
                  {m.urgency && m.urgency !== 'Normal' && (
                    <div className="mt-2 p-2 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" /> Urgency Level: {m.urgency}
                    </div>
                  )}

                  {m.recs && m.recs.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                      <span className="font-semibold text-emerald-400 block text-[10px]">Key Insights:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-300">
                        {m.recs.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-xs italic flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" /> Thinking...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-white/10 bg-slate-950 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about symptoms, breed advice, pet names..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-xl gradient-button text-white shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
