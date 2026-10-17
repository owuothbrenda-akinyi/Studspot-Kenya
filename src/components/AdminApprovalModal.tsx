import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
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
  Sparkles
} from 'lucide-react';
import { Listing, User } from '../types';

interface AdminApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  users: User[];
  onApproveListing: (id: string) => void;
  onRejectListing: (id: string) => void;
  onMarkFeePaid: (id: string, mpesaRef: string) => void;
  onOpenListingDetail: (listing: Listing) => void;
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
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'users' | 'schema'>('pending');

  const pendingListings = listings.filter(l => !l.isApproved);
  const activeListings = listings.filter(l => l.isApproved);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE').format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-[#1A1A1A] text-slate-100 rounded-3xl shadow-2xl border border-neutral-800 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl overflow-hidden p-0.5 bg-neutral-950 border border-[#F3B71B]/50 shadow-sm flex items-center justify-center shrink-0">
              <img
                src="/src/assets/images/studspot_gold_icon_1792275165524.jpg"
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
                  Test Workflow
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Manage isApproved (Boolean) database properties, KSh 80 listing fees & user records
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
            <span>Pending Approvals</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              pendingListings.length > 0 ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-700 text-neutral-300'
            }`}>
              {pendingListings.length}
            </span>
          </button>

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
            <span>Public Feed (isApproved: True)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-300 font-mono">
              {activeListings.length}
            </span>
          </button>

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
            <span>Users Collection</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-700 text-neutral-300 font-mono">
              {users.length}
            </span>
          </button>

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
            <span>Adalo Collections Schema</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* TAB 1: PENDING APPROVALS */}
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
                  <p className="font-bold text-white">All caught up! Zero pending approvals.</p>
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
                          <h4 className="font-bold text-sm text-white mt-1 leading-snug line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            By {item.seller.name} · {item.campusName}
                          </p>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-sm font-black font-mono text-white">
                          KES {formatPrice(item.price)} {item.priceLabel}
                        </div>
                        <div className="text-[11px] font-mono mt-0.5">
                          {item.isFeePaid ? (
                            <span className="text-emerald-400 font-semibold flex items-center sm:justify-end gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Fee Paid ({item.mpesaRef || 'Ref Verified'})
                            </span>
                          ) : (
                            <span className="text-amber-400 font-semibold">Awaiting KSh 80 Payment</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Database status row & action buttons */}
                    <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400 text-[11px]">Database Status:</span>
                        <span className="font-mono text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          isApproved: False
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!item.isFeePaid && (
                          <button
                            type="button"
                            onClick={() => onMarkFeePaid(item.id, 'QK-MANUAL-VERIFY')}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-xl transition-colors font-medium"
                          >
                            Mark KSh 80 Paid
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onRejectListing(item.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs rounded-xl transition-colors border border-rose-500/30 flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onApproveListing(item.id)}
                          className="px-4 py-1.5 bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve & Activate Live</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE PUBLIC FEED */}
          {activeTab === 'active' && (
            <div className="space-y-2.5">
              <div className="text-xs text-neutral-400 flex items-center justify-between">
                <span>Listings currently visible on the Home Screen Feed (filtered where isApproved == True):</span>
                <span className="font-mono text-[#F3B71B] font-bold">{activeListings.length} Active Records</span>
              </div>

              {activeListings.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="font-bold text-white truncate text-xs">{item.title}</h5>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {item.category} · KES {formatPrice(item.price)} · By {item.seller.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold hidden sm:inline">
                      isApproved: True
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenListingDetail(item)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      title="View listing detail"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onRejectListing(item.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                      title="Deactivate listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: USERS COLLECTION */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="text-xs text-neutral-400">
                Adalo Users Collection with mandatory terms consent records:
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-[#141414] text-neutral-400 text-[10px] uppercase font-mono border-b border-neutral-800">
                    <tr>
                      <th className="p-2.5">User</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Campus</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">Terms Consent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 font-mono">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-neutral-800/40">
                        <td className="p-2.5 font-sans font-bold text-white">{u.fullName}</td>
                        <td className="p-2.5 text-neutral-400">{u.email}</td>
                        <td className="p-2.5 text-neutral-300">{u.campusName}</td>
                        <td className="p-2.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-[#F3B71B]/20 text-[#F3B71B]' : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {u.agreedToTerms ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                              <CheckCircle className="w-3.5 h-3.5" /> True
                            </span>
                          ) : (
                            <span className="text-rose-400 font-bold">False</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ADALO COLLECTIONS SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-2">
                <h4 className="font-bold text-white text-sm">Adalo Database Architecture Map</h4>
                <p className="text-neutral-400 text-xs">
                  All 4 required listing collections configured with the mandatory <code className="text-[#F3B71B]">isApproved (Boolean, Default: False)</code> property:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1.5">
                  <span className="font-bold text-[#F3B71B] font-mono text-xs block">Collection: Users</span>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
                    <li>• id (Text)</li>
                    <li>• fullName (Text)</li>
                    <li>• email (Email)</li>
                    <li>• universityId (Text)</li>
                    <li>• agreedToTerms (Boolean, Mandatory)</li>
                    <li>• role (Text)</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1.5">
                  <span className="font-bold text-[#F3B71B] font-mono text-xs block">Collection: Listings (Marketplace)</span>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
                    <li>• title (Text)</li>
                    <li>• price (Number, KES)</li>
                    <li>• category (Text)</li>
                    <li>• sellerId (Relationship &gt; User)</li>
                    <li className="text-[#F3B71B] font-bold">• isApproved (Boolean, Default: False)</li>
                    <li>• isFeePaid (Boolean)</li>
                    <li>• mpesaRef (Text)</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1.5">
                  <span className="font-bold text-[#F3B71B] font-mono text-xs block">Collection: Housing (Hostels)</span>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
                    <li>• title (Text)</li>
                    <li>• monthlyRent (Number)</li>
                    <li>• hostelType (Text)</li>
                    <li>• distanceToGate (Text)</li>
                    <li className="text-[#F3B71B] font-bold">• isApproved (Boolean, Default: False)</li>
                    <li>• isFeePaid (Boolean)</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#242424] rounded-2xl border border-neutral-800 space-y-1.5">
                  <span className="font-bold text-[#F3B71B] font-mono text-xs block">Collection: Jobs (Gigs)</span>
                  <ul className="text-[11px] text-neutral-400 space-y-0.5 font-mono">
                    <li>• title (Text)</li>
                    <li>• compensation (Number)</li>
                    <li>• skillsNeeded (List)</li>
                    <li className="text-[#F3B71B] font-bold">• isApproved (Boolean, Default: False)</li>
                    <li>• isFeePaid (Boolean)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#141414] flex items-center justify-between">
          <div className="text-[11px] text-neutral-400">
            Adalo Engine Status: All collections synced with real-time UI
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
    </div>
  );
};
