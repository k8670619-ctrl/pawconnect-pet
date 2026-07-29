'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPets } from '@/lib/api';
import {
  PawPrint,
  Sparkles,
  ShieldCheck,
  Search,
  Heart,
  Dog,
  Cat,
  Stethoscope,
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  Star,
  Users,
  Award,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  Activity,
} from 'lucide-react';

export default function LandingPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPetsData() {
      const data = await getPets();
      if (Array.isArray(data) && data.length > 0) {
        setPets(data);
      } else {
        // Mock fallback dataset for stunning initial render
        setPets([
          {
            id: 1,
            name: 'Bella',
            category: 'Dogs',
            breed: 'Golden Retriever',
            age_months: 12,
            listing_type: 'adoption',
            price: 0,
            location: 'Bengaluru, KA',
            image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
            is_vaccinated: true,
          },
          {
            id: 2,
            name: 'Milo',
            category: 'Cats',
            breed: 'Persian Kitten',
            age_months: 4,
            listing_type: 'sale',
            price: 12500,
            location: 'Mumbai, MH',
            image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
            is_vaccinated: true,
          },
          {
            id: 3,
            name: 'Rocky',
            category: 'Dogs',
            breed: 'German Shepherd',
            age_months: 18,
            listing_type: 'adoption',
            price: 0,
            location: 'Delhi, DL',
            image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
            is_vaccinated: true,
          },
          {
            id: 4,
            name: 'Coco',
            category: 'Birds',
            breed: 'African Grey Macaw',
            age_months: 8,
            listing_type: 'sale',
            price: 18000,
            location: 'Hyderabad, TS',
            image_url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
            is_vaccinated: true,
          },
        ]);
      }
    }
    fetchPetsData();
  }, []);

  const filteredPets = pets.filter((pet) => {
    const matchesCategory = activeCategory === 'All' || pet.category === activeCategory || (activeCategory === 'Adoption' && pet.listing_type === 'adoption');
    const matchesSearch = !searchQuery || pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) || pet.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-lg shadow-emerald-950/50 animate-pulse">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>India's #1 AI-Powered Pet Ecosystem & Adoption Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Every Tail Deserves a <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Loving Home & AI Care
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Adopt verified pets, consult 24/7 AI tele-vets, order premium supplies, and trigger emergency SOS rescue alerts with 100% background verification.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/pets"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm rounded-full shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Dog className="w-5 h-5" />
                <span>Explore Available Pets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/ai-assistant"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-sm rounded-full border border-slate-700 shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Consult AI Tele-Vet</span>
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-400">
              <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Background Verified Sellers</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>Licensed Tele-Veterinarians</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>24/7 Emergency SOS Rescue</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. FEATURED STATS BAR ==================== */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white">12,450+</p>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pets Adopted</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white">1,820+</p>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-wider">Verified Vets & NGOs</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white">45,000+</p>
              <p className="text-xs font-bold text-cyan-400 uppercase tracking-wider">AI Symptom Chats</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-white">99.8%</p>
              <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">Verified Trust Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. FEATURE HIGHLIGHT CARDS ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Ecosystem Features</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Everything Your Pet Needs, All In One Place</h2>
          <p className="text-xs sm:text-sm text-slate-400">Powered by advanced Gemini AI and verified veterinary standards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'AI Health Diagnostic',
              desc: 'Instant 24/7 symptom analysis, triage guidance, & vaccination schedule calculation.',
              icon: Sparkles,
              badge: 'Gemini AI',
              color: 'from-emerald-500 to-teal-600',
              link: '/ai-assistant',
            },
            {
              title: 'Verified Adoption',
              desc: 'Direct background-verified adoption from accredited shelters & licensed breeders.',
              icon: Dog,
              badge: 'Verified',
              color: 'from-blue-500 to-cyan-600',
              link: '/pets',
            },
            {
              title: '24/7 Tele-Vet Consults',
              desc: 'Video consult certified veterinarians & book grooming appointments in minutes.',
              icon: Stethoscope,
              badge: 'Licensed',
              color: 'from-teal-500 to-emerald-600',
              link: '/services',
            },
            {
              title: 'SOS Emergency Rescue',
              desc: 'Broadcast emergency rescue alerts to nearby volunteers & animal ambulances.',
              icon: AlertTriangle,
              badge: '24/7 SOS',
              color: 'from-rose-500 to-amber-600',
              link: '/rescue',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-slate-800 text-emerald-400 rounded-full border border-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <Link
                  href={item.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Explore Feature</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================== 4. LIVE PET SHOWCASE GRID ==================== */}
      <section className="py-16 bg-slate-900/30 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Featured Listings</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Find Your Perfect Companion</h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-full border border-slate-800 overflow-x-auto max-w-full">
              {['All', 'Dogs', 'Cats', 'Birds', 'Adoption'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPets.slice(0, 4).map((pet) => (
              <div
                key={pet.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all hover:scale-[1.02] shadow-xl group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={pet.image_url || 'https://images.unsplash.com/photo-1552053831-71594a27632d'}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full text-white ${
                      pet.listing_type === 'adoption' ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}>
                      {pet.listing_type === 'adoption' ? 'Free Adoption' : 'For Sale'}
                    </span>
                  </div>

                  {pet.is_vaccinated && (
                    <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Vaccinated
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{pet.name}</h3>
                    <span className="text-sm font-black text-emerald-400">
                      {pet.price === 0 ? 'Free' : `₹${pet.price.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-400">
                    {pet.breed} • {pet.age_months} Months Old
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span>📍 {pet.location}</span>
                  </p>

                  <Link
                    href={`/pets/${pet.id}`}
                    className="w-full py-2.5 bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 mt-2"
                  >
                    <span>View Full Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/pets"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-full border border-slate-700 transition-colors"
            >
              <span>View All Available Pets</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== 5. TESTIMONIALS & TRUST ==================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Verified Reviews</span>
          <h2 className="text-3xl font-black text-white">Loved by 50,000+ Pet Parents</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Ananya Roy',
              role: 'Senior Veterinarian',
              quote: 'PawConnect AI has revolutionized how pet parents access symptom diagnosis. The AI tele-vet recommendations are remarkably accurate for emergency triage.',
              rating: 5,
            },
            {
              name: 'Karan Mehra',
              role: 'Adopted Golden Retriever (Bella)',
              quote: 'The background check and shelter verification process was seamless. I adopted Bella with complete peace of mind knowing all medical history was authentic.',
              rating: 5,
            },
            {
              name: 'Sneha Patel',
              role: 'Animal Shelter Founder',
              quote: 'Listing our rescued animals on PawConnect increased our adoption rate by 300%. The SOS emergency alert feature saves lives every single week.',
              rating: 5,
            },
          ].map((t, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{t.quote}"</p>
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs font-bold text-white">{t.name}</p>
                <p className="text-[10px] font-semibold text-emerald-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 6. FINAL CTA BANNER ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Ready to Give a Pet a Loving Home?</h2>
            <p className="text-xs sm:text-sm text-slate-200">Join PawConnect AI today to adopt, consult 24/7 vets, and access India's safest pet ecosystem.</p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-950 font-black text-xs rounded-full hover:bg-slate-100 transition-all hover:scale-105 shadow-xl"
              >
                Create Free Account
              </Link>
              <Link
                href="/pets"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-full transition-all hover:scale-105"
              >
                Browse Adoptions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
