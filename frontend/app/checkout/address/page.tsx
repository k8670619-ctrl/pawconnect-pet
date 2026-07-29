'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Plus, CheckCircle2, Building, Home } from 'lucide-react';
import CheckoutStepsBar from '@/components/CheckoutStepsBar';

export default function AddressPage() {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Rajesh Sharma",
      type: "Home",
      address_line: "Flat 402, Green Glen Layout, Bellandur",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      phone: "+91 98765 43210"
    },
    {
      id: 2,
      name: "Rajesh Sharma",
      type: "Work",
      address_line: "Building 9B, RMZ Ecoworld, Devarabeesanahalli",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560103",
      phone: "+91 98765 43210"
    }
  ]);

  const [newAddr, setNewAddr] = useState({
    name: '',
    type: 'Home',
    address_line: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    phone: ''
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created = { ...newAddr, id: Date.now() };
    setAddresses(prev => [...prev, created]);
    setSelectedAddressId(created.id);
    setShowAddForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <CheckoutStepsBar currentStep="address" />

      <div className="flex items-center justify-between">
        <Link href="/checkout/cart" className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Select Delivery Address</h1>
      </div>

      {/* Saved Addresses List */}
      <div className="space-y-4">
        {addresses.map((addr) => {
          const isSelected = addr.id === selectedAddressId;
          return (
            <div
              key={addr.id}
              onClick={() => setSelectedAddressId(addr.id)}
              className={`glass-panel p-6 rounded-3xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{addr.name}</span>
                    <span className="px-2.5 py-0.5 rounded bg-white/10 text-emerald-400 font-semibold text-[10px]">
                      {addr.type}
                    </span>
                  </div>

                  <p className="text-gray-300 leading-relaxed">{addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-gray-400">Phone: {addr.phone}</p>
                </div>

                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-white/20'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Address Modal/Button */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3.5 rounded-2xl glass-panel border border-dashed border-white/20 hover:border-emerald-500 text-xs font-bold text-emerald-400 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Address
        </button>
      ) : (
        <form onSubmit={handleAddAddress} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 text-xs">
          <h3 className="font-bold text-white text-sm">Add New Address</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={newAddr.name}
                onChange={(e) => setNewAddr({...newAddr, name: e.target.value})}
                placeholder="Receiver name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Mobile Number</label>
              <input
                type="text"
                required
                value={newAddr.phone}
                onChange={(e) => setNewAddr({...newAddr, phone: e.target.value})}
                placeholder="+91 98000 00000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Flat / House / Street Address</label>
            <input
              type="text"
              required
              value={newAddr.address_line}
              onChange={(e) => setNewAddr({...newAddr, address_line: e.target.value})}
              placeholder="House No., Street Name, Area"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-300 mb-1">City</label>
              <input
                type="text"
                value={newAddr.city}
                onChange={(e) => setNewAddr({...newAddr, city: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">State</label>
              <input
                type="text"
                value={newAddr.state}
                onChange={(e) => setNewAddr({...newAddr, state: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">PIN Code</label>
              <input
                type="text"
                required
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({...newAddr, pincode: e.target.value})}
                placeholder="560103"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-2.5 rounded-xl glass-panel text-gray-300 font-bold">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl gradient-button text-white font-bold">
              Save Address
            </button>
          </div>
        </form>
      )}

      <button
        onClick={() => router.push('/checkout/payment')}
        className="w-full py-4 rounded-2xl gradient-button text-sm font-bold text-white shadow-xl flex items-center justify-center gap-2"
      >
        Proceed to Payment Selection
      </button>

    </div>
  );
}
