'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, PawPrint } from 'lucide-react';
import PetCard, { PetProps } from '@/components/PetCard';
import { getPets } from '@/lib/api';

function PetsContent() {
  const searchParams = useSearchParams();
  const initialListingType = searchParams.get('listing_type');
  const initialSearch = searchParams.get('search') || '';

  const [pets, setPets] = useState<PetProps[]>([]);
  const [category, setCategory] = useState('All');
  const [listingType, setListingType] = useState(
    initialListingType ? (initialListingType.toLowerCase() === 'adoption' ? 'Adoption' : initialListingType.toLowerCase() === 'sale' ? 'Sale' : 'All') : 'All'
  );
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Dogs', 'Cats', 'Birds', 'Fish', 'Rabbit', 'Exotic Pets'];

  useEffect(() => {
    fetchData();
  }, [category, listingType]);

  const fetchData = async () => {
    setLoading(true);
    const data = await getPets({
      category: category === 'All' ? undefined : category,
      listing_type: listingType === 'All' ? undefined : listingType.toLowerCase(),
      search: search || undefined
    });
    setPets(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Pet Marketplace & Adoption</h1>
        <p className="text-xs text-gray-400 mt-1">Browse verified dogs, cats, birds, and exotic pets across India</p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            placeholder="Search by breed, name or city..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Listing Type Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full md:w-auto">
          {['All', 'Adoption', 'Sale'].map((type) => (
            <button
              key={type}
              onClick={() => setListingType(type)}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                listingType === type 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {type === 'Adoption' ? 'Free Adoption' : type}
            </button>
          ))}
        </div>

      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat 
                ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-400' 
                : 'glass-panel text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Pet Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">Loading pet listings...</div>
      ) : pets.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <PawPrint className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No pet listings found</h3>
          <p className="text-xs text-gray-400">Try adjusting your category or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}

    </div>
  );
}

export default function PetsPage() {
  return (
    <Suspense fallback={<div className="text-center text-gray-400 py-20 text-sm">Loading pets...</div>}>
      <PetsContent />
    </Suspense>
  );
}
