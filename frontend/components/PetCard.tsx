import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { TrustIcon } from '@/components/TrustBadge';
import type { BadgeType } from '@/components/TrustBadge';

export interface PetProps {
  id: number;
  name: string;
  category: string;
  breed: string;
  age_months: number;
  gender: string;
  listing_type: string;
  price: number;
  image_url?: string;
  is_vaccinated: boolean;
  location: string;
  is_verified_pet?: boolean;
  verified_badge?: BadgeType;
  seller_badge?: BadgeType;
}

export default function PetCard({ pet }: { pet: PetProps }) {
  const isAdoption = pet.listing_type === 'adoption';

  return (
    <div className="glass-panel rounded-2xl overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image header */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-900">
          <img 
            src={pet.image_url || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800'} 
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isAdoption 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                : 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/30'
            }`}>
              {isAdoption ? 'Free Adoption' : 'For Sale'}
            </span>
          </div>

          <button className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:text-red-400 transition-colors">
            <Heart className="w-4 h-4" />
          </button>

          {/* Verified pet badge */}
          {pet.is_verified_pet && (
            <div className="absolute bottom-3 right-3">
              <TrustIcon badge="verified" size="sm" />
            </div>
          )}
        </div>

        {/* Content body */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
              {pet.name}
            </h3>
            <span className="text-xs text-gray-400 font-medium">{pet.gender} • {pet.age_months} mos</span>
          </div>

          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> {pet.breed}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>{pet.location}</span>
          </div>

          {pet.is_vaccinated && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-max">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Vaccinated
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-2 border-t border-white/5 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block uppercase">Price / Fee</span>
          <span className="text-lg font-extrabold text-white">
            {isAdoption ? '₹0 (Free)' : formatCurrency(pet.price)}
          </span>
        </div>

        <Link 
          href={`/pets/${pet.id}`}
          className="px-4 py-2 rounded-xl gradient-button text-xs font-bold text-white shadow-md"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
