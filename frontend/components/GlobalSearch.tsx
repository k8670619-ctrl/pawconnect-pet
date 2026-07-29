'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X, Sparkles, Dog, ShoppingBag, Stethoscope, AlertTriangle } from 'lucide-react';

export default function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (category === 'pets') {
      router.push(`/pets?search=${encodeURIComponent(query)}`);
    } else if (category === 'marketplace') {
      router.push(`/marketplace?search=${encodeURIComponent(query)}`);
    } else if (category === 'rescue') {
      router.push(`/rescue?search=${encodeURIComponent(query)}`);
    } else {
      router.push(`/pets?search=${encodeURIComponent(query)}`);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pets, food, vets, rescue..."
          className="w-full pl-10 pr-20 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-emerald-500 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-200 rounded-full shadow-sm flex items-center gap-1 transition-colors"
        >
          <Filter className="w-3 h-3 text-emerald-600" />
          <span className="capitalize">{category}</span>
        </button>
      </form>

      {/* Filter Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Filters</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {[
              { id: 'all', label: 'All Categories', icon: Sparkles, color: 'text-amber-500' },
              { id: 'pets', label: 'Adopt / Buy Pets', icon: Dog, color: 'text-emerald-500' },
              { id: 'marketplace', label: 'Marketplace Supplies', icon: ShoppingBag, color: 'text-blue-500' },
              { id: 'rescue', label: 'SOS Rescue Alerts', icon: AlertTriangle, color: 'text-rose-500' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCategory(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  category === item.id
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
