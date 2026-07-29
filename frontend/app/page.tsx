'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPets } from '@/lib/api';
import ActionCard from '@/components/ActionCard';
import PetListingCard from '@/components/PetListingCard';
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
  Scissors,
  Building2,
  MapPin,
  Bot,
  MessageSquare,
} from 'lucide-react';

export default function Homepage() {
  const [pets, setPets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPetsData() {
      const data = await getPets();
      if (Array.isArray(data) && data.length > 0) {
        setPets(data);
      } else {
        // Mock fallback dataset for Chennai initial render
        setPets([
          {
            id: 1,
            name: 'Simba',
            category: 'Dogs',
            breed: 'Indie Dog (Rescued)',
            age_months: 8,
            listing_type: 'adoption',
            price: 0,
            location: 'Adyar, Chennai',
            image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
            is_vaccinated: true,
            is_verified_seller: true,
          },
          {
            id: 2,
            name: 'Luna',
            category: 'Cats',
            breed: 'Persian Kitten',
            age_months: 5,
            listing_type: 'sale',
            price: 11500,
            location: 'Anna Nagar, Chennai',
            image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
            is_vaccinated: true,
            is_verified_seller: true,
          },
          {
            id: 3,
            name: 'Bruno',
            category: 'Dogs',
            breed: 'Golden Retriever',
            age_months: 14,
            listing_type: 'adoption',
            price: 0,
            location: 'Velachery, Chennai',
            image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=600&q=80',
            is_vaccinated: true,
            is_verified_seller: true,
          },
          {
            id: 4,
            name: 'Milo',
            category: 'Dogs',
            breed: 'Beagle',
            age_months: 6,
            listing_type: 'sale',
            price: 16000,
            location: 'ECR, Chennai',
            image_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
            is_vaccinated: true,
            is_verified_seller: true,
          },
        ]);
      }
    }
    fetchPetsData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      
      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative pt-10 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-lg shadow-emerald-950/50">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Chennai's #1 Verified Pet Care & Adoption Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
              Every Tail Deserves a <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Loving Home & Verified Care
              </span>
            </h1>

            {/* Search Input Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search adoption pets, lost pets, vets, or grooming in Chennai..."
                  className="w-full pl-12 pr-28 py-4 bg-slate-900/90 border border-slate-800 focus:border-emerald-500/80 rounded-full text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-2xl transition-all"
                />
                <button
                  type="button"
                  className="absolute right-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs rounded-full transition-all shadow-md"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Four Primary Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-10 text-left">
              <ActionCard
                title="Adopt a Pet"
                description="Find loving, vaccinated pets available for 100% free adoption in Chennai."
                href="/adoption"
                icon={Heart}
                gradient="from-emerald-500 to-teal-600"
                badge="Free"
              />
              <ActionCard
                title="Lost & Found"
                description="Emergency SOS tracking and instant 5km radius pet search alerts."
                href="/lost-found"
                icon={AlertTriangle}
                gradient="from-rose-500 to-pink-600"
                badge="High Priority"
              />
              <ActionCard
                title="Animal Shelters"
                description="Connect with verified animal welfare shelters and non-profit NGOs."
                href="/adoption"
                icon={Building2}
                gradient="from-cyan-500 to-blue-600"
                badge="NGO Verified"
              />
              <ActionCard
                title="Pet Marketplace"
                description="Shop verified pet food, accessories, and supplies with GST invoices."
                href="/marketplace"
                icon={ShoppingBag}
                gradient="from-amber-500 to-orange-600"
                badge="Verified"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. NEARBY DIRECTORY SECTION ==================== */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Chennai Local Services</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Nearby Vets, Groomers &amp; NGOs</h2>
            </div>
            <Link
              href="/services"
              className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All Services</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nearby Vets */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Licensed Vets</h3>
              <p className="text-xs text-slate-400">Consult top-rated veterinary doctors in Adyar, Anna Nagar &amp; Velachery.</p>
              <Link
                href="/services?type=vet"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                <span>Find Vets Near Me</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Nearby Groomers */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Certified Groomers</h3>
              <p className="text-xs text-slate-400">Book professional doorstep pet spa &amp; hygiene grooming sessions.</p>
              <Link
                href="/services?type=groomer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300"
              >
                <span>Find Groomers Near Me</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Nearby NGOs */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">Partner NGOs</h3>
              <p className="text-xs text-slate-400">Support verified animal welfare groups &amp; shelter adoption drives.</p>
              <Link
                href="/services?type=ngo"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                <span>Find NGOs Near Me</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. FEATURED PET LISTINGS ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Available Listings</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Pets Looking for a Home</h2>
          </div>
          <Link
            href="/pets"
            className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Pets</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pets.map((pet) => (
            <PetListingCard
              key={pet.id}
              id={pet.id}
              name={pet.name}
              breed={pet.breed}
              age_months={pet.age_months}
              location={pet.location}
              price={pet.price || 0}
              listing_type={pet.listing_type || (pet.price > 0 ? 'sale' : 'adoption')}
              image_url={pet.image_url}
              is_vaccinated={pet.is_vaccinated !== false}
              is_verified_seller={true}
            />
          ))}
        </div>
      </section>

      {/* ==================== 4. AI ASSISTANT SECTION ==================== */}
      <section className="py-16 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Bot className="w-4 h-4" />
              <span>24/7 AI Pet Assistant</span>
            </div>
            <h2 className="text-3xl font-black text-white">Instant AI Health Triage &amp; Pet Care Advice</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ask questions about pet symptoms, diet recommendations, and vaccination schedules. Connected directly to licensed veterinarians.
            </p>
          </div>

          <Link
            href="/ai-assistant"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/20 shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Chat with AI Assistant</span>
          </Link>
        </div>
      </section>

      {/* ==================== 5. COMMUNITY FEED SECTION ==================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Chennai Community</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Pet Stories &amp; Local Updates</h2>
          </div>
          <Link
            href="/community"
            className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Visit Community Feed</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Join 1,000+ Chennai Pet Parents</h4>
              <p className="text-xs text-slate-400">Share adoption stories, ask advice, and connect with local pet lovers.</p>
            </div>
          </div>
          <Link
            href="/community"
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shrink-0"
          >
            Join Community
          </Link>
        </div>
      </section>
    </div>
  );
}
