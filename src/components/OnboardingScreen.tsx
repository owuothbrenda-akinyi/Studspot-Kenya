import React from 'react';
import { 
  ShoppingBag, 
  Home, 
  Briefcase, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Lock,
  X
} from 'lucide-react';

interface OnboardingScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignUp: () => void;
  onOpenTerms: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  isOpen,
  onClose,
  onOpenSignUp,
  onOpenTerms,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col my-auto relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close / Guest escape hatch */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Banner */}
        <div className="p-6 pt-8 text-center space-y-3 bg-gradient-to-b from-[#252525] to-[#1A1A1A] border-b border-neutral-800">
          <div className="w-20 h-20 rounded-3xl overflow-hidden p-1 bg-neutral-950 border-2 border-[#F3B71B]/60 mx-auto shadow-2xl shadow-amber-950/40 flex items-center justify-center">
            <img
              src="/studspot-gold-icon.png"
              alt="STUDSPOT Official Logo"
              className="w-full h-full object-cover rounded-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/studspot-gold-icon.png';
              }}
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white font-heading tracking-tight">
              STUDSPOT
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              The Peer-to-Peer Campus Marketplace, Hostel Finder & Job Board for Kenyan University & College Students
            </p>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="p-5 space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1">
              <ShoppingBag className="w-4 h-4 text-[#F3B71B]" />
              <div className="font-bold text-white">Marketplace</div>
              <p className="text-[10px] text-neutral-400 leading-tight">Textbooks, laptops & student fashion</p>
            </div>

            <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1">
              <Home className="w-4 h-4 text-[#F3B71B]" />
              <div className="font-bold text-white">Housing</div>
              <p className="text-[10px] text-neutral-400 leading-tight">Verified bedsitters near campus gates</p>
            </div>

            <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1">
              <Briefcase className="w-4 h-4 text-[#F3B71B]" />
              <div className="font-bold text-white">Jobs & Gigs</div>
              <p className="text-[10px] text-neutral-400 leading-tight">Peer tutoring, research & promo gigs</p>
            </div>

            <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1">
              <Store className="w-4 h-4 text-[#F3B71B]" />
              <div className="font-bold text-white">Services</div>
              <p className="text-[10px] text-neutral-400 leading-tight">Campus kibanda food & tech repair</p>
            </div>
          </div>

          {/* Trust strip */}
          <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Admin Vetted Listings</span>
            </div>
            <span className="font-mono text-[#F3B71B] font-bold">KSh 80 / Month</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 pt-0 space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSignUp();
            }}
            className="w-full py-3 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs shadow-lg shadow-[#F3B71B]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Create Student Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#242424] hover:bg-neutral-800 text-neutral-300 font-bold text-xs transition-colors"
          >
            Browse Public Feed as Guest
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onOpenTerms}
              className="text-[11px] text-neutral-500 hover:text-[#F3B71B] underline transition-colors"
            >
              Legal Terms of Service & Intermediary Disclaimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
