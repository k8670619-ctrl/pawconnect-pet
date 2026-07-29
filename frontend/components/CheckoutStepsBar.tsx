import React from 'react';
import { ShoppingCart, MapPin, CreditCard, CheckCircle2 } from 'lucide-react';

interface StepsProps {
  currentStep: 'cart' | 'address' | 'payment' | 'success';
}

export default function CheckoutStepsBar({ currentStep }: StepsProps) {
  const steps = [
    { key: 'cart', label: '1. Cart', icon: ShoppingCart },
    { key: 'address', label: '2. Address', icon: MapPin },
    { key: 'payment', label: '3. Payment', icon: CreditCard },
    { key: 'success', label: '4. Confirmation', icon: CheckCircle2 }
  ];

  const getStepIndex = (key: string) => {
    switch (key) {
      case 'cart': return 1;
      case 'address': return 2;
      case 'payment': return 3;
      case 'success': return 4;
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-white/10">
        {steps.map((s, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentIndex;
          const isCompleted = stepNum < currentIndex;
          const Icon = s.icon;

          return (
            <div key={s.key} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                isCompleted
                  ? 'bg-emerald-500 text-white'
                  : isActive
                  ? 'bg-amber-500 text-black font-extrabold shadow-lg'
                  : 'bg-white/5 text-gray-500 border border-white/10'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-xs font-semibold hidden sm:inline ${
                isActive ? 'text-white font-bold' : isCompleted ? 'text-emerald-400' : 'text-gray-500'
              }`}>
                {s.label}
              </span>
              {idx < steps.length - 1 && (
                <div className="w-8 sm:w-12 h-0.5 bg-white/10 mx-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
