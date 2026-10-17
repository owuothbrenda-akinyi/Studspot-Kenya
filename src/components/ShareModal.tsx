import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Send, 
  Twitter, 
  Mail, 
  QrCode, 
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Listing } from '../types';

export interface ShareTarget {
  type: 'app' | 'listing';
  title: string;
  text: string;
  url: string;
  listing?: Listing;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: ShareTarget | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, target }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen || !target) return null;

  const shareUrl = target.url || window.location.href;
  const shareTitle = target.title;
  const shareText = target.text;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        // User cancelled or not supported
      }
    } else {
      handleCopyLink();
    }
  };

  // WhatsApp share URL
  const whatsAppMessage = encodeURIComponent(`${shareText}\n\n👉 Open on STUDSPOT: ${shareUrl}`);
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${whatsAppMessage}`;

  // Twitter / X share URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=STUDSPOT,CampusMarketplace,KenyanComrades`;

  // Telegram share URL
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;

  // Email share URL
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\nCheck it out here:\n${shareUrl}`)}`;

  // SMS share URL
  const smsUrl = `sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#181818] border border-neutral-700/80 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 text-white space-y-5 animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F3B71B]/15 border border-[#F3B71B]/40 flex items-center justify-center text-[#F3B71B]">
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {target.type === 'app' ? 'Share STUDSPOT' : 'Share with Comrades'}
              </h3>
              <p className="text-xs text-neutral-400">
                {target.type === 'app' ? 'Invite friends & campus groups' : 'Send this listing to WhatsApp or socials'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-neutral-800 hover:bg-neutral-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview box */}
        <div className="p-3 bg-[#222222] rounded-2xl border border-neutral-800 space-y-1.5">
          {target.listing ? (
            <div className="flex items-center gap-3">
              <img
                src={target.listing.image}
                alt={target.listing.title}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#F3B71B] uppercase tracking-wide block font-mono">
                  {target.listing.campusName}
                </span>
                <p className="text-xs font-bold text-white truncate">{target.listing.title}</p>
                <p className="text-xs font-mono font-bold text-emerald-400">
                  KES {target.listing.price.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 p-0.5 border border-[#F3B71B]/50 shrink-0">
                <img
                  src="/studspot-gold-icon.png"
                  alt="STUDSPOT"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white">STUDSPOT Campus App</p>
                <p className="text-[11px] text-neutral-400">
                  Peer-to-peer marketplace & student hostel directory across Kenya
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Native Share Button if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#F3B71B] to-[#dca415] text-black font-extrabold text-xs sm:text-sm rounded-xl hover:opacity-95 transition shadow-lg shadow-[#F3B71B]/20 flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4 stroke-[2.5]" />
            <span>Open System Share Sheet (More Apps)</span>
          </button>
        )}

        {/* Social channels grid */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Direct Share to Campus Comrades
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* WhatsApp */}
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 flex flex-col items-center justify-center gap-1 text-center transition group"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold">WhatsApp</span>
            </a>

            {/* X (Twitter) */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#202020] hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center gap-1 text-center transition group"
            >
              <Twitter className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold">X (Twitter)</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-300 flex flex-col items-center justify-center gap-1 text-center transition group"
            >
              <Send className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold">Telegram</span>
            </a>

            {/* SMS / Comrades */}
            <a
              href={smsUrl}
              className="p-2.5 rounded-xl bg-[#202020] hover:bg-neutral-800 border border-neutral-700 text-neutral-200 flex flex-col items-center justify-center gap-1 text-center transition group"
            >
              <Mail className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold">SMS / Text</span>
            </a>
          </div>
        </div>

        {/* Copy Link Row */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
            Copy Direct Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-[#202020] text-neutral-300 text-xs px-3 py-2 rounded-xl border border-neutral-700 truncate outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#F3B71B] hover:bg-[#dca415] text-black'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Toggle QR Code View */}
        <div className="pt-1">
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full py-2 px-3 rounded-xl bg-[#202020] hover:bg-[#282828] border border-neutral-800 text-xs text-neutral-300 flex items-center justify-center gap-1.5 transition"
          >
            <QrCode className="w-4 h-4 text-[#F3B71B]" />
            <span>{showQR ? 'Hide Campus QR Code' : 'Show Campus QR Code to scan in person'}</span>
          </button>

          {showQR && (
            <div className="mt-3 p-4 bg-white rounded-2xl flex flex-col items-center justify-center text-center animate-in fade-in">
              {/* High Contrast Clean SVG QR Representation */}
              <div className="w-40 h-40 bg-white p-2 border-2 border-black rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="black">
                  {/* Position detection patterns */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="none" stroke="black" strokeWidth="6" />
                  <rect x="12" y="12" width="14" height="14" fill="black" />
                  <rect x="67" y="5" width="28" height="28" rx="4" fill="none" stroke="black" strokeWidth="6" />
                  <rect x="74" y="12" width="14" height="14" fill="black" />
                  <rect x="5" y="67" width="28" height="28" rx="4" fill="none" stroke="black" strokeWidth="6" />
                  <rect x="12" y="74" width="14" height="14" fill="black" />
                  {/* QR Matrix Dots */}
                  <rect x="38" y="10" width="6" height="6" />
                  <rect x="48" y="18" width="6" height="6" />
                  <rect x="56" y="8" width="6" height="6" />
                  <rect x="38" y="26" width="6" height="6" />
                  <rect x="10" y="38" width="6" height="6" />
                  <rect x="22" y="44" width="6" height="6" />
                  <rect x="14" y="54" width="6" height="6" />
                  <rect x="40" y="40" width="20" height="20" rx="3" fill="#0F2D59" />
                  <circle cx="50" cy="50" r="5" fill="#F3B71B" />
                  <rect x="68" y="40" width="6" height="6" />
                  <rect x="80" y="48" width="6" height="6" />
                  <rect x="74" y="58" width="6" height="6" />
                  <rect x="42" y="68" width="6" height="6" />
                  <rect x="52" y="76" width="6" height="6" />
                  <rect x="40" y="86" width="6" height="6" />
                  <rect x="70" y="72" width="6" height="6" />
                  <rect x="82" y="82" width="6" height="6" />
                </svg>
              </div>
              <p className="mt-2 text-[11px] font-bold text-neutral-800 font-mono">
                Scan to open on smartphone camera
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
