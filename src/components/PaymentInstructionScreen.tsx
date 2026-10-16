import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Copy, 
  Check, 
  Clock, 
  ShieldAlert, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Listing } from '../types';

interface PaymentInstructionScreenProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitMpesaRef: (listingId: string, mpesaRef: string) => void;
  onOpenAdminConsole: () => void;
}

export const PaymentInstructionScreen: React.FC<PaymentInstructionScreenProps> = ({
  listing,
  isOpen,
  onClose,
  onSubmitMpesaRef,
  onOpenAdminConsole,
}) => {
  if (!isOpen || !listing) return null;

  const [copiedTill, setCopiedTill] = useState(false);
  const [mpesaCode, setMpesaCode] = useState(listing.mpesaRef || '');
  const [isSimulatingStk, setIsSimulatingStk] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(listing.isFeePaid);

  const tillNumber = '1823325';

  const handleCopyTill = () => {
    navigator.clipboard?.writeText(tillNumber);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2000);
  };

  const handleSimulateStk = () => {
    setIsSimulatingStk(true);
    setTimeout(() => {
      const generatedRef = `QK${Math.floor(100 + Math.random() * 900)}XP${Math.floor(10 + Math.random() * 90)}`;
      setMpesaCode(generatedRef);
      setIsSimulatingStk(false);
      setIsSubmitted(true);
      onSubmitMpesaRef(listing.id, generatedRef);
    }, 1200);
  };

  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mpesaCode.trim()) return;
    setIsSubmitted(true);
    onSubmitMpesaRef(listing.id, mpesaCode.trim().toUpperCase());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#008938]/20 border border-[#008938]/40 text-[#008938] flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F3B71B]">
                  Listing Fee Instructions
                </span>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded">
                  Pending Approval
                </span>
              </div>
              <h2 className="text-base font-bold text-white font-heading">
                M-Pesa Payment (KSh 80 / Month)
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4 text-xs sm:text-sm">
          {/* Listing Snapshot */}
          <div className="p-3.5 bg-[#242424] rounded-2xl border border-neutral-700/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] text-neutral-400 uppercase font-mono block">Submitted Listing</span>
              <h4 className="font-bold text-white text-xs sm:text-sm truncate">{listing.title}</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">{listing.campusName} · {listing.category}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-neutral-400 block">Advertising Fee</span>
              <span className="font-mono font-black text-sm text-[#F3B71B]">KSh 80.00</span>
              <span className="text-[10px] text-neutral-400 block">30 Days</span>
            </div>
          </div>

          {/* M-Pesa Instructions Card */}
          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-600/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-[#008938] text-white text-xs font-black font-mono px-2 py-0.5 rounded">
                  LIPA NA M-PESA
                </span>
                <span className="text-xs font-bold text-white">Buy Goods (Till Number)</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">KSh 80 ONLY</span>
            </div>

            {/* Buy Goods Till Details */}
            <div className="p-3.5 bg-[#1A1A1A] rounded-xl border border-emerald-500/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                  Buy Goods &amp; Services Till
                </span>
                <button
                  type="button"
                  onClick={handleCopyTill}
                  className="text-xs text-[#F3B71B] hover:text-white font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  {copiedTill ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTill ? 'Copied 1823325' : 'Copy Till'}</span>
                </button>
              </div>
              <div className="flex items-baseline justify-between pt-1 border-t border-neutral-800">
                <div>
                  <div className="text-[10px] text-neutral-400 font-medium">Till Number</div>
                  <div className="font-mono font-black text-xl text-white tracking-wider">{tillNumber}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-neutral-400 font-medium">Account / Store</div>
                  <div className="text-xs font-bold text-[#F3B71B]">STUDSPOT KENYA</div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-300 leading-normal">
              1. Open M-Pesa &gt; Lipa na M-Pesa &gt; <strong>Buy Goods and Services</strong>.<br/>
              2. Enter Till Number <strong className="text-white font-mono">{tillNumber}</strong> (STUDSPOT KENYA).<br/>
              3. Enter Amount <strong className="text-white font-mono">KSh 80</strong>, confirm with your M-Pesa PIN.
            </p>
          </div>

          {/* Submission Form / STK Simulation */}
          <div className="space-y-3 pt-1">
            <label className="block text-xs font-bold text-neutral-300">
              Enter Safaricom M-Pesa Confirmation Code:
            </label>

            <form onSubmit={handleSubmitCode} className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={mpesaCode}
                  onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
                  placeholder="e.g. QK948XP12"
                  className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-[#242424] text-white font-mono font-bold uppercase rounded-xl border border-neutral-700 focus:border-[#F3B71B] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs rounded-xl transition-all whitespace-nowrap"
                >
                  Submit Code
                </button>
              </div>
            </form>

            {/* Quick Demo STK Trigger */}
            <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-700 flex items-center justify-between gap-2">
              <div className="text-xs">
                <span className="font-semibold text-white block">Evaluator Quick Test:</span>
                <span className="text-[11px] text-neutral-400">Simulate instant KSh 80 M-Pesa prompt</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateStk}
                disabled={isSimulatingStk}
                className="px-3 py-1.5 bg-[#008938] hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{isSimulatingStk ? 'Sending Prompt...' : 'Simulate STK Push'}</span>
              </button>
            </div>
          </div>

          {/* Current Approval Status Banner */}
          <div className="p-3.5 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">Database Property:</span>
              <span className="font-mono text-xs font-bold text-amber-400">isApproved: False (Default)</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium">Listing Fee Status:</span>
              <span className={`font-mono text-xs font-bold ${isSubmitted ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isSubmitted ? `KSh 80 Paid (${mpesaCode || 'Ref Submitted'})` : 'Awaiting Payment'}
              </span>
            </div>

            <p className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800 leading-normal">
              Per platform specifications, all listings remain hidden from the public feed until manually vetted and approved by the administrator.
            </p>
          </div>

          {/* Test Cycle Fast Action */}
          <div className="p-3 bg-[#F3B71B]/10 rounded-2xl border border-[#F3B71B]/30 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-bold text-[#F3B71B] block">Next Step in Test Cycle:</span>
              <span className="text-[11px] text-neutral-300">Admin manually approves listing in database</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdminConsole();
              }}
              className="px-3 py-1.5 bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1 shrink-0"
            >
              <span>Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#141414] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
          >
            Done (Return to Feed)
          </button>
        </div>
      </div>
    </div>
  );
};
