'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, Tag, ShieldCheck, ShoppingCart, ArrowRight } from 'lucide-react';
import CheckoutStepsBar from '@/components/CheckoutStepsBar';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState([
    {
      id: 101,
      title: "Royal Canin Breed Health Nutrition Adult Dry Dog Food (3kg)",
      price: 2450,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600"
    },
    {
      id: 102,
      title: "Orthopedic Memory Foam Soft Bolster Pet Bed (Large)",
      price: 3299,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600"
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  const updateQuantity = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await api.post('/payments/coupon/apply', {
        code: couponCode,
        order_subtotal: subtotal
      });
      setDiscountAmount(res.data.discount_amount);
      setCouponMsg(`Coupon ${res.data.code} applied! Saved ${formatCurrency(res.data.discount_amount)}`);
    } catch (err: any) {
      setCouponMsg(err?.response?.data?.detail || 'Invalid coupon code');
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = roundTwo(discountedSubtotal * 0.18);
  const delivery = discountedSubtotal > 999 ? 0 : 99;
  const platformFee = 15;
  const total = roundTwo(discountedSubtotal + tax + delivery + platformFee);

  function roundTwo(val: number) {
    return Math.round(val * 100) / 100;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <CheckoutStepsBar currentStep="cart" />

      <div className="flex items-center justify-between">
        <Link href="/marketplace" className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="text-2xl font-extrabold text-white">Your Shopping Cart ({items.length})</h1>
      </div>

      {items.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl text-center space-y-4">
          <ShoppingCart className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
          <Link href="/marketplace" className="inline-block px-6 py-2.5 rounded-xl gradient-button text-xs font-bold text-white shadow-lg">
            Explore Pet Store
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-5">
                <img src={item.image} alt={item.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                
                <div className="flex-1 space-y-2 text-xs">
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  <span className="text-emerald-400 font-extrabold text-sm block">{formatCurrency(item.price)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 text-gray-300 hover:text-white font-bold text-xs">-</button>
                    <span className="px-3 font-bold text-white text-xs">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 text-gray-300 hover:text-white font-bold text-xs">+</button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Coupon Box */}
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" /> Apply Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Try PAWCONNECT10"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className={`text-[11px] font-semibold ${discountAmount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {couponMsg}
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-base">Order Financial Breakdown</h3>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Promo Discount</span>
                    <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST Tax (18%)</span>
                  <span className="font-bold text-white">{formatCurrency(tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-emerald-400">
                    {delivery === 0 ? 'FREE' : formatCurrency(delivery)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-bold text-white">{formatCurrency(platformFee)}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between text-sm font-extrabold text-white">
                  <span>Total Amount</span>
                  <span className="text-emerald-400 text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout/address"
                className="w-full py-3.5 rounded-xl gradient-button text-xs font-bold text-white shadow-xl flex items-center justify-center gap-2"
              >
                Continue to Address <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
