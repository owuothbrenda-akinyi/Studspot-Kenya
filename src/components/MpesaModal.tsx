import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Copy, 
  Smartphone, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Listing } from '../types';

interface MpesaModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({ listing, onClose }) => {
  if (!listing) return null;

  const [copiedTill, setCopiedTill] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('0712345678');
  const [stkState, setStkState] = useState<'idle' | 'sending' | 'prompted' | 'success'>('idle');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2000);
  };

  const handleSimulateStk = (e: React.FormEvent) => {
    e.preventDefault();
    setStkState('sending');
    setTimeout(() => {
      setStkState('prompted');
      setTimeout(() => {
        setStkState('success');
      }, 2500);
    }, 1200);
  };

  const paymentTarget = listing.seller.tillNumber || `Send Money: ${listing.seller.mpesaNumber || listing.seller.phone}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#008938] text-white p-5 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-black text-xl tracking-tight bg-white text-[#008938] px-2 py-0.5 rounded-md">
              M-PESA
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Safe Campus Trade
            </span>
          </div>
          <h2 className="text-base font-bold">Secure Campus Payment Guide</h2>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            Pay safely for &quot;{listing.title.substring(0, 32)}...&quot;
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Safety First Golden Rule */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Rule #1 for University Comrades:</span>
              <p className="text-[11px] mt-0.5 leading-relaxed text-amber-800">
                Meet the seller in person at <span className="font-semibold underline">{listing.seller.safeSpot}</span>, test the item, and only confirm payment once physically satisfied!
              </p>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Item Amount</div>
              <div className="text-lg font-black text-slate-900 font-mono">
                KES {formatPrice(listing.price)} {listing.priceLabel}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Payee</div>
              <div className="text-xs font-bold text-slate-800">{listing.seller.name}</div>
            </div>
          </div>

          {/* Payment Target / Till */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Recipient Details:</span>
              <button
                type="button"
                onClick={() => copyToClipboard(paymentTarget)}
                className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 hover:text-emerald-900"
              >
                {copiedTill ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTill ? 'Copied to clipboard' : 'Copy details'}</span>
              </button>
            </div>
            <div className="p-3 bg-slate-900 text-white rounded-xl font-mono text-sm flex items-center justify-between">
              <span>{paymentTarget}</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* Interactive STK Push Simulator */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#008938]" />
              <span>Simulate M-Pesa STK Push / Prompt</span>
            </div>

            {stkState === 'idle' && (
              <form onSubmit={handleSimulateStk} className="space-y-2">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="07XX XXX XXX"
                  className="w-full px-3 py-2 text-xs bg-slate-50 font-mono rounded-xl border border-slate-200 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#008938] hover:bg-[#00742f] text-white font-bold text-xs shadow-md shadow-emerald-700/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Send M-Pesa STK Prompt to Phone</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {stkState === 'sending' && (
              <div className="p-4 bg-emerald-50 rounded-2xl text-center space-y-1 text-xs text-emerald-900 font-medium">
                <div className="animate-spin w-5 h-5 border-2 border-[#008938] border-t-transparent rounded-full mx-auto mb-2" />
                <p>Connecting to Safaricom Daraja Gateway...</p>
              </div>
            )}

            {stkState === 'prompted' && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-center animate-pulse">
                <div className="text-[11px] text-emerald-400 font-mono font-bold">SIMULATED PHONE SCREEN</div>
                <div className="text-xs font-mono">
                  Do you want to pay KES {formatPrice(listing.price)} to {listing.seller.name}?
                </div>
                <div className="text-[11px] text-slate-400">Enter M-Pesa PIN: ****</div>
              </div>
            )}

            {stkState === 'success' && (
              <div className="p-4 bg-emerald-50 rounded-2xl text-center space-y-2">
                <div className="text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Transaction Demo Confirmed!</span>
                </div>
                <p className="text-[11px] text-slate-600 font-mono">
                  REF: QK948XP12 - KES {formatPrice(listing.price)} sent to {listing.seller.name}.
                </p>
                <button
                  type="button"
                  onClick={() => setStkState('idle')}
                  className="text-[11px] font-bold text-emerald-800 underline mt-1"
                >
                  Reset Demo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
