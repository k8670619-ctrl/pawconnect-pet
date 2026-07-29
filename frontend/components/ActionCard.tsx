'use client';

import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  badge?: string;
}

export default function ActionCard({
  title,
  description,
  href,
  icon: Icon,
  gradient,
  badge,
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group relative p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
    >
      {/* Background Accent Gradient */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-25 transition-opacity`} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7" />
          </div>
          {badge && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold tracking-wider uppercase">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-400 transition-colors mb-2">
          {title}
        </h3>
        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 group-hover:text-emerald-300 transition-colors">
        <span>Explore Now</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
