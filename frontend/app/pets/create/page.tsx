'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Upload, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';

export default function CreatePetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dogs',
    breed: '',
    age_months: 6,
    gender: 'Male',
    listing_type: 'adoption',
    price: 0,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
    location: 'Bengaluru, KA'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/pets', formData);
      router.push('/pets');
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      
      <button onClick={() => router.back()} className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
        <ArrowLeft className="w-4 h-4" /> Cancel & Return
      </button>

      <div className="glass-panel p-8 rounded-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Create New Pet Listing</h1>
          <p className="text-xs text-gray-400">Post a pet for free adoption or verified sale</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Pet Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Leo"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                {['Dogs', 'Cats', 'Birds', 'Fish', 'Rabbit', 'Hamster', 'Exotic Pets'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Breed</label>
              <input 
                type="text" 
                required
                value={formData.breed}
                onChange={(e) => setFormData({...formData, breed: e.target.value})}
                placeholder="e.g. Beagle"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Listing Type</label>
              <select
                value={formData.listing_type}
                onChange={(e) => setFormData({...formData, listing_type: e.target.value})}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="adoption">Free Adoption</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">Price (₹) if For Sale</label>
              <input 
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                disabled={formData.listing_type === 'adoption'}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500 disabled:opacity-40"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">City / Location</label>
              <input 
                type="text" 
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g. Mumbai, MH"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Description & Medical History</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Tell adopters about temperament, diet, and medical background..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl gradient-button text-sm font-bold text-white shadow-xl"
          >
            {loading ? 'Publishing...' : 'Publish Listing'}
          </button>

        </form>
      </div>

    </div>
  );
}
