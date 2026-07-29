'use client';

import Link from 'next/link';
import { MapPin, ShieldCheck, CheckCircle2, Heart, Award } from 'lucide-react';

interface PetListingCardProps {
  id: number | string;
  name: string;
  breed: string;
  age_months: number;
  location: string;
  price: number;
  listing_type: 'adoption' | 'sale';
  image_url?: string;
  images?: string[];
  is_vaccinated?: boolean;
  is_verified_seller?: boolean;
}

export default function PetListingCard({
  id,
  name,
  breed,
  age_months,
  location,
  price,
  listing_type,
  image_url,
  images,
  is_vaccinated = true,
  is_verified_seller = true,
}: PetListingCardProps) {
  const displayImage =
    image_url ||
    (images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80');

  const ageText =
    age_months >= 12 ? `${Math.floor(age_months / 12)} yr${Math.floor(age_months / 12) > 1 ? 's' : ''}` : `${age_months} month${age_months > 1 ? 's' : ''}`;

  return (
    <div className="group bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-950/30 transition-all duration-300 flex flex-col justify-between">
      {/* Image Container with Badge Overlays */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />

        {/* Listing Type Badge (Adoption vs Verified Commercial Sale) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {listing_type === 'adoption' ? (
            <span className="px-3 py-1 bg-emerald-500 text-white font-extrabold text-[11px] rounded-full shadow-lg shadow-emerald-900/40 uppercase tracking-wider">
              Free Adoption
            </span>
          ) : (
            <span className="px-3 py-1 bg-teal-600 text-white font-extrabold text-[11px] rounded-full shadow-lg shadow-teal-900/40 uppercase tracking-wider">
              ₹{price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Verified Seller Badge Overlay */}
        {is_verified_seller && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[10px] font-bold shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>KYC Verified</span>
          </div>
        )}

        {/* Age Badge */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-200 text-xs font-semibold">
          {ageText} old
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors truncate">
              {name}
            </h4>
            {is_vaccinated && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Vaccinated
              </span>
            )}
          </div>

          <p className="text-xs font-semibold text-slate-400 truncate mt-0.5">{breed}</p>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1 truncate max-w-[160px]">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <Link
            href={`/pets/${id}`}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center gap-1 shrink-0"
          >
            <span>View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
