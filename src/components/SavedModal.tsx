import React from 'react';
import { X, Heart, Trash2, ArrowUpRight } from 'lucide-react';
import { Listing } from '../types';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedListings: Listing[];
  onRemoveSaved: (id: string) => void;
  onOpenDetail: (listing: Listing) => void;
}

export const SavedModal: React.FC<SavedModalProps> = ({
  isOpen,
  onClose,
  savedListings,
  onRemoveSaved,
  onOpenDetail,
}) => {
  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-sm text-slate-900">Saved Campus Listings</h3>
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-mono text-slate-600">
              {savedListings.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-2.5">
          {savedListings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Heart className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p>No saved listings yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">Tap the heart icon on any textbook, hostel, or gig to bookmark it here.</p>
            </div>
          ) : (
            savedListings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-200/80 hover:bg-white transition-all gap-3"
              >
                <div 
                  onClick={() => {
                    onClose();
                    onOpenDetail(listing);
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-200"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{listing.title}</h4>
                    <div className="text-[11px] text-slate-500 mt-0.5">{listing.campusName}</div>
                    <div className="text-xs font-black text-emerald-800 font-mono mt-0.5">
                      KES {formatPrice(listing.price)} {listing.priceLabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDetail(listing);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="View details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveSaved(listing.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
