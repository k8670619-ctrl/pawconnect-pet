'use client';

import React, { useState } from 'react';
import { Stethoscope, Scissors, Home, Calendar, Clock, Star, MapPin, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('Veterinary');
  const [bookingModal, setBookingModal] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('2026-08-02');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [confirmed, setConfirmed] = useState(false);

  const providers = [
    {
      id: 1,
      name: "Dr. Ananya Sharma (BVSc & AH)",
      category: "Veterinary",
      experience: "12+ Yrs Exp",
      rating: 4.9,
      reviews: 142,
      location: "Koramangala, Bengaluru",
      price: 600,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      services: ["Online Video Consultation", "Vaccination Checkup", "General Diagnostics"]
    },
    {
      id: 2,
      name: "Pawsome Spa & Grooming Studio",
      category: "Grooming",
      experience: "Top Rated Studio",
      rating: 4.8,
      reviews: 98,
      location: "Indiranagar, Bengaluru",
      price: 1200,
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400",
      services: ["Full Body Grooming", "De-shedding Spa", "Nail Clipping & Ear Cleaning"]
    },
    {
      id: 3,
      name: "Happy Tails Pet Resort & Boarding",
      category: "Boarding",
      experience: "AC Suites & CCTV",
      rating: 4.9,
      reviews: 210,
      location: "Whitefield, Bengaluru",
      price: 850,
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
      services: ["24/7 CCTV Access for Owners", "Daily Playtime & Meals", "Vet on Call"]
    }
  ];

  const handleBook = async () => {
    try {
      await api.post('/services/book', {
        service_type: bookingModal.category,
        provider_name: bookingModal.name,
        booking_date: bookingDate,
        booking_time: bookingTime,
        price: bookingModal.price
      });
      setConfirmed(true);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = providers.filter(p => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Pet Care & Booking Services</h1>
        <p className="text-xs text-gray-400 mt-1">Book top-rated veterinarians, grooming spas, and luxury boarding hosts</p>
      </div>

      {/* Categories Bar */}
      <div className="flex gap-3 border-b border-white/10 pb-4">
        {[
          { key: 'Veterinary', icon: Stethoscope, label: 'Veterinarians' },
          { key: 'Grooming', icon: Scissors, label: 'Grooming Spas' },
          { key: 'Boarding', icon: Home, label: 'Boarding & Hostels' }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                selectedCategory === tab.key
                  ? 'gradient-button text-white shadow-lg'
                  : 'glass-panel text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Provider List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div key={p.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between">
            <div>
              <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-base">{p.name}</h3>
                    <span className="text-xs text-emerald-400 font-semibold">{p.experience}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {p.rating}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> {p.location}
                </div>

                <div className="space-y-1 pt-2">
                  <span className="text-[10px] text-gray-400 uppercase block font-semibold">Services Offered:</span>
                  <ul className="text-[11px] text-gray-300 space-y-0.5">
                    {p.services.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Slot Fee</span>
                <span className="text-lg font-extrabold text-white">{formatCurrency(p.price)}</span>
              </div>
              <button
                onClick={() => {
                  setBookingModal(p);
                  setConfirmed(false);
                }}
                className="px-4 py-2 rounded-xl gradient-button text-xs font-bold text-white shadow-md"
              >
                Book Slot
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl space-y-5 border border-white/10">
            
            <h3 className="text-lg font-bold text-white">Book Appointment with {bookingModal.name}</h3>

            {confirmed ? (
              <div className="p-4 bg-emerald-600/30 border border-emerald-500 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Appointment Confirmed!</h4>
                <p className="text-xs text-emerald-200">Confirmation SMS sent to your registered mobile number.</p>
                <button onClick={() => setBookingModal(null)} className="mt-3 px-4 py-2 rounded-xl gradient-button text-xs font-bold text-white">
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-300 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">Select Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setBookingModal(null)} className="flex-1 py-2.5 rounded-xl glass-panel text-gray-300 font-bold">
                    Cancel
                  </button>
                  <button onClick={handleBook} className="flex-1 py-2.5 rounded-xl gradient-button text-white font-bold shadow-lg">
                    Confirm ({formatCurrency(bookingModal.price)})
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
