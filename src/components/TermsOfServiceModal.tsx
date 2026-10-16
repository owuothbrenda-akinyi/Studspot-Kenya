import React from 'react';
import { X, ShieldAlert, FileText, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton?: boolean;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  showAcceptButton = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F3B71B]/20 text-[#F3B71B] flex items-center justify-center font-bold">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">STUDSPOT Terms of Service & Legal Framework</h2>
              <p className="text-[11px] text-neutral-400">Platform Policies, Disclaimers & User Agreement</p>
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

        {/* Legal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-[#242424] border border-[#F3B71B]/30 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#F3B71B] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Notice to University & College Students
              </span>
              <p className="text-neutral-300 leading-normal">
                By creating an account or posting on STUDSPOT, you agree to these legally binding terms designed to protect the platform and fellow campus members.
              </p>
            </div>
          </div>

          {/* Clause 1: Directory Intermediary Disclaimer */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-[#F3B71B] font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-[#F3B71B]/20 flex items-center justify-center text-xs">1</span>
              <h3>Directory Intermediary Disclaimer</h3>
            </div>
            <p className="pl-8 text-neutral-300">
              STUDSPOT operates solely as an online directory, communication medium, and advertising venue connecting university students, hostel caretakers, and campus businesses. <strong className="text-white">STUDSPOT is not an auctioneer, retailer, broker, landlord, or employer.</strong> STUDSPOT is not a party to any transactions, agreements, sales contracts, residential tenancy leases, or freelance gig arrangements formed between platform users. Users conduct trades, inspections, and negotiations at their sole discretion.
            </p>
          </section>

          {/* Clause 2: Limitation of Liability Waiver */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-[#F3B71B] font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-[#F3B71B]/20 flex items-center justify-center text-xs">2</span>
              <h3>Limitation of Liability Waiver</h3>
            </div>
            <p className="pl-8 text-neutral-300">
              To the fullest extent permitted under the laws of Kenya, STUDSPOT, its operators, directors, and affiliates <strong className="text-white">assume zero legal or financial liability</strong> for:
            </p>
            <ul className="pl-12 list-disc space-y-1 text-neutral-400">
              <li>Defective, malfunctioning, or counterfeit goods traded between users.</li>
              <li>Fraudulent listings, inaccurate hostel descriptions, or misrepresentation by third parties.</li>
              <li>Hostel deposit disputes, tenancy disagreements, eviction issues, or landlord misconduct.</li>
              <li>Lost funds, unauthorized M-Pesa reversals, or uncompleted gig payments.</li>
              <li>Physical injury, theft, or damages arising during in-person campus meetups.</li>
            </ul>
            <p className="pl-8 text-neutral-400 text-xs">
              Comrades are strictly advised to inspect items at designated daylight campus safe spots (such as University Library gates or Student Centers) prior to completing payment.
            </p>
          </section>

          {/* Clause 3: Prohibited Content & Listings */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">3</span>
              <h3>Strictly Prohibited Content & Conduct</h3>
            </div>
            <p className="pl-8 text-neutral-300">
              STUDSPOT enforces a zero-tolerance policy against unlawful and harmful listings. The following are strictly prohibited:
            </p>
            <ul className="pl-12 list-disc space-y-1 text-neutral-400">
              <li>Stolen goods, unverified electronic devices, or pirated copyright materials.</li>
              <li>Academic fraud services, including contract cheating, unauthorized exam paper dissemination, or impersonation.</li>
              <li>Fake housing or hostel listings with fabricated pricing or non-existent units.</li>
              <li>Controlled substances, illicit items, weapons, or counterfeit medications.</li>
            </ul>
            <p className="pl-8 text-rose-300 text-xs font-semibold">
              Any listing violating these standards will be immediately removed, the offending account banned, and listing fees forfeited without refund.
            </p>
          </section>

          {/* Clause 4: Non-Refundable KSh 80 Monthly Listing Fee */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 text-[#F3B71B] font-bold text-sm">
              <span className="w-6 h-6 rounded-lg bg-[#F3B71B]/20 flex items-center justify-center text-xs">4</span>
              <h3>Non-Refundable KSh 80 / Month Advertising Fee</h3>
            </div>
            <p className="pl-8 text-neutral-300">
              To maintain listing quality and campus safety verification, STUDSPOT charges a flat listing fee of <strong className="text-white">KSh 80 per listing for 30 consecutive calendar days</strong> of active advertising space on the platform.
            </p>
            <p className="pl-8 text-neutral-400">
              This KSh 80 fee is strictly non-refundable once administrative review begins, regardless of whether the user sells the item ahead of schedule, changes their mind, or has their listing deleted due to prohibited content violations. All listings undergo administrative approval (<code className="text-[#F3B71B]">isApproved == True</code>) before publication.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="text-[11px] text-neutral-400">
            Last Updated: 2026 Academic Year
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-colors"
            >
              Close
            </button>
            {showAcceptButton && onAccept && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>I Understand & Accept</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
