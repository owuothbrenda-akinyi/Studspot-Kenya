import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  ArrowUpRight, 
  Wifi, 
  Droplet, 
  Clock, 
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onOpenDetail: (listing: Listing) => void;
  onOpenMpesaGuide: (listing: Listing, e: React.MouseEvent) => void;
  onShare?: (listing: Listing, e: React.MouseEvent) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isSaved,
  onToggleSave,
  onOpenDetail,
  onOpenMpesaGuide,
  onShare,
}) => {
  const [imgError, setImgError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  const getWhatsAppLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanNumber = listing.seller.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Habari ${listing.seller.name}! I saw your listing "${listing.title}" (KES ${formatPrice(listing.price)}) on STUDSPOT. Is it still available for meetup at ${listing.campusName}?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const getCampusCategoryInfo = (uniId: string) => {
    if (uniId.startsWith('kmtc')) {
      return { label: 'KMTC', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    }
    if (uniId.includes('poly')) {
      return { label: 'POLY', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
    }
    if (['ntti', 'kinyanjui_tech', 'rvtti', 'kist', 'thika_tvet', 'riat', 'kaiboi_tvet'].includes(uniId)) {
      return { label: 'TVET', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
    }
    return { label: 'UNI', color: 'bg-[#F3B71B]/15 text-[#F3B71B] border-[#F3B71B]/30' };
  };

  const campusCat = getCampusCategoryInfo(listing.universityId);

  return (
    <div
      onClick={() => onOpenDetail(listing)}
      className={`group bg-[#1E1E1E] rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.3)] ${
        listing.isSold
          ? 'border-neutral-800/80 opacity-75 grayscale contrast-90 hover:grayscale-[30%] hover:opacity-95'
          : 'border-neutral-800 hover:border-[#F3B71B]/50 hover:shadow-[0_8px_24px_rgba(243,183,27,0.1)]'
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
        {!imgError ? (
          <img
            src={listing.image}
            alt={listing.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-300 ${
              listing.isSold ? 'blur-[0.5px]' : 'group-hover:scale-[1.03]'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#252525] text-neutral-400">
            <span className="text-2xl mb-1">
              {listing.type === 'item' && '📦'}
              {listing.type === 'hostel' && '🏠'}
              {listing.type === 'gig' && '💼'}
              {listing.type === 'business' && '🏪'}
            </span>
            <span className="text-xs font-semibold text-neutral-300 text-center line-clamp-1">{listing.title}</span>
          </div>
        )}

        {/* Sold Overlay Banner */}
        {listing.isSold && (
          <div className="absolute inset-0 bg-neutral-950/65 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center p-3 pointer-events-none">
            <div className="bg-rose-950/90 border border-rose-500/80 text-rose-100 font-black text-xs uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>SOLD</span>
            </div>
            <span className="text-[10px] text-neutral-300 font-medium mt-1 drop-shadow">
              Archived in History
            </span>
          </div>
        )}

        {/* Action buttons: Share & Favorite */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare?.(listing, e);
            }}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-300 hover:text-[#F3B71B] active:scale-90 transition-all"
            aria-label="Share listing"
            title="Share with comrades"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => onToggleSave(listing.id, e)}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-sm shadow-sm flex items-center justify-center text-neutral-300 hover:text-rose-500 active:scale-90 transition-all"
            aria-label={isSaved ? 'Remove from saved' : 'Save listing'}
          >
            <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-neutral-300'}`} />
          </button>
        </div>

        {/* Type indicator text */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          <span className="bg-black/85 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border border-neutral-800">
            {listing.type === 'item' && 'MARKETPLACE'}
            {listing.type === 'hostel' && 'HOUSING'}
            {listing.type === 'gig' && 'JOB / GIG'}
            {listing.type === 'business' && 'LOCAL SERVICE'}
          </span>
          <span className={`backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wide border font-mono ${campusCat.color}`}>
            {campusCat.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata row with zero-pill rule */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5">
            <span className="font-semibold text-neutral-300 truncate max-w-[120px]">{listing.category}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="truncate">{listing.campusName}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-[#F3B71B] transition-colors">
            {listing.title}
          </h3>

          {/* Quick domain metadata */}
          {listing.type === 'hostel' && (
            <div className="mt-2 text-[11px] text-neutral-300 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-cyan-400" />
                {listing.details.waterStatus || 'Water 24/7'}
              </span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-400" />
                Wi-Fi
              </span>
            </div>
          )}

          {listing.type === 'gig' && (
            <div className="mt-2 text-[11px] text-neutral-300 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#F3B71B]" />
              <span>{listing.details.gigDuration || 'Flexible'}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-[#F3B71B] font-medium">{listing.details.compensationType || 'Per Task'}</span>
            </div>
          )}

          {listing.type === 'item' && listing.details.condition && (
            <div className="mt-2 text-[11px] text-neutral-400 flex items-center gap-1">
              <span>Condition:</span>
              <span className="font-medium text-neutral-200">{listing.details.condition}</span>
            </div>
          )}

          {listing.type === 'business' && listing.details.deliveryAvailable && (
            <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Hostel Doorstep Delivery</span>
            </div>
          )}
        </div>

        {/* Bottom row: Price & Quick Action buttons */}
        <div className="mt-3 pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-neutral-400 font-medium">
              {listing.isSold ? 'Sold Price (KES)' : 'Price (KES)'}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-black font-mono tracking-tight ${
                listing.isSold ? 'text-neutral-400 line-through' : 'text-[#F3B71B]'
              }`}>
                KES {formatPrice(listing.price)}
              </span>
              {listing.isSold ? (
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono">
                  SOLD
                </span>
              ) : (
                listing.priceLabel && (
                  <span className="text-[11px] text-neutral-400 font-medium">{listing.priceLabel}</span>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={getWhatsAppLink}
              className="min-h-[36px] min-w-[36px] px-2.5 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-600/30 hover:bg-[#008938] hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Chat with seller on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenDetail(listing)}
              className="min-h-[36px] min-w-[36px] p-2 rounded-xl bg-neutral-800 text-neutral-200 hover:bg-[#F3B71B] hover:text-black transition-colors flex items-center justify-center"
              title="View full details"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Seller Info micro-strip */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1 truncate">
            {listing.seller.isVerifiedStudent ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <span className="w-1.5 h-1.5 bg-neutral-600 rounded-full shrink-0" />
            )}
            <span className="truncate font-medium text-neutral-300">{listing.seller.name}</span>
          </div>
          <span className="text-neutral-500 text-[10px] shrink-0 font-mono">
            {listing.seller.trustScore}% trust
          </span>
        </div>
      </div>
    </div>
  );
};
