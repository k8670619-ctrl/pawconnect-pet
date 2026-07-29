'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { uploadVerificationDocument } from '@/lib/api';
import { PawPrint, User, MapPin, Camera, FileCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();

  const [step, setStep] = useState(1);
  const [city, setCity] = useState('Bengaluru');
  const [bio, setBio] = useState('Dog & cat lover based in India.');
  const [documentType, setDocumentType] = useState('govt_id');
  const [documentNumber, setDocumentNumber] = useState('');
  const [fileUrl, setFileUrl] = useState('https://pawconnect.s3.amazonaws.com/docs/id_card.pdf');
  const [isUploading, setIsUploading] = useState(false);

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      if (user?.id) {
        await uploadVerificationDocument({
          document_type: documentType,
          document_number: documentNumber,
          file_url: fileUrl,
        }, user.id);
        updateUser({ verification_status: 'pending' });
      }
      setStep(3);
    } catch (err) {
      console.error(err);
      setStep(3);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <div className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
            <PawPrint className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            PawConnect <span className="text-emerald-400">AI</span>
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Setup Your Profile
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Step {step} of 3 • Personalize your PawConnect experience
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">1. Personal Information</h3>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  City Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru, Mumbai, Delhi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Bio / About Me
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleDocumentSubmit} className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">2. Identity Verification (Optional)</h3>
              <p className="text-xs text-slate-400">
                Upload Government ID, NGO License, or Vet Certificate to get a verified trust badge.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white"
                >
                  <option value="govt_id">Government Photo ID / Aadhaar</option>
                  <option value="ngo_cert">NGO Registration Certificate</option>
                  <option value="shelter_license">Shelter Operating License</option>
                  <option value="vet_license">Veterinary Medical Council Registration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Document ID Number
                </label>
                <input
                  type="text"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isUploading ? 'Submitting Verification...' : 'Submit & Complete Onboarding'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="p-6 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-xl font-black text-white">All Set! Welcome to PawConnect</h3>
              <p className="text-xs text-slate-300">Your profile is personalized and ready for pet adoptions, marketplace orders, and AI tele-vet consultations.</p>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
