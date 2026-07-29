'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import { MessageSquare, Send, User, ShieldCheck } from 'lucide-react';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [inputMsg, setInputMsg] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Dr. Ananya Roy (Vet)',
      role: 'Verified Tele-Vet',
      lastMsg: 'Ensure Milo gets 100ml water and monitor temperature.',
      time: '12:45 PM',
      unread: 1,
    },
    {
      id: 2,
      name: 'Bangalore Animal Shelter',
      role: 'Shelter Manager',
      lastMsg: 'When would you like to schedule Bella adoption visit?',
      time: 'Yesterday',
      unread: 0,
    },
  ];

  const messages = [
    { id: 1, sender: 'them', text: 'Hello! I am Dr. Ananya. How is Milo doing today?' },
    { id: 2, sender: 'me', text: 'Hi doctor, he is feeling better after the vaccine dose.' },
    { id: 3, sender: 'them', text: 'Ensure Milo gets 100ml water and monitor temperature.' },
  ];

  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto h-[75vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3">
          
          {/* Left Chat List */}
          <div className="border-r border-slate-800 p-4 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Direct Messages
            </h2>

            <div className="space-y-1">
              {chats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c.id)}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-3 ${
                    activeChat === c.id ? 'bg-emerald-950/60 border border-emerald-500/30' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">{c.name}</p>
                      <span className="text-[10px] text-slate-500">{c.time}</span>
                    </div>
                    <p className="text-[10px] text-emerald-400 font-semibold">{c.role}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMsg}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Chat Conversation Window */}
          <div className="md:col-span-2 flex flex-col justify-between p-4 bg-slate-950/50">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{chats[0].name}</h3>
                <p className="text-[11px] text-emerald-400 font-semibold">{chats[0].role}</p>
              </div>
            </div>

            {/* Chat Bubbles */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs ${
                      m.sender === 'me'
                        ? 'bg-emerald-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => e.preventDefault()} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
