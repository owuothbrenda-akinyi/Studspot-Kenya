import React, { useState } from 'react';
import { 
  X, 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Lock, 
  PlusCircle, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Package, 
  ExternalLink,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Vendor, Listing } from '../types';
import { approveVendor, getVendors } from '../utils/verificationStore';

interface VendorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
  vendorListings: Listing[];
  onOpenUploadProduct: () => void;
  onUpdateVendor: (updated: Vendor) => void;
  onOpenRegisterNewVendor?: () => void;
}

export const VendorDashboardModal: React.FC<VendorDashboardModalProps> = ({
  isOpen,
  onClose,
  vendor,
  vendorListings,
  onOpenUploadProduct,
  onUpdateVendor,
  onOpenRegisterNewVendor,
}) => {
  if (!isOpen) return null;

  const isVerified = vendor.status === 'verified';
  const isReview = vendor.status === 'review';
  const isRejected = vendor.status === 'rejected';

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'documents'>('overview');

  // Helper for quick testing/demo:
  const handleSimulateApproval = () => {
    const updated = approveVendor(vendor.id);
    if (updated) {
      onUpdateVendor(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#F3B71B]/15 border border-[#F3B71B]/40 flex items-center justify-center shrink-0">
              <Store className="w-6 h-6 text-[#F3B71B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-heading">
                  {vendor.legalBusinessName}
                </h2>
                {isVerified ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Vendor
                  </span>
                ) : isReview ? (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Under Review
                  </span>
                ) : (
                  <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                    Rejected
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400">
                {vendor.category} · Serving {vendor.nearestCampusName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenRegisterNewVendor && (
              <button
                type="button"
                onClick={onOpenRegisterNewVendor}
                className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold border border-neutral-700 transition flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5 text-[#F3B71B]" />
                <span className="hidden sm:inline">Register New Business</span>
                <span className="sm:hidden">New</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Alert Banner */}
        {isReview && (
          <div className="p-4 bg-amber-950/30 border-b border-amber-500/30 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-bold text-amber-300">
                  Profile State: <code className="font-mono bg-amber-900/50 px-1.5 py-0.2 rounded">status: "review"</code>
                </p>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  Your National ID and business location are being vetted by the campus admin team. Product and service uploads remain locked until verification is approved.
                </p>
              </div>
            </div>

            {/* Test action to simulate admin approval */}
            <button
              type="button"
              onClick={handleSimulateApproval}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold whitespace-nowrap transition flex items-center gap-1.5 self-start sm:self-auto"
              title="Test approval flow"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Simulate Approval</span>
            </button>
          </div>
        )}

        {isVerified && (
          <div className="p-3.5 bg-emerald-950/20 border-b border-emerald-500/30 text-emerald-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-300">
                Account Verified! You are fully authorized to upload campus meals, cyber printing rates, rooms, and products.
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-900/40 px-2 py-0.5 rounded font-bold shrink-0">
              Active Vendor
            </span>
          </div>
        )}

        {isRejected && (
          <div className="p-4 bg-rose-950/30 border-b border-rose-500/30 text-rose-200 text-xs flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <p className="font-bold text-rose-300">Verification Rejected</p>
              <p className="text-[11px] text-rose-200/80">
                {vendor.rejectionReason || 'Uploaded document was illegible or physical location could not be verified.'}
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Tabs & Actions */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-neutral-900 p-3.5 rounded-2xl border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Products Listed</span>
              <span className="text-xl font-black text-white font-heading mt-0.5 block">
                {vendorListings.length}
              </span>
            </div>
            <div className="bg-neutral-900 p-3.5 rounded-2xl border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Nearest Campus</span>
              <span className="text-xs font-bold text-[#F3B71B] truncate block mt-1">
                {vendor.nearestCampusName}
              </span>
            </div>
            <div className="bg-neutral-900 p-3.5 rounded-2xl border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Contact Phone</span>
              <span className="text-xs font-mono font-bold text-emerald-400 truncate block mt-1">
                {vendor.phone}
              </span>
            </div>
            <div className="bg-neutral-900 p-3.5 rounded-2xl border border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Trust Score</span>
              <span className="text-xl font-black text-amber-400 font-heading mt-0.5 block">
                ★ 4.9
              </span>
            </div>
          </div>

          {/* Action Callout: Product Upload Gate (Mandatory condition) */}
          <div className="bg-gradient-to-r from-neutral-900 to-[#141414] border border-neutral-800 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#F3B71B]" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Upload Campus Products & Services
                </h3>
              </div>
              <p className="text-xs text-neutral-400 max-w-lg">
                Post food menus, hostel vacancies, electronics, or campus printing packages directly to students.
              </p>
            </div>

            {/* Locked vs Unlocked Button */}
            {isVerified ? (
              <button
                type="button"
                onClick={onOpenUploadProduct}
                className="px-4 py-2.5 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs transition shadow-md flex items-center justify-center gap-1.5 shrink-0"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Upload New Product / Service</span>
              </button>
            ) : (
              <div className="relative group self-start sm:self-auto">
                <button
                  type="button"
                  disabled
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-500 font-bold text-xs cursor-not-allowed flex items-center gap-1.5 border border-neutral-700/60 opacity-60"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Uploads Locked (Pending Review)</span>
                </button>
                <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-neutral-800 border border-neutral-700 text-[11px] text-neutral-200 rounded-xl shadow-xl z-20">
                  🔒 Profile state must shift from <code className="text-[#F3B71B]">status: "review"</code> to <code className="text-emerald-400">status: "verified"</code> before uploading products.
                </div>
              </div>
            )}
          </div>

          {/* Business Details & Documents Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#F3B71B]" />
              <span>Business Registration Profile</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
                <span className="text-[10px] text-neutral-500 block">Physical Location:</span>
                <span className="font-medium text-white flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F3B71B] shrink-0" />
                  {vendor.locationDescription}
                </span>
              </div>

              <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
                <span className="text-[10px] text-neutral-500 block">Contact Person:</span>
                <span className="font-medium text-white mt-0.5 block">{vendor.contactPersonName}</span>
              </div>

              <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
                <span className="text-[10px] text-neutral-500 block">Contact Email:</span>
                <span className="font-medium text-neutral-200 mt-0.5 block truncate">{vendor.email}</span>
              </div>

              <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">National ID / Permit:</span>
                  <span className="font-mono text-emerald-400 text-[11px] mt-0.5 block truncate">
                    {vendor.nationalIdDocName || 'National_ID_Card.pdf'}
                  </span>
                </div>
                <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
              </div>
            </div>
          </div>

          {/* Current Products by Vendor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-[#F3B71B]" />
                <span>Active Listings & Services ({vendorListings.length})</span>
              </h4>
            </div>

            {vendorListings.length > 0 ? (
              <div className="space-y-2">
                {vendorListings.map((item) => (
                  <div 
                    key={item.id}
                    className="p-3 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-emerald-400 font-mono font-bold">
                          KES {item.price.toLocaleString()} {item.priceLabel}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      Live on Feed
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl space-y-2">
                <Package className="w-8 h-8 text-neutral-600 mx-auto" />
                <p className="text-xs font-bold text-neutral-300">No products uploaded yet</p>
                <p className="text-[11px] text-neutral-500 max-w-sm mx-auto">
                  {isVerified 
                    ? 'Your account is verified! Click "Upload New Product / Service" above to start selling to comrades.'
                    : 'Your account is in "review" state. Once approved by Campus Admin, you will be able to post listings here.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
