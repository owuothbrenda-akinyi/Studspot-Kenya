import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Share2, 
  ShieldAlert, 
  CreditCard, 
  CheckCircle, 
  Droplet, 
  Wifi, 
  Zap, 
  Building2, 
  Clock, 
  Check, 
  Copy,
  Send,
  Scale,
  CheckCircle2,
  RotateCcw,
  Tag,
  History
} from 'lucide-react';
import { Listing } from '../types';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onOpenMpesaModal: (listing: Listing) => void;
  onOpenInAppChat: (listing: Listing) => void;
  onOpenTerms: () => void;
  onOpenShareModal?: (listing: Listing) => void;
  onToggleSold?: (listingId: string) => void;
  onOpenTransactionHistory?: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isSaved,
  onToggleSave,
  onOpenMpesaModal,
  onOpenInAppChat,
  onOpenTerms,
  onOpenShareModal,
  onToggleSold,
  onOpenTransactionHistory,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTill, setCopiedTill] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!listing) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  const handleShare = () => {
    if (onOpenShareModal) {
      onOpenShareModal(listing);
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyTill = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2000);
  };

  const openWhatsApp = () => {
    const cleanNumber = listing.seller.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Habari ${listing.seller.name}! I saw your listing "${listing.title}" (KES ${formatPrice(listing.price)}) on STUDSPOT. Is it available for meetup at ${listing.campusName}?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const callSeller = () => {
    window.location.href = `tel:${listing.seller.phone}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full sm:max-w-2xl bg-[#1A1A1A] text-slate-100 sm:rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[96vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Close and Share */}
        <div className="sticky top-0 z-20 bg-[#141414]/95 backdrop-blur-md px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F3B71B]">
              {listing.type === 'item' && 'Marketplace Listing'}
              {listing.type === 'hostel' && 'Student Housing & Hostels'}
              {listing.type === 'gig' && 'Jobs & Campus Gigs'}
              {listing.type === 'business' && 'Local Campus Service'}
            </span>
            {listing.isSold ? (
              <span className="text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Marked as Sold
              </span>
            ) : listing.isApproved ? (
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.2 rounded font-mono font-bold">
                ✓ Admin Approved
              </span>
            ) : (
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.2 rounded font-mono font-bold">
                Pending Approval
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-neutral-300 hover:bg-neutral-800 transition-colors flex items-center gap-1 text-xs font-medium"
              title="Share listing link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-[#F3B71B]" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => onToggleSave(listing.id, e)}
              className="p-2 rounded-xl text-neutral-300 hover:bg-neutral-800 transition-colors"
              aria-label="Save listing"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-neutral-300'}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          {/* Sold Archival Notice Banner if item is marked as Sold */}
          {listing.isSold && (
            <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-3.5 flex items-start justify-between gap-3 animate-in fade-in">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-rose-200">
                    This Listing Has Been Marked as SOLD
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                    Deal concluded. This item is blurred/grayed out in the public campus feed but preserved as part of the user's transaction history.
                    {listing.soldAt && <span className="font-mono text-rose-300"> ({listing.soldAt})</span>}
                  </p>
                </div>
              </div>
              {onOpenTransactionHistory && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTransactionHistory();
                  }}
                  className="text-[11px] font-bold text-[#F3B71B] hover:text-[#ffd666] underline whitespace-nowrap shrink-0 flex items-center gap-1"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>View History →</span>
                </button>
              )}
            </div>
          )}

          {/* Main Visual */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-900 border border-neutral-800">
            {!imgError ? (
              <img
                src={listing.image}
                alt={listing.title}
                onError={() => setImgError(true)}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${listing.isSold ? 'grayscale contrast-90 blur-[0.5px]' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#242424] text-neutral-400">
                <span className="text-4xl mb-2">📸</span>
                <span className="text-sm font-semibold text-white">{listing.title}</span>
              </div>
            )}

            {listing.isSold && (
              <div className="absolute inset-0 bg-neutral-950/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                <span className="bg-rose-950/90 border border-rose-500/80 text-rose-100 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl shadow-2xl flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>SOLD · ARCHIVED</span>
                </span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1.5 border border-neutral-700">
              <MapPin className="w-3.5 h-3.5 text-[#F3B71B]" />
              <span>{listing.campusName}</span>
            </div>
          </div>

          {/* Title & Price Header */}
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
              <span className="font-semibold text-[#F3B71B]">{listing.category}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>Listed {listing.createdAt}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{listing.viewsCount} views</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {listing.title}
            </h1>

            <div className="mt-3 flex items-baseline gap-2 flex-wrap">
              <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                listing.isSold ? 'text-neutral-400 line-through' : 'text-[#F3B71B]'
              }`}>
                KES {formatPrice(listing.price)}
              </span>
              {listing.isSold ? (
                <span className="text-xs font-black text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded font-mono">
                  SOLD
                </span>
              ) : (
                listing.priceLabel && (
                  <span className="text-sm font-semibold text-neutral-400">{listing.priceLabel}</span>
                )
              )}
              {listing.isNegotiable && !listing.isSold && (
                <span className="text-xs font-semibold text-neutral-300 bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded-md ml-2">
                  Negotiable
                </span>
              )}
            </div>
          </div>

          {/* Deal & Transaction Status Action Card */}
          <div className="bg-[#222222] rounded-2xl p-3.5 border border-neutral-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <Tag className="w-4 h-4 text-[#F3B71B] shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                  <span>Deal Status:</span>
                  {listing.isSold ? (
                    <span className="text-rose-400 font-mono font-bold bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded text-[11px]">
                      SOLD · Archived
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded text-[11px]">
                      ACTIVE · Live in Feed
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {listing.isSold
                    ? 'Item is marked sold. It is grayed out in feeds and tracked in your transaction history.'
                    : 'Agreed a transaction with a fellow student? Mark as Sold to gray out in feed and record history.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => onToggleSold?.(listing.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                  listing.isSold
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600'
                    : 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-500'
                }`}
              >
                {listing.isSold ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Relist (Mark Active)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Sold</span>
                  </>
                )}
              </button>

              {onOpenTransactionHistory && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTransactionHistory();
                  }}
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700"
                  title="Open Transaction History"
                >
                  <History className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">About This Listing</h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Domain Specific Feature Panels */}
          {listing.type === 'hostel' && (
            <div className="bg-[#242424] rounded-2xl p-4 border border-neutral-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#F3B71B]" />
                <span>Hostel Specifications</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#1A1A1A] rounded-xl border border-neutral-800">
                  <div className="text-neutral-400 font-medium">Room Type</div>
                  <div className="font-bold text-white mt-0.5">{listing.details.hostelType || 'Bedsitter'}</div>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] rounded-xl border border-neutral-800">
                  <div className="text-neutral-400 font-medium">Distance to Gate</div>
                  <div className="font-bold text-white mt-0.5">{listing.details.distanceToGate || '5 mins walk'}</div>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] rounded-xl border border-neutral-800">
                  <div className="text-neutral-400 font-medium flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Water Status
                  </div>
                  <div className="font-bold text-white mt-0.5">{listing.details.waterStatus || 'Borehole 24/7'}</div>
                </div>
                <div className="p-2.5 bg-[#1A1A1A] rounded-xl border border-neutral-800">
                  <div className="text-neutral-400 font-medium flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Electricity
                  </div>
                  <div className="font-bold text-white mt-0.5">{listing.details.electricityType || 'Prepaid Token'}</div>
                </div>
              </div>

              {listing.details.roomFeatures && listing.details.roomFeatures.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">Amenities Included</div>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.details.roomFeatures.map((feat, i) => (
                      <span key={i} className="text-xs bg-[#1A1A1A] border border-neutral-700 px-2.5 py-1 rounded-lg text-neutral-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-[#F3B71B]" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {listing.type === 'gig' && (
            <div className="bg-[#242424] rounded-2xl p-4 border border-neutral-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#F3B71B]" />
                <span>Gig Requirements & Duration</span>
              </h3>
              <div className="flex items-center justify-between text-xs p-3 bg-[#1A1A1A] rounded-xl border border-neutral-800">
                <div>
                  <span className="text-neutral-400">Duration: </span>
                  <span className="font-bold text-white">{listing.details.gigDuration}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Compensation: </span>
                  <span className="font-bold text-[#F3B71B]">{listing.details.compensationType}</span>
                </div>
              </div>

              {listing.details.skillsNeeded && (
                <div>
                  <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">Skills Needed</div>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.details.skillsNeeded.map((skill, i) => (
                      <span key={i} className="text-xs bg-[#1A1A1A] border border-neutral-700 px-2.5 py-1 rounded-lg text-neutral-300 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {listing.type === 'business' && (
            <div className="bg-[#242424] rounded-2xl p-4 border border-neutral-800 space-y-2.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Business Operating Hours & Delivery</h3>
              <div className="text-xs text-neutral-300 space-y-1">
                <div><span className="text-neutral-400">Hours:</span> <span className="font-semibold text-white">{listing.details.openingHours}</span></div>
                {listing.details.deliveryNote && (
                  <div><span className="text-neutral-400">Delivery:</span> <span className="font-semibold text-[#F3B71B]">{listing.details.deliveryNote}</span></div>
                )}
              </div>
            </div>
          )}

          {/* Comrade Seller Card */}
          <div className="bg-[#242424] rounded-2xl p-4 border border-neutral-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F3B71B] text-black font-extrabold text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{listing.seller.name}</span>
                    {listing.seller.isVerifiedStudent && (
                      <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {listing.seller.courseOrBiz} {listing.seller.yearOfStudy ? `· ${listing.seller.yearOfStudy}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs font-mono font-bold text-[#F3B71B]">{listing.seller.trustScore}% Trust</div>
                <div className="text-[10px] text-neutral-400">{listing.seller.reviewsCount} reviews</div>
              </div>
            </div>

            {/* Recommended Safe Campus Meetup Spot */}
            <div className="mt-3.5 pt-3 border-t border-neutral-700 flex items-start gap-2 text-xs text-neutral-300">
              <MapPin className="w-4 h-4 text-[#F3B71B] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Recommended Campus Safe Spot: </span>
                <span>{listing.seller.safeSpot}</span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Always inspect item in daylight at public campus spots before paying.
                </p>
              </div>
            </div>

            {/* M-Pesa / Till display if available */}
            {(listing.seller.tillNumber || listing.seller.mpesaNumber) && (
              <div className="mt-2.5 p-2 bg-[#1A1A1A] rounded-xl border border-neutral-700 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-200 font-mono font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-[#F3B71B] shrink-0" />
                  <span>{listing.seller.tillNumber || `M-Pesa: ${listing.seller.mpesaNumber}`}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyTill(listing.seller.tillNumber || listing.seller.mpesaNumber || '')}
                  className="text-[11px] font-bold text-[#F3B71B] hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-neutral-800"
                >
                  {copiedTill ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTill ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Directory Intermediary Legal Disclaimer Banner */}
          <div className="bg-[#242424] rounded-2xl p-3.5 border border-neutral-700 flex items-start gap-2.5 text-xs text-neutral-300">
            <Scale className="w-4 h-4 text-[#F3B71B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white">STUDSPOT Directory Disclaimer:</span>
              <p className="text-[11px] text-neutral-400 leading-normal">
                STUDSPOT acts solely as an advertising venue & directory and is not a party to user transactions, leases, or job contracts. We assume no liability for defective goods or disputes.
              </p>
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-[#F3B71B] font-bold underline text-[11px] block mt-0.5"
              >
                Read Terms & Conditions & Liability Waiver →
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="sticky bottom-0 z-20 bg-[#141414] border-t border-neutral-800 p-3 sm:p-4 flex items-center gap-2">
          {/* WhatsApp Direct Connect */}
          <button
            type="button"
            onClick={openWhatsApp}
            className="flex-1 min-h-[46px] rounded-xl bg-[#008938] hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </button>

          {/* In-App Message */}
          <button
            type="button"
            onClick={() => onOpenInAppChat(listing)}
            className="min-h-[46px] px-3.5 rounded-xl bg-[#242424] hover:bg-neutral-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Send in-app message"
          >
            <Send className="w-4 h-4 text-[#F3B71B]" />
            <span className="hidden sm:inline">In-App Chat</span>
          </button>

          {/* Call direct */}
          <button
            type="button"
            onClick={callSeller}
            className="min-h-[46px] px-3.5 rounded-xl border border-neutral-700 bg-[#1A1A1A] hover:bg-neutral-800 text-neutral-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            title="Call seller"
          >
            <Phone className="w-4 h-4 text-neutral-400" />
            <span className="hidden sm:inline">Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
