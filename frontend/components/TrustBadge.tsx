'use client';

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  Award,
  Building2,
  Stethoscope,
  Scissors,
  HeartHandshake,
} from 'lucide-react';

export type BadgeType =
  | 'unverified'
  | 'pending'
  | 'verified'
  | 'verified_seller'
  | 'verified_ngo'
  | 'verified_shelter'
  | 'verified_vet'
  | 'verified_groomer'
  | 'top_rated'
  | 'rejected';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface TrustBadgeProps {
  badge: BadgeType;
  trustScore?: number;
  size?: BadgeSize;
  showLabel?: boolean;
  showScore?: boolean;
  className?: string;
}

interface BadgeConfig {
  label: string;
  icon: React.ReactNode;
  bgClass: string;
  textClass: string;
  borderClass: string;
  glowClass: string;
  ringClass: string;
}

const ICON_SIZE: Record<BadgeSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const TEXT_SIZE: Record<BadgeSize, string> = {
  xs: 'text-[9px]',
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
};

const PADDING: Record<BadgeSize, string> = {
  xs: 'px-1.5 py-0.5',
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
  lg: 'px-3 py-1.5',
};

function getBadgeConfig(badge: BadgeType, iconSize: string): BadgeConfig {
  switch (badge) {
    case 'verified':
      return {
        label: 'Verified',
        icon: <ShieldCheck className={iconSize} />,
        bgClass: 'bg-emerald-500/15',
        textClass: 'text-emerald-300',
        borderClass: 'border-emerald-500/40',
        glowClass: 'shadow-emerald-500/20',
        ringClass: 'ring-emerald-500/30',
      };
    case 'verified_seller':
      return {
        label: 'Verified Seller',
        icon: <Award className={iconSize} />,
        bgClass: 'bg-amber-500/15',
        textClass: 'text-amber-300',
        borderClass: 'border-amber-500/40',
        glowClass: 'shadow-amber-500/20',
        ringClass: 'ring-amber-500/30',
      };
    case 'verified_ngo':
      return {
        label: 'Verified NGO',
        icon: <HeartHandshake className={iconSize} />,
        bgClass: 'bg-pink-500/15',
        textClass: 'text-pink-300',
        borderClass: 'border-pink-500/40',
        glowClass: 'shadow-pink-500/20',
        ringClass: 'ring-pink-500/30',
      };
    case 'verified_shelter':
      return {
        label: 'Verified Shelter',
        icon: <Building2 className={iconSize} />,
        bgClass: 'bg-sky-500/15',
        textClass: 'text-sky-300',
        borderClass: 'border-sky-500/40',
        glowClass: 'shadow-sky-500/20',
        ringClass: 'ring-sky-500/30',
      };
    case 'verified_vet':
      return {
        label: 'Licensed Vet',
        icon: <Stethoscope className={iconSize} />,
        bgClass: 'bg-violet-500/15',
        textClass: 'text-violet-300',
        borderClass: 'border-violet-500/40',
        glowClass: 'shadow-violet-500/20',
        ringClass: 'ring-violet-500/30',
      };
    case 'verified_groomer':
      return {
        label: 'Verified Groomer',
        icon: <Scissors className={iconSize} />,
        bgClass: 'bg-cyan-500/15',
        textClass: 'text-cyan-300',
        borderClass: 'border-cyan-500/40',
        glowClass: 'shadow-cyan-500/20',
        ringClass: 'ring-cyan-500/30',
      };
    case 'top_rated':
      return {
        label: 'Top Rated',
        icon: <Star className={`${iconSize} fill-current`} />,
        bgClass: 'bg-yellow-500/15',
        textClass: 'text-yellow-300',
        borderClass: 'border-yellow-500/40',
        glowClass: 'shadow-yellow-500/20',
        ringClass: 'ring-yellow-500/30',
      };
    case 'pending':
      return {
        label: 'Pending Review',
        icon: <Clock className={iconSize} />,
        bgClass: 'bg-orange-500/10',
        textClass: 'text-orange-300',
        borderClass: 'border-orange-500/30',
        glowClass: 'shadow-orange-500/10',
        ringClass: 'ring-orange-500/20',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        icon: <XCircle className={iconSize} />,
        bgClass: 'bg-red-500/10',
        textClass: 'text-red-400',
        borderClass: 'border-red-500/30',
        glowClass: 'shadow-red-500/10',
        ringClass: 'ring-red-500/20',
      };
    default:
      return {
        label: 'Unverified',
        icon: <Shield className={iconSize} />,
        bgClass: 'bg-gray-500/10',
        textClass: 'text-gray-400',
        borderClass: 'border-gray-500/20',
        glowClass: '',
        ringClass: 'ring-gray-500/10',
      };
  }
}

function getTrustScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

function getTrustScoreBar(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

/**
 * TrustBadge — displays verification badge + optional trust score for
 * users, pets, sellers, shelters, NGOs, and veterinarians throughout the app.
 */
export default function TrustBadge({
  badge,
  trustScore,
  size = 'sm',
  showLabel = true,
  showScore = false,
  className = '',
}: TrustBadgeProps) {
  const iconSize = ICON_SIZE[size];
  const config = getBadgeConfig(badge, iconSize);

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      {/* Badge pill */}
      <span
        className={`
          inline-flex items-center gap-1 rounded-full border font-semibold
          shadow-sm transition-all duration-200 select-none
          ${config.bgClass} ${config.textClass} ${config.borderClass}
          ${config.glowClass ? `shadow-md ${config.glowClass}` : ''}
          ${PADDING[size]} ${TEXT_SIZE[size]}
        `}
        title={config.label}
      >
        {config.icon}
        {showLabel && <span>{config.label}</span>}
      </span>

      {/* Trust Score bar */}
      {showScore && typeof trustScore === 'number' && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${getTrustScoreBar(trustScore)}`}
              style={{ width: `${trustScore}%` }}
            />
          </div>
          <span className={`text-[9px] font-bold tabular-nums ${getTrustScoreColor(trustScore)}`}>
            {trustScore}/100
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Convenience Exports ─────────────────────────────────────────────────── */

/** Compact icon-only badge (no label) */
export function TrustIcon({
  badge,
  size = 'sm',
  className = '',
}: {
  badge: BadgeType;
  size?: BadgeSize;
  className?: string;
}) {
  return (
    <TrustBadge badge={badge} size={size} showLabel={false} className={className} />
  );
}

/** Trust score ring shown on profile avatars */
export function TrustScoreRing({
  score,
  size = 56,
  children,
}: {
  score: number;
  size?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;

  const ringColor =
    score >= 80
      ? '#10b981'
      : score >= 60
      ? '#f59e0b'
      : score >= 40
      ? '#f97316'
      : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={5}
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      {children || (
        <span className="text-xs font-bold text-white tabular-nums">{score}</span>
      )}
    </div>
  );
}
