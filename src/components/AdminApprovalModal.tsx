import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  CheckCircle2, 
  XCircle, 
  Database, 
  Users, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Eye,
  Trash2,
  Sparkles,
  Store,
  GraduationCap,
  FileText,
  ScanLine,
  Check,
  Building2,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { Listing, User, StudentVerification, Vendor } from '../types';
import { 
  getStudentVerifications, 
  approveStudentVerification, 
  rejectStudentVerification,
  getVendors,
  approveVendor,
  rejectVendor
} from '../utils/verificationStore';

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  users: User[];
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string) => void;
  onMarkFeePaid: (id: string, mpesaRef: string) => void;
  onOpenListingDetail: (listing: Listing) => void;
  onUserUpdated?: () => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  onClose,
  listings,
  users,
  onApproveListing,
  onRejectListing,
  onMarkFeePaid,
  onOpenListingDetail,
  onUserUpdated,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'pending' | 'students' | 'vendors' | 'active' | 'users' | 'schema'>('pending');

  // Student & Vendor Queues
  const [studentVerifications, setStudentVerifications] = useState<StudentVerification[]>(() => getStudentVerifications());
  const [vendors, setVendors] = useState<Vendor[]>(() => getVendors());
  const [inspectedDoc, setInspectedDoc] = useState<{ url: string; title: string; subtitle?: string } | null>(null);

  const pendingListings = listings.filter(l => !l.isApproved);
  const activeListings = listings.filter(l => l.isApproved);
  
  const pendingStudents = studentVerifications.filter(s => s.status === 'manual_review' || s.status === 'pending');
  const pendingVendors = vendors.filter(v => v.status === 'review');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  const handleApproveStudent = (id: string) => {
    const updated = approveStudentVerification(id, 'Approved by Campus Registrar in Admin Console.');
    if (updated) {
      setStudentVerifications(getStudentVerifications());
      onUserUpdated?.();
    }
  };

  const handleRejectStudent = (id: string) => {
    const reason = window.prompt('Enter rejection reason for this student ID submission:', 'Document photo was blurry or reg number did not match');
    if (reason !== null) {
      rejectStudentVerification(id, reason);
      setStudentVerifications(getStudentVerifications());
      onUserUpdated?.();
    }
  };

  const handleApproveVendor = (id: string) => {
    const updated = approveVendor(id);
    if (updated) {
      setVendors(getVendors());
    }
  };

  const handleRejectVendor = (id: string) => {
    const reason = window.prompt('Enter rejection reason for this vendor:', 'National ID could not be authenticated or location invalid');
    if (reason !== null) {
      rejectVendor(id, reason);
      setVendors(getVendors());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden p-0.5 bg-neutral-950 border border-[#F3B71B]/50 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/studspot-gold-icon.png"
                alt="STUDSPOT Official Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-heading">
                  STUDSPOT Adalo Database & Admin Console
                </h2>
                <span className="text-[10px] bg-[#F3B71B]/20 text-[#F3B71B] font-mono px-2 py-0.5 rounded font-bold">
                  Management Queue
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Manage listings, Student ID verification queues & isolated campus Vendor accounts
              </p>
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

        {/* Console Nav Tabs */}
        <div className="px-5 pt-3 border-b border-neutral-800 bg-[#171717] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* TAB 1: Pending Listings */}
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'pending'
                ? 'border-[#F3B71B] text-[#F3B71B] bg-[#242424]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Listing Approvals</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              pendingListings.length > 0 ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-700 text-neutral-300'
            }`}>
              {pendingListings.length}
            </span>
          </button>

          {/* TAB 2: Student Verifications */}
          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'students'
                ? 'border-emerald-400 text-emerald-400 bg-[#242424]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student ID Queue</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              pendingStudents.length > 0 ? 'bg-emerald-500 text-black font-bold' : 'bg-neutral-700 text-neutral-300'
            }`}>
              {pendingStudents.length}
            </span>
          </button>

          {/* TAB 3: Vendor Queue */}
          <button
            type="button"
            onClick={() => setActiveTab('vendors')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vendors'
                ? 'border-[#F3B71B] text-[#F3B71B] bg-[#242424]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-[#F3B71B]" />
            <span>Vendor Queue (Vendors DB)</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              pendingVendors.length > 0 ? 'bg-[#F3B71B] text-black font-bold' : 'bg-neutral-700 text-neutral-300'
            }`}>
              {pendingVendors.length}
            </span>
          </button>

          {/* TAB 4: Public Feed */}
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'active'
                ? 'border-[#F3B71B] text-[#F3B71B] bg-[#242424]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Live Feed ({activeListings.length})</span>
          </button>

          {/* TAB 5: Users */}
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-[#F3B71B] text-[#F3B71B] bg-[#242424]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users ({users.length})</span>
          </button>

          {/* TAB 6: Schema */}
          <button
            type="button"
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-[#F3B71B] text-[#F3B71B] bg-[#242424]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Adalo Schema</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* TAB 1: LISTING APPROVALS */}
          {activeTab === 'pending' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Workflow Step: Admin Manual Approval in Database</span>
                  <p className="text-[11px] text-amber-300 mt-0.5">
                    Per the technical specification, all submitted listings default to <code className="bg-black/40 px-1 py-0.5 rounded text-[#F3B71B]">isApproved == False</code> and are hidden from the public feed until the administrator verifies the non-refundable KSh 80 M-Pesa fee and clicks <strong>Approve</strong>.
                  </p>
                </div>
              </div>

              {pendingListings.length === 0 ? (
                <div className="p-8 text-center bg-[#242424] rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-bold text-white">All caught up! Zero pending listing approvals.</p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Try posting a new Marketplace item, Hostel, or Job from the app to test the pending redirect and approval flow.
                  </p>
                </div>
              ) : (
                pendingListings.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#242424] rounded-2xl border border-neutral-700/80 space-y-3 hover:border-neutral-600 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 bg-neutral-800"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3B71B] bg-[#F3B71B]/10 px-2 py-0.2 rounded">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              ID: {item.id}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1 truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-neutral-400">
                            Seller: <span className="text-neutral-200">{item.seller.name}</span> · {item.campusName}
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                        <span className="text-base font-black text-emerald-400 font-mono">
                          KES {formatPrice(item.price)}
                          {item.priceLabel && <span className="text-xs font-normal text-neutral-400">{item.priceLabel}</span>}
                        </span>
                        
                        <div className="flex items-center gap-1.5 mt-1">
                          {item.isFeePaid ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Fee Paid (KES {item.listingFeeKsh})
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 flex items-center gap-1">
                              <CreditCard className="w-3 h-3" /> KES {item.listingFeeKsh} Unpaid
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-700/50">
                      <button
                        type="button"
                        onClick={() => onOpenListingDetail(item)}
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Listing</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onRejectListing(item.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => onApproveListing(item.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                          <span>Approve & Publish to Feed</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: STUDENT ID VERIFICATION QUEUE */}
          {activeTab === 'students' && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Student Identity & Official Admission Letter Verification Queue</span>
                  <p className="text-[11px] text-emerald-300 mt-0.5">
                    Submissions flagged for Manual Review (due to non-standard registrar stamps or OCR mismatch) require admin verification before the green Comrade Trust Badge is activated.
                  </p>
                </div>
              </div>

              {studentVerifications.length === 0 ? (
                <div className="p-8 text-center bg-[#242424] rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-bold text-white">No student verification requests in queue.</p>
                </div>
              ) : (
                studentVerifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#242424] rounded-2xl border border-neutral-700/80 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Document preview clickable */}
                        <div 
                          onClick={() => setInspectedDoc({ url: item.documentUrl, title: `${item.fullName} - Student ID`, subtitle: item.studentRegNo })}
                          className="relative w-16 h-16 rounded-xl overflow-hidden bg-black border border-neutral-700 shrink-0 cursor-pointer group"
                          title="Click to zoom ID document"
                        >
                          <img src={item.documentUrl} alt="ID Document" className="w-full h-full object-cover group-hover:scale-110 transition" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white truncate">
                              {item.fullName}
                            </h3>
                            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.2 rounded border border-emerald-500/30">
                              {item.studentRegNo}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-300 mt-0.5">
                            {item.course} · <span className="text-neutral-400">{item.faculty}</span>
                          </p>
                          <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-[#F3B71B]" />
                            {item.campusName}
                          </p>
                        </div>
                      </div>

                      {/* Status & OCR score */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                        {item.status === 'verified' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified Comrade
                          </span>
                        ) : item.status === 'manual_review' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Manual Review Flagged
                          </span>
                        ) : item.status === 'pending' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                            <ScanLine className="w-3 h-3" /> In Review
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">
                            Rejected
                          </span>
                        )}

                        {item.ocrConfidence && (
                          <span className="text-[10px] font-mono text-neutral-400 mt-1">
                            OCR Score: {(item.ocrConfidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* OCR Text Extraction Log */}
                    {item.ocrMatchDetails?.extractedText && (
                      <div className="p-2.5 bg-neutral-900 rounded-xl border border-neutral-800 text-[10px] font-mono text-neutral-400 whitespace-pre-line leading-relaxed">
                        <span className="text-neutral-500 block font-bold mb-0.5">OCR Optical Reader Output:</span>
                        {item.ocrMatchDetails.extractedText}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-700/50">
                      <span className="text-[10px] text-neutral-400">
                        Doc: <strong className="text-neutral-300">{item.documentName}</strong> ({item.fileSizeMb}MB)
                      </span>

                      <div className="flex items-center gap-2">
                        {item.status !== 'verified' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRejectStudent(item.id)}
                              className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveStudent(item.id)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                              <span>Approve & Verify Student</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: ISOLATED VENDOR QUEUE */}
          {activeTab === 'vendors' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#F3B71B]/10 rounded-2xl border border-[#F3B71B]/30 flex items-start gap-2.5 text-xs text-amber-200">
                <Store className="w-4 h-4 text-[#F3B71B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Dedicated Vendors Database Collection (Isolated Schema)</span>
                  <p className="text-[11px] text-amber-300 mt-0.5">
                    Vendors are restricted from uploading products or services until their profile state shifts from <code className="bg-black/40 px-1 py-0.5 rounded text-[#F3B71B]">status: "review"</code> to <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-400">status: "verified"</code>.
                  </p>
                </div>
              </div>

              {vendors.length === 0 ? (
                <div className="p-8 text-center bg-[#242424] rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
                  <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-bold text-white">No registered vendors in database.</p>
                </div>
              ) : (
                vendors.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#242424] rounded-2xl border border-neutral-700/80 space-y-3 hover:border-neutral-600 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* National ID Clickable */}
                        <div 
                          onClick={() => setInspectedDoc({ url: item.nationalIdDocUrl || '', title: `${item.legalBusinessName} - National ID / Permit`, subtitle: `Contact: ${item.contactPersonName}` })}
                          className="relative w-14 h-14 rounded-xl overflow-hidden bg-black border border-neutral-700 shrink-0 cursor-pointer group"
                          title="Click to view National ID / Business Permit"
                        >
                          <img src={item.nationalIdDocUrl} alt="National ID" className="w-full h-full object-cover group-hover:scale-110 transition" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F3B71B] bg-[#F3B71B]/10 px-2 py-0.2 rounded">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              ID: {item.id}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white mt-1 truncate">
                            {item.legalBusinessName}
                          </h3>

                          <p className="text-xs text-neutral-300 mt-0.5 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#F3B71B] shrink-0" />
                            <span>{item.locationDescription}</span>
                          </p>

                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            Campus: <strong className="text-neutral-200">{item.nearestCampusName}</strong> · Contact: {item.contactPersonName}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                        {item.status === 'verified' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified (Uploads Unlocked)
                          </span>
                        ) : item.status === 'review' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> In Review (Uploads Locked)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400">
                            Rejected
                          </span>
                        )}

                        <span className="text-xs font-mono text-emerald-400 mt-1">
                          {item.phone}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-700/50">
                      <span className="text-[10px] text-neutral-400">
                        Doc: <strong className="text-neutral-300">{item.nationalIdDocName || 'NationalID.pdf'}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        {item.status !== 'verified' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRejectVendor(item.id)}
                              className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveVendor(item.id)}
                              className="px-4 py-1.5 rounded-xl bg-[#F3B71B] hover:bg-[#dca415] text-black text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                              <span>Verify Vendor (Unlock Uploads)</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                            <Check className="w-3.5 h-3.5" /> Approved on {item.verifiedAt?.split('T')[0] || item.createdAt}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: ACTIVE LISTINGS (isApproved: true) */}
          {activeTab === 'active' && (
            <div className="space-y-3">
              <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
                <span>Public Feed Directory ({activeListings.length} Approved Items)</span>
                <span className="text-[10px] text-emerald-400 font-mono">isApproved: true</span>
              </div>

              {activeListings.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.image} alt={item.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">{item.title}</p>
                      <p className="text-[11px] text-neutral-400">{item.seller.name} · {item.campusName}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 shrink-0">
                    KES {formatPrice(item.price)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: USERS COLLECTION */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 text-xs text-neutral-400 flex items-center justify-between">
                <span>Adalo Users Collection ({users.length} Records)</span>
                <span className="text-[10px] text-[#F3B71B] font-mono">Role-based Access</span>
              </div>

              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 bg-[#242424] rounded-2xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{u.fullName}</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded font-mono font-bold ${
                        u.role === 'admin' 
                          ? 'bg-rose-500/20 text-rose-400' 
                          : u.role === 'vendor'
                            ? 'bg-[#F3B71B]/20 text-[#F3B71B]'
                            : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                      {u.isVerifiedStudent && (
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {u.email} · {u.phone} · {u.campusName}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Joined: {u.createdAt}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: ADALO COLLECTIONS SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-2">
                <span className="font-bold text-white text-sm block">Isolated Database Architecture</span>
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Per requirements, Campus Vendors are isolated in their own <code className="text-[#F3B71B] font-mono">vendors</code> database collection separate from the student user schema. Student verifications are queued and tracked with OCR optical readings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1.5">
                  <span className="font-bold text-emerald-400 font-mono text-xs block">Collection: Users (Students)</span>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
                    <li>• id (Text)</li>
                    <li>• fullName (Text)</li>
                    <li>• studentRegNo (Text)</li>
                    <li>• faculty &amp; course (Text)</li>
                    <li>• universityId (Relationship)</li>
                    <li className="text-emerald-400 font-bold">• isVerifiedStudent (Boolean)</li>
                    <li>• verificationStatus ('verified' | 'manual_review')</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1.5">
                  <span className="font-bold text-[#F3B71B] font-mono text-xs block">Collection: Vendors (Isolated)</span>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
                    <li>• id (Text)</li>
                    <li>• legalBusinessName (Text)</li>
                    <li>• category (VendorCategory)</li>
                    <li>• nearestCampusId (Relationship)</li>
                    <li>• nationalIdDocUrl (Storage File)</li>
                    <li className="text-[#F3B71B] font-bold">• status ('review' | 'verified')</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1.5">
                  <span className="font-bold text-sky-400 font-mono text-xs block">Collection: Listings (Marketplace)</span>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
                    <li>• title, price, category</li>
                    <li>• isApproved (Boolean, Default: False)</li>
                    <li>• isFeePaid (Boolean, KSh 80)</li>
                    <li>• mpesaRef (Text)</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1.5">
                  <span className="font-bold text-purple-400 font-mono text-xs block">Collection: StudentVerifications</span>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
                    <li>• studentRegNo, faculty, course</li>
                    <li>• documentUrl (Firebase/S3)</li>
                    <li>• ocrConfidence (Float 0-1)</li>
                    <li>• status ('pending' | 'manual_review' | 'verified')</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="text-[11px] text-neutral-400">
            Adalo Engine: Real-time verification queues and database state synced
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close Admin Console
          </button>
        </div>
      </div>

      {/* Image Inspection Zoom Modal */}
      {inspectedDoc && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setInspectedDoc(null)}
        >
          <div 
            className="relative max-w-2xl w-full bg-[#1A1A1A] border border-neutral-700 rounded-3xl overflow-hidden p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-white">{inspectedDoc.title}</h3>
                {inspectedDoc.subtitle && (
                  <p className="text-xs text-neutral-400 font-mono">{inspectedDoc.subtitle}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setInspectedDoc(null)}
                className="p-1 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-[70vh] overflow-auto rounded-2xl bg-black flex items-center justify-center p-2">
              <img src={inspectedDoc.url} alt="Inspected Document" className="max-h-[65vh] w-auto object-contain rounded-xl" />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setInspectedDoc(null)}
                className="px-4 py-2 bg-[#F3B71B] text-black font-extrabold text-xs rounded-xl"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
