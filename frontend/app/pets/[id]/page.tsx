'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, ShieldCheck, Heart, Sparkles, Phone, ArrowLeft, CheckCircle2, FileText, Share2 } from 'lucide-react';
import { getPetById } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (params.id) {
      getPetById(params.id as string).then(data => {
        setPet(data);
        setLoading(false);
      });
    }
  }, [params.id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Loading pet details...</div>;
  }

  if (!pet) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Pet profile not found</h2>
        <Link href="/pets" className="text-emerald-400 font-semibold hover:underline">Back to listings</Link>
      </div>
    );
  }

  const isAdoption = pet.listing_type === 'adoption';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <button onClick={() => router.back()} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-96 sm:h-[480px] w-full rounded-3xl overflow-hidden glass-panel">
            <img 
              src={pet.image_url || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800'} 
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <span className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
              isAdoption ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-black'
            }`}>
              {isAdoption ? 'Free Adoption' : 'For Sale'}
            </span>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-panel p-3.5 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 uppercase block">Age</span>
              <span className="text-sm font-bold text-white">{pet.age_months} Months</span>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 uppercase block">Gender</span>
              <span className="text-sm font-bold text-white">{pet.gender}</span>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl text-center">
              <span className="text-[10px] text-gray-400 uppercase block">Weight</span>
              <span className="text-sm font-bold text-white">{pet.weight_kg || 12} kg</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pet Details & Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl space-y-5">
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-white">{pet.name}</h1>
                <p className="text-emerald-400 text-sm font-semibold mt-0.5">{pet.breed} • {pet.category}</p>
              </div>
              <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-300">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>{pet.location}</span>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Adoption Fee / Price</span>
                <span className="text-2xl font-extrabold text-white">
                  {isAdoption ? '₹0 (Free Adoption)' : formatCurrency(pet.price)}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed pt-2">
              {pet.description || 'Fully socialized and friendly companion, looking for a warm home.'}
            </p>

            {/* Medical Certificates */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Health Verification Badges
              </h4>
              <div className="space-y-1 text-[11px] text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> DHPPi & Rabies Vaccinated
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Vet Medical Certificate Verified
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dewormed & Microchipped
                </div>
              </div>
            </div>

            {/* Action CTA */}
            {applied ? (
              <div className="p-4 rounded-xl bg-emerald-600 text-white text-center text-xs font-bold">
                Application Submitted! Check status in your Dashboard.
              </div>
            ) : (
              <button 
                onClick={() => setApplied(true)}
                className="w-full py-3.5 rounded-xl gradient-button text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" /> {isAdoption ? 'Request Adoption' : 'Buy Now'}
              </button>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
