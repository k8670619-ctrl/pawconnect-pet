'use client';

import React from 'react';
import { Star, MessageCircle, ShieldCheck, Calendar } from 'lucide-react';
import TrustBadge, { TrustScoreRing } from '@/components/TrustBadge';
import type { BadgeType } from '@/components/TrustBadge';

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

interface UserTrustCardProps {
  userId: number;
  name: string;
  role: string;
  avatarUrl?: string;
  verifiedBadge: BadgeType;
  trustScore: number;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  isIdentityVerified?: boolean;
  memberSince?: string;
  reviews?: Review[];
  averageRating?: number;
  className?: string;
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size }}
          className={s <= Math.round(rating) ? 'text-amber-400 fill-current' : 'text-gray-600'}
        />
      ))}
    </div>
  );
}

function VerificationRow({ label, verified }: { label: string; verified?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-gray-400">{label}</span>
      {verified ? (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
          <ShieldCheck className="w-3 h-3" /> Verified
        </span>
      ) : (
        <span className="text-[10px] text-gray-600">Not verified</span>
      )}
    </div>
  );
}

/**
 * UserTrustCard — displays a user's trust score ring, verification badge,
 * checklist of verified attributes, and recent reviews. Used on profile pages,
 * pet listing detail pages (seller info), and the adoption inquiry flow.
 */
export default function UserTrustCard({
  userId,
  name,
  role,
  avatarUrl,
  verifiedBadge,
  trustScore,
  isEmailVerified,
  isPhoneVerified,
  isIdentityVerified,
  memberSince,
  reviews = [],
  averageRating = 0,
  className = '',
}: UserTrustCardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 space-y-5 ${className}`}>
      {/* Header: avatar + trust ring + badge */}
      <div className="flex items-center gap-4">
        <TrustScoreRing score={trustScore} size={60}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 flex items-center justify-center text-white font-bold text-lg">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </TrustScoreRing>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-base truncate">{name}</p>
          <p className="text-xs text-gray-400 capitalize mb-1.5">{role}</p>
          <TrustBadge badge={verifiedBadge} size="xs" showScore={true} trustScore={trustScore} />
        </div>
      </div>

      {/* Verification checklist */}
      <div className="space-y-0.5 border-t border-white/8 pt-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-2">Verification Status</p>
        <VerificationRow label="Email Address" verified={isEmailVerified} />
        <VerificationRow label="Phone Number" verified={isPhoneVerified} />
        <VerificationRow label="Government ID" verified={isIdentityVerified} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 border-t border-white/8 pt-4">
        {averageRating > 0 && (
          <div className="text-center">
            <p className="text-lg font-extrabold text-white">{averageRating.toFixed(1)}</p>
            <StarRating rating={averageRating} size={11} />
            <p className="text-[10px] text-gray-500 mt-0.5">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
          </div>
        )}
        {memberSince && (
          <div className="text-center">
            <Calendar className="w-4 h-4 text-gray-500 mx-auto mb-1" />
            <p className="text-xs font-semibold text-white">{memberSince}</p>
            <p className="text-[10px] text-gray-500">Member since</p>
          </div>
        )}
      </div>

      {/* Recent reviews */}
      {reviews.length > 0 && (
        <div className="border-t border-white/8 pt-4 space-y-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <MessageCircle className="w-3 h-3" /> Recent Reviews
          </p>
          {reviews.slice(0, 2).map((r) => (
            <div key={r.id} className="bg-black/20 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{r.reviewer_name}</span>
                <StarRating rating={r.rating} size={11} />
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{r.review_text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
