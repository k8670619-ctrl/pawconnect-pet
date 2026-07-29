'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Star, ShoppingCart, Check, CreditCard, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';

export default function MarketplacePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [checkoutDone, setCheckoutDone] = useState(false);

  useEffect(() => {
    api.get('/marketplace/products').then(res => setProducts(res.data));
  }, []);

  const addToCart = (item: any) => {
    setCart(prev => [...prev, item]);
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout/cart');
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-emerald-400" /> PawConnect Pet Store
          </h1>
          <p className="text-xs text-gray-400 mt-1">Curated organic food, chew toys, orthopedic beds, and grooming supplies</p>
        </div>

        {/* Cart Trigger */}
        <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-3 border border-emerald-500/30">
          <ShoppingCart className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold text-white">{cart.length} Items</span>
          <span className="text-xs text-emerald-400 font-extrabold">{formatCurrency(cartTotal)}</span>
          {cart.length > 0 && (
            <button
              onClick={handleProceedToCheckout}
              className="px-4 py-1.5 rounded-xl gradient-button text-xs font-bold text-white shadow-md flex items-center gap-1"
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>

      {checkoutDone && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-center text-xs font-bold flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" /> Payment Successful via Razorpay! Your order is being prepared for fast delivery.
        </div>
      )}

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group">
            <div>
              <div className="h-48 overflow-hidden bg-gray-900">
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">{p.category}</span>
                <h3 className="font-bold text-white text-xs line-clamp-2">{p.title}</h3>
                <div className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {p.rating} (50+ Ratings)
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-base font-extrabold text-white">{formatCurrency(p.price)}</span>
              <button
                onClick={() => addToCart(p)}
                className="px-3 py-1.5 rounded-xl gradient-button text-xs font-bold text-white shadow-md flex items-center gap-1"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
