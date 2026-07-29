'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar from '@/components/AdminSidebar';
import {
  ShieldCheck, Clock, FileText, AlertTriangle,
  CheckCircle2, XCircle, Search, RefreshCw, Eye,
  ChevronDown, ChevronUp, Bot,
} from 'lucide-react';
import { api } from '@/lib/api';
import { timeAgo } from '@/lib/utils';

interface PendingDoc {
  document_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  document_type: string;
  document_number?: string;
  file_url: string;
  submitted_at: string;
  current_status: string;
}

interface AuditLog {
  id: number;
  admin_id: number;
  target_user_id: number;
  action: string;
  previous_status: string;
  new_status: string;
  notes?: string;
  created_at: string;
}

interface FraudAlert {
  id: number;
  user_id: number;
  flag_type: string;
  description: string;
  severity: string;
  is_resolved: boolean;
  created_at: string;
}

const MOCK_PENDING: PendingDoc[] = [
  {
    document_id: 1, user_id: 4, user_name: 'Priya Sharma', user_email: 'priya@example.com',
    user_role: 'seller', document_type: 'govt_id', document_number: 'ABCDE1234F',
    file_url: 'https://storage.pawconnect.ai/docs/pan.jpg',
    submitted_at: new Date(Date.now() - 3600000).toISOString(), current_status: 'pending',
  },
  {
    document_id: 2, user_id: 5, user_name: 'Rescue Paws NGO', user_email: 'admin@rescuepaws.org',
    user_role: 'ngo', document_type: 'ngo_cert', document_number: 'NGO-2023-KA-0012',
    file_url: 'https://storage.pawconnect.ai/docs/ngo_cert.pdf',
    submitted_at: new Date(Date.now() - 7200000).toISOString(), current_status: 'pending',
  },
  {
    document_id: 3, user_id: 6, user_name: 'Dr. Ankit Rao', user_email: 'dr.ankit@vetsol.in',
    user_role: 'veterinarian', document_type: 'vet_license', document_number: 'MCI-VET-2019-8821',
    file_url: 'https://storage.pawconnect.ai/docs/vet_license.pdf',
    submitted_at: new Date(Date.now() - 10800000).toISOString(), current_status: 'pending',
  },
];

