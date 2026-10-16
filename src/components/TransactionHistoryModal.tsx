import React, { useState, useMemo } from 'react';
import { 
  X, 
  History, 
  CheckCircle2, 
  RotateCcw, 
  ShoppingBag, 
  ArrowUpRight, 
  Receipt, 
  Tag, 
  ShieldCheck, 
  CreditCard,
  PlusCircle,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Listing, User } from '../types';

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  currentUser: User | null;
  onToggleSold: (listingId: string) => void;
  onOpenDetail: (listing: Listing) => void;
  onOpenPostModal: () => void;
}

type HistoryTab = 'all' | 'sold' | 'active' | 'mpesa';

export const TransactionHistoryModal: React.FC<TransactionHistoryModalProps> = ({
  isOpen,
  onClose,
  listings,
  currentUser,
  onToggleSold,
  onOpenDetail,
  onOpenPostModal,
}) => {
  const [activeTab, setActiveTab] = useState<HistoryTab>('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  const userListings = useMemo(() => {
    return listings;
  }, [listings]);

  const soldListings = useMemo(() => {
    return userListings.filter(item => !!item.isSold);
  }, [userListings]);

  const activeListings = useMemo(() => {
    return userListings.filter(item => !item.isSold);
  }, [userListings]);

  const mpesaReceipts = useMemo(() => {
    return userListings.filter(item => item.isFeePaid || item.mpesaRef);
  }, [userListings]);

  const totalSoldValue = useMemo(() => {
    return soldListings.reduce((sum, item) => sum + item.price, 0);
  }, [soldListings]);

  const displayedListings = useMemo(() => {
    if (activeTab === 'sold') return soldListings;
    if (activeTab === 'active') return activeListings;
    return userListings;
  }, [activeTab, userListings, soldListings, activeListings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[94vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F3B71B]/15 border border-[#F3B71B]/30 flex items-center justify-center text-[#F3B71B]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white font-heading">
                  Transaction History & Activity
                </h2>
                <span className="text-[10px] bg-neutral-800 text-neutral-300 border border-neutral-700 px-2 py-0.5 rounded-full font-mono">
                  {currentUser?.fullName || 'Brian Mwangi'}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Track campus deals, completed sales, grayed-out items & M-Pesa receipts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Metrics Strip */}
        <div className="p-4 bg-[#141414]/60 border-b border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#202020] p-3 rounded-2xl border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              Sold Deals
            </div>
            <div className="text-lg font-black text-rose-400 font-mono mt-0.5">
              {soldListings.length}
            </div>
            <div className="text-[10px] text-neutral-500 truncate mt-0.5">
              Archived in feed
            </div>
          </div>

          <div className="bg-[#202020] p-3 rounded-2xl border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              Closed Value
            </div>
            <div className="text-lg font-black text-[#F3B71B] font-mono mt-0.5 truncate">
              KES {formatPrice(totalSoldValue)}
            </div>
            <div className="text-[10px] text-neutral-500 truncate mt-0.5">
              Total volume sold
            </div>
          </div>

          <div className="bg-[#202020] p-3 rounded-2xl border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              Active Listings
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {activeListings.length}
            </div>
            <div className="text-[10px] text-neutral-500 truncate mt-0.5">
              Live on campus
            </div>
          </div>

          <div className="bg-[#202020] p-3 rounded-2xl border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              M-Pesa Receipts
            </div>
            <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
              {mpesaReceipts.length}
            </div>
            <div className="text-[10px] text-neutral-500 truncate mt-0.5">
              KSh 80 fees verified
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="px-4 pt-3 pb-2 border-b border-neutral-800 bg-[#171717] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#F3B71B] text-black shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>All Listings</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md font-mono bg-black/20">
              {userListings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sold')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sold'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Sold (Archived)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md font-mono bg-black/20">
              {soldListings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <span>Active Listings</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md font-mono bg-black/20">
              {activeListings.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mpesa')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'mpesa'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>M-Pesa Receipts</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md font-mono bg-black/20">
              {mpesaReceipts.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3">
          {activeTab === 'mpesa' ? (
            /* M-Pesa Fee Records Table */
            <div className="space-y-2.5">
              {mpesaReceipts.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>No M-Pesa fee receipts recorded yet.</p>
                </div>
              ) : (
                mpesaReceipts.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#202020] rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400">
                            {item.mpesaRef || 'QK-VERIFIED'}
                          </span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                            Verified Safaricom
                          </span>
                        </div>
                        <div className="text-white font-medium truncate mt-0.5">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Campus: {item.campusName} · Fee: KES 80 Listing Tier
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <div className="text-right">
                        <div className="font-mono font-bold text-white">KES 80.00</div>
                        <div className="text-[10px] text-neutral-400 font-mono">Status: Paid</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenDetail(item);
                        }}
                        className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                        title="View listing"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : displayedListings.length === 0 ? (
            /* Empty state */
            <div className="text-center py-12 text-neutral-500 text-xs space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-neutral-600" />
              <p className="font-bold text-neutral-300 text-sm">No listings found in this category</p>
              <p className="text-neutral-500 max-w-sm mx-auto">
                {activeTab === 'sold'
                  ? 'No items marked as sold yet. When you conclude a transaction, click "Mark as Sold" on any of your listings to gray it out on the feed and archive it here.'
                  : 'Start by posting a textbook, hostel room, or student gig.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPostModal();
                  }}
                  className="px-4 py-2 bg-[#F3B71B] hover:bg-[#dca415] text-black font-bold rounded-xl text-xs"
                >
                  Post a New Listing
                </button>
              </div>
            </div>
          ) : (
            /* Listings List */
            displayedListings.map((item) => (
              <div
                key={item.id}
                className={`p-3 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  item.isSold
                    ? 'bg-[#1C1C1C] border-neutral-800/80 opacity-80'
                    : 'bg-[#212121] border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Left side: Thumbnail + Details */}
                <div 
                  onClick={() => {
                    onClose();
                    onOpenDetail(item);
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover ${item.isSold ? 'grayscale contrast-90 blur-[0.5px]' : ''}`}
                    />
                    {item.isSold && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-[9px] font-black text-rose-300 uppercase tracking-widest bg-rose-950/80 px-1 py-0.5 rounded border border-rose-500/50">
                          SOLD
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#F3B71B] uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-neutral-600">·</span>
                      <span className="text-[11px] text-neutral-400 truncate">
                        {item.campusName}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-mono font-bold ${
                        item.isSold ? 'text-neutral-400 line-through' : 'text-[#F3B71B]'
                      }`}>
                        KES {formatPrice(item.price)} {item.priceLabel}
                      </span>

                      {item.isSold ? (
                        <span className="text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Sold {item.soldAt ? `(${item.soldAt})` : ''}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono font-bold">
                          Active in Feed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Action Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Toggle Sold Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSold(item.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                      item.isSold
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                        : 'bg-rose-600 hover:bg-rose-500 text-white border border-rose-500'
                    }`}
                    title={item.isSold ? 'Mark this listing as active again' : 'Mark this listing as sold'}
                  >
                    {item.isSold ? (
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

                  {/* View Details */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDetail(item);
                    }}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="View full listing details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3.5 bg-[#141414] border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#F3B71B]" />
            <span>Marking items as 'Sold' blurs & grays them out in the public feed while preserving transaction records.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition-colors shrink-0 ml-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
