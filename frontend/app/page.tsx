'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPets } from '@/lib/api';
import ActionCard from '@/components/ActionCard';
import PetListingCard from '@/components/PetListingCard';
import Footer from '@/components/Footer';
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Dogs' | 'Cats' | 'Adoption'>('All');

  useEffect(() => {
    async function fetchPetsData() {
      setLoading(true);
      try {
        const data = await getPets();
        if (Array.isArray(data) && data.length > 0) {
          setPets(data);
        } else {
          // Chennai MVP Initial Fallback Dataset
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
      } catch (e) {
        console.error('Failed to load pets:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchPetsData();
  }, []);

  const filteredPets = pets.filter((pet) => {
    const matchesFilter =
      selectedFilter === 'All' ||
      pet.category === selectedFilter ||
      (selectedFilter === 'Adoption' && (pet.listing_type === 'adoption' || pet.price === 0));
    const matchesSearch =
      !searchQuery ||
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pet.location && pet.location.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white flex flex-col justify-between">
      
      <div>
        {/* ==================== 1. ENHANCED HERO SECTION ==================== */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
          {/* Ambient Radial Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-lg shadow-emerald-950/50">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Chennai's #1 AI Pet Ecosystem &amp; Adoption Portal</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
                Every Tail Deserves a <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Loving Home &amp; Verified Care
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
                Connecting pet parents, verified shelters, licensed veterinarians, and grooming specialists across Chennai.
              </p>

              {/* Hero CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/pets"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm rounded-full shadow-2xl shadow-emerald-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Dog className="w-5 h-5" />
                  <span>Explore Available Pets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/ai-assistant"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold text-sm rounded-full border border-slate-700 shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Bot className="w-5 h-5 text-emerald-400" />
                  <span>Consult AI Tele-Vet</span>
                </Link>
              </div>

              {/* Search Bar with Quick Filter Pills */}
              <div className="max-w-2xl mx-auto pt-6 space-y-3">
                <div className="relative flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by breed, name, or location (e.g. Adyar, Golden Retriever)..."
                    className="w-full pl-12 pr-28 py-4 bg-slate-900/90 border border-slate-800 focus:border-emerald-500/80 rounded-full text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 shadow-2xl transition-all"
                  />
                  <button
                    type="button"
                    className="absolute right-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs rounded-full transition-all shadow-md"
                  >
                    Search
                  </button>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {(['All', 'Dogs', 'Cats', 'Adoption'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                        selectedFilter === filter
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* FOUR PRIMARY ACTION CARDS */}
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
                  title="Pet Marketplace"
                  description="Shop verified pet food, accessories, and supplies with GST invoices."
                  href="/marketplace"
                  icon={ShoppingBag}
                  gradient="from-amber-500 to-orange-600"
                  badge="Verified Store"
                />
                <ActionCard
                  title="Nearby Services"
                  description="Book licensed veterinary doctors, groomers, and boarding centers."
                  href="/services"
                  icon={Stethoscope}
                  gradient="from-cyan-500 to-blue-600"
                  badge="Directory"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 2. FEATURED PETS SECTION ==================== */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Chennai Listings</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Featured Pets</h2>
            </div>
            <Link
              href="/pets"
              className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All Pets</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading Skeleton Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse space-y-4 p-4">
                  <div className="w-full h-48 bg-slate-800 rounded-2xl" />
                  <div className="h-4 bg-slate-800 rounded-full w-2/3" />
                  <div className="h-3 bg-slate-800/60 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredPets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPets.map((pet) => (
                <PetListingCard
                  key={pet.id}
                  id={pet.id}
                  name={pet.name}
                  breed={pet.breed || pet.category}
                  age_months={pet.age_months || 12}
                  location={pet.location || 'Chennai, TN'}
                  price={pet.price || 0}
                  listing_type={pet.listing_type || (pet.price > 0 ? 'sale' : 'adoption')}
                  image_url={pet.image_url}
                  is_vaccinated={pet.is_vaccinated !== false}
                  is_verified_seller={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
              <PawPrint className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Pets Found Matching Search</h3>
              <p className="text-xs text-slate-400">Try clearing your search query or selecting a different filter.</p>
            </div>
          )}
        </section>

        {/* ==================== 3. NEARBY VETS SECTION ==================== */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Chennai Healthcare</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Licensed Veterinary Clinics</h2>
              </div>
              <Link
                href="/services?type=vet"
                className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>View All Vets</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    4.9 (120+ reviews)
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Dr. K. Ramanathan, DVM</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Adyar Pet Care Clinic • Adyar, Chennai</p>
                </div>
                <p className="text-xs text-slate-300">Specialist in canine vaccination, surgical care, and emergency triage.</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Consultation: ₹400</span>
                  <Link
                    href="/services?type=vet"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    4.8 (95+ reviews)
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Dr. S. Lakshmi, MVSc</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Anna Nagar Animal Hospital • Anna Nagar, Chennai</p>
                </div>
                <p className="text-xs text-slate-300">Specialist in feline health, nutrition planning, and preventive care.</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400">Consultation: ₹500</span>
                  <Link
                    href="/services?type=vet"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-xl transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/20">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    5.0 (80+ reviews)
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Dr. M. Vijay Kumar</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Velachery Emergency Pet Center • Velachery, Chennai</p>
                </div>
                <p className="text-xs text-slate-300">24/7 trauma care, orthopedic surgery, and critical care ICU.</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">Consultation: ₹450</span>
                  <Link
                    href="/services?type=vet"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs rounded-xl transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 4. NGOS & ANIMAL SHELTERS SECTION ==================== */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Chennai Welfare Alliances</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Verified NGO &amp; Shelter Partners</h2>
            </div>
            <Link
              href="/adoption"
              className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Explore All Shelters</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black text-base">
                  BCC
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Blue Cross of India (Chennai)</h3>
                  <p className="text-xs text-slate-400">Guindy, Chennai • Verified Partner</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">India's premier animal shelter managing 400+ active stray rescues &amp; adoptions.</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400">45 Pets Ready for Adoption</span>
                <Link href="/adoption" className="text-xs font-extrabold text-white hover:text-cyan-400">
                  View Shelter →
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-base">
                  CPF
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Chennai Pet Foundation</h3>
                  <p className="text-xs text-slate-400">Besant Nagar, Chennai • Verified Partner</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">Community adoption drives, rabies vaccination camps, and foster care.</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">22 Pets Ready for Adoption</span>
                <Link href="/adoption" className="text-xs font-extrabold text-white hover:text-emerald-400">
                  View Shelter →
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-black text-base">
                  PAW
                </div>
                <div>
                  <h3 className="text-base font-black text-white">People for Animals (PFA Chennai)</h3>
                  <p className="text-xs text-slate-400">ECR, Chennai • Verified Partner</p>
                </div>
              </div>
              <p className="text-xs text-slate-300">Wildlife rescue, stray rehabilitation, and zero-fee adoption programs.</p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400">18 Pets Ready for Adoption</span>
                <Link href="/adoption" className="text-xs font-extrabold text-white hover:text-teal-400">
                  View Shelter →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== 5. COMMUNITY SECTION ==================== */}
        <section className="py-16 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Local Pet Community</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Join 1,000+ Chennai Pet Lovers</h2>
              </div>
              <Link
                href="/community"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/50"
              >
                Visit Community Feed
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                    R
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Rajesh Kumar</h4>
                    <p className="text-[10px] text-slate-400">Adyar, Chennai • 2h ago</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">"Adopted Simba through PawConnect! The vaccination records were verified digitally. Highly recommend!"</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-xs">
                    P
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Priya Sundaram</h4>
                    <p className="text-[10px] text-slate-400">Anna Nagar, Chennai • 5h ago</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">"Found a stray kitten near Anna Tower. Posted on Lost &amp; Found and connected with Blue Cross within 30 mins!"</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Anand Natarajan</h4>
                    <p className="text-[10px] text-slate-400">Velachery, Chennai • 1d ago</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">"Consulted Dr. Ramanathan via the vet booking feature. Quick appointment and great prescription summary!"</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==================== 6. FOOTER ==================== */}
      <Footer />
    </div>
  );
}