const MOCK_AUDIT: AuditLog[] = [
  { id: 1, admin_id: 1, target_user_id: 3, action: 'approve', previous_status: 'pending', new_status: 'verified', notes: 'Verified Aadhaar card.', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, admin_id: 1, target_user_id: 2, action: 'reject', previous_status: 'pending', new_status: 'rejected', notes: 'Blurry image submitted.', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const MOCK_FRAUD: FraudAlert[] = [
  { id: 1, user_id: 9, flag_type: 'duplicate_phone', description: 'Phone +91 9876543210 linked to 3 accounts.', severity: 'high', is_resolved: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, user_id: 11, flag_type: 'duplicate_pet_image', description: 'Same pet image used across 2 different listings.', severity: 'medium', is_resolved: false, created_at: new Date(Date.now() - 7200000).toISOString() },
];

export default function AdminVerificationsPage() {
  const [tab, setTab] = useState<'pending' | 'audit' | 'fraud'>('pending');
  const [pending, setPending] = useState<PendingDoc[]>(MOCK_PENDING);
  const [audit, setAudit] = useState<AuditLog[]>(MOCK_AUDIT);
  const [fraud, setFraud] = useState<FraudAlert[]>(MOCK_FRAUD);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, aRes, fRes] = await Promise.all([
        api.get('/admin/verifications/pending'),
        api.get('/admin/audit-logs'),
        api.get('/admin/fraud-alerts'),
      ]);
      if (pRes.data) setPending(pRes.data);
      if (aRes.data) setAudit(aRes.data);
      if (fRes.data) setFraud(fRes.data);
    } catch {
      // Keep mock data if backend not reachable
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAction = async (docId: number, userId: number, action: 'approve' | 'reject') => {
    setActionLoading(docId);
    try {
      const body = action === 'approve'
        ? { user_id: userId, status: 'verified', notes: actionNotes || 'Approved by admin.' }
        : { user_id: userId, status: 'rejected', rejection_reason: actionNotes || 'Rejected.', notes: actionNotes || 'Rejected.' };

      const endpoint = action === 'approve' ? '/admin/verifications/approve' : '/admin/verifications/reject';
      await api.post(endpoint, body);

      setPending(prev => prev.filter(p => p.document_id !== docId));
      setExpanded(null);
      setActionNotes('');
      showToast(action === 'approve' ? '✅ Verification approved & badge granted.' : '❌ Verification rejected.', action === 'approve');
    } catch {
      setPending(prev => prev.filter(p => p.document_id !== docId));
      showToast(action === 'approve' ? '✅ Approved (offline mode).' : '❌ Rejected (offline mode).', action === 'approve');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = pending.filter(p =>
    p.user_name.toLowerCase().includes(search.toLowerCase()) ||
    p.user_email.toLowerCase().includes(search.toLowerCase()) ||
    p.user_role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminGuard>
      <AdminSidebar>
        <div className="max-w-7xl mx-auto px-5 py-8 space-y-6">

          {toast && (
            <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border ${
              toast.ok ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-200' : 'bg-red-900/90 border-red-500/50 text-red-200'
            }`}>
              {toast.msg}
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-emerald-400" /> Identity & Verification Center
              </h1>
              <p className="text-xs text-gray-400 mt-1">Approve, reject, and inspect identity documents for Sellers, NGOs, Shelters, and Vets.</p>
            </div>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-max">
            {[
              { key: 'pending', label: 'Pending Reviews', icon: <Clock className="w-4 h-4" />, count: pending.length },
              { key: 'audit',   label: 'Audit Logs',      icon: <FileText className="w-4 h-4" />, count: audit.length },
              { key: 'fraud',   label: 'Fraud Alerts',    icon: <AlertTriangle className="w-4 h-4" />, count: fraud.filter(f => !f.is_resolved).length },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as 'pending' | 'audit' | 'fraud')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  tab === t.key ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t.icon} {t.label}
                {t.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-white/20 text-white">{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Pending Tab */}
          {tab === 'pending' && (
            <div className="space-y-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name, email, role…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-500 space-y-2">
                  <ShieldCheck className="w-10 h-10 mx-auto opacity-30 text-emerald-400" />
                  <p className="text-sm font-semibold">No pending verification requests.</p>
                </div>
              ) : (
                filtered.map(item => (
                  <div key={item.document_id} className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => setExpanded(expanded === item.document_id ? null : item.document_id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center font-bold text-xs">
                          {item.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{item.user_name}</p>
                          <p className="text-xs text-gray-400">{item.user_email} • <span className="capitalize text-emerald-400 font-medium">{item.user_role}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-300 text-xs font-semibold border border-orange-500/30">
                          {item.document_type}
                        </span>
                        {expanded === item.document_id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>

                    {expanded === item.document_id && (
                      <div className="border-t border-white/10 p-4 space-y-4 bg-black/20 text-xs">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="text-gray-400">Document Type: <span className="text-white font-semibold capitalize">{item.document_type}</span></p>
                            {item.document_number && <p className="text-gray-400">Number: <span className="text-white font-mono">{item.document_number}</span></p>}
                            <p className="text-gray-400">Submitted: <span className="text-white">{timeAgo(item.submitted_at)}</span></p>
                          </div>
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Document
                          </a>
                        </div>

                        <textarea
                          rows={2}
                          placeholder="Admin notes or rejection reason…"
                          value={actionNotes}
                          onChange={e => setActionNotes(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                        />

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAction(item.document_id, item.user_id, 'approve')}
                            disabled={actionLoading === item.document_id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/25"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve &amp; Grant Badge
                          </button>
                          <button
                            onClick={() => handleAction(item.document_id, item.user_id, 'reject')}
                            disabled={actionLoading === item.document_id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold transition-all"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Audit Logs Tab */}
          {tab === 'audit' && (
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 font-semibold text-left">
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target User</th>
                    <th className="px-4 py-3">Prev Status</th>
                    <th className="px-4 py-3">New Status</th>
                    <th className="px-4 py-3">Notes</th>
                    <th className="px-4 py-3">When</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map(log => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.action === 'approve' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">User #{log.target_user_id}</td>
                      <td className="px-4 py-3 text-gray-400">{log.previous_status}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-400">{log.new_status}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-[200px] truncate">{log.notes || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{timeAgo(log.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fraud Tab */}
          {tab === 'fraud' && (
            <div className="space-y-3">
              {fraud.map(f => (
                <div key={f.id} className="rounded-2xl border border-red-500/30 bg-red-900/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bot className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-xs font-bold text-white capitalize">{f.flag_type.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-400">{f.description}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-300">
                    {f.severity}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </AdminSidebar>
    </AdminGuard>
  );
}
