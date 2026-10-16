/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Home, 
  Briefcase, 
  Store, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpDown,
  CheckCircle2,
  Users,
  Smartphone,
  Database,
  FileText,
  AlertTriangle,
  CreditCard,
  PlusCircle,
  HelpCircle,
  Share2,
  History
} from 'lucide-react';

import { Listing, CommunityPost, User, ListingType, InstitutionType } from './types';
import { INITIAL_LISTINGS, INITIAL_COMMUNITY_POSTS, INITIAL_USERS, UNIVERSITIES } from './data/seedData';
import { getAllCampuses } from './utils/campusStore';
import { MobileHeader } from './components/MobileHeader';
import { BottomNavBar, CategoryFilterPills, NavTabType } from './components/NavigationTabs';
import { CampusCategoryFilterBar } from './components/CampusCategoryFilterBar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PostListingModal } from './components/PostListingModal';
import { SignUpModal } from './components/SignUpModal';
import { TermsOfServiceModal } from './components/TermsOfServiceModal';
import { PaymentInstructionScreen } from './components/PaymentInstructionScreen';
import { AdminApprovalModal } from './components/AdminApprovalModal';
import { OnboardingScreen } from './components/OnboardingScreen';
import { MpesaModal } from './components/MpesaModal';
import { InAppChatModal } from './components/InAppChatModal';
import { SavedModal } from './components/SavedModal';
import { CampusBuzzFeed } from './components/CampusBuzzFeed';
import { ShareModal, ShareTarget } from './components/ShareModal';
import { TransactionHistoryModal } from './components/TransactionHistoryModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // 1. Database Collections State (Adalo Data Architecture)
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem('studspot_users');
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('studspot_current_user');
      return stored ? JSON.parse(stored) : INITIAL_USERS[0]; // Brian Mwangi
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    try {
      const stored = localStorage.getItem('studspot_listings');
      return stored ? JSON.parse(stored) : INITIAL_LISTINGS;
    } catch {
      return INITIAL_LISTINGS;
    }
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const stored = localStorage.getItem('studspot_buzz');
      return stored ? JSON.parse(stored) : INITIAL_COMMUNITY_POSTS;
    } catch {
      return INITIAL_COMMUNITY_POSTS;
    }
  });

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('studspot_saved');
      return stored ? JSON.parse(stored) : ['item-1', 'hostel-1'];
    } catch {
      return ['item-1', 'hostel-1'];
    }
  });

  // 2. Navigation & Filter State
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedCampusCategory, setSelectedCampusCategory] = useState<InstitutionType>('all');
  const [activeTab, setActiveTab] = useState<NavTabType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [isMobileDeviceView, setIsMobileDeviceView] = useState<boolean>(false);

  // 3. Screens & Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [paymentListing, setPaymentListing] = useState<Listing | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mpesaListing, setMpesaListing] = useState<Listing | null>(null);
  const [chatListing, setChatListing] = useState<Listing | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [shareTarget, setShareTarget] = useState<ShareTarget | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState<boolean>(false);

  const handleToggleSold = (listingId: string) => {
    const nowFormatted = new Date().toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' });
    setListings(prev =>
      prev.map(item => {
        if (item.id === listingId) {
          const willBeSold = !item.isSold;
          return {
            ...item,
            isSold: willBeSold,
            soldAt: willBeSold ? nowFormatted : undefined,
            soldPrice: willBeSold ? item.price : undefined,
          };
        }
        return item;
      })
    );

    setSelectedListing(prev => {
      if (prev && prev.id === listingId) {
        const willBeSold = !prev.isSold;
        return {
          ...prev,
          isSold: willBeSold,
          soldAt: willBeSold ? nowFormatted : undefined,
          soldPrice: willBeSold ? prev.price : undefined,
        };
      }
      return prev;
    });
  };

  const handleOpenShareApp = () => {
    setShareTarget({
      type: 'app',
      title: 'STUDSPOT - Campus Marketplace & Student Directory',
      text: 'Hey comrade! Check out STUDSPOT, Kenya’s verified peer-to-peer campus marketplace for finding bedsitters, textbooks, laptops, and student gigs!',
      url: window.location.href,
    });
    setIsShareModalOpen(true);
  };

  const handleOpenShareListing = (listing: Listing) => {
    setShareTarget({
      type: 'listing',
      title: `${listing.title} - KES ${listing.price.toLocaleString()} on STUDSPOT`,
      text: `Habari comrades! Check out "${listing.title}" for KES ${listing.price.toLocaleString()} at ${listing.campusName} on STUDSPOT.`,
      url: `${window.location.origin}/?listing=${listing.id}`,
      listing,
    });
    setIsShareModalOpen(true);
  };

  // LocalStorage Sync
  useEffect(() => {
    try {
      localStorage.setItem('studspot_users', JSON.stringify(users));
    } catch (e) {
      console.warn(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('studspot_current_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn(e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('studspot_listings', JSON.stringify(listings));
    } catch (e) {
      console.warn(e);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('studspot_buzz', JSON.stringify(communityPosts));
    } catch (e) {
      console.warn(e);
    }
  }, [communityPosts]);

  useEffect(() => {
    try {
      localStorage.setItem('studspot_saved', JSON.stringify(savedIds));
    } catch (e) {
      console.warn(e);
    }
  }, [savedIds]);

  // Wishlist toggle
  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Workflow Action 1: User Registration with Mandatory Terms
  const handleUserRegistered = (newUser: User) => {
    setUsers(prev => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
    setCurrentUser(newUser);
  };

  // Workflow Action 2: Listing Creation -> Redirects to Payment Screen (KSh 80)
  const handleAddListing = (newListing: Listing) => {
    // Save to database collection with isApproved: false
    setListings(prev => [newListing, ...prev]);
    setIsPostModalOpen(false);
    
    // Redirect immediately to Pending Payment / Instruction Screen!
    setPaymentListing(newListing);
  };

  // Workflow Action 3: Payment Reference Submitted
  const handleSubmitMpesaRef = (listingId: string, ref: string) => {
    setListings(prev => prev.map(item => {
      if (item.id === listingId) {
        return {
          ...item,
          isFeePaid: true,
          mpesaRef: ref
        };
      }
      return item;
    }));
  };

  // Workflow Action 4: Admin Manual Approval in Database (isApproved = True)
  const handleApproveListing = (id: string) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isApproved: true,
          isFeePaid: true
        };
      }
      return item;
    }));
  };

  const handleRejectListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
  };

  const handleMarkFeePaid = (id: string, ref: string) => {
    setListings(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isFeePaid: true,
          mpesaRef: ref
        };
      }
      return item;
    }));
  };

  const handleAddCommunityPost = (newPost: CommunityPost) => {
    setCommunityPosts(prev => [newPost, ...prev]);
    setActiveTab('buzz');
  };

  // STRICT ADALO FEED FILTER: Filtered strictly where isApproved == True!
  const publicFeedListings = useMemo(() => {
    return listings.filter(item => {
      // MANDATORY ADALO SPEC: Feed filtered strictly where isApproved == True!
      if (!item.isApproved) return false;

      // Tab / Collection type filter
      if (activeTab !== 'all' && activeTab !== 'buzz' && item.type !== activeTab) {
        return false;
      }

      // Campus Category filter (Universities, KMTC Colleges, National Polytechnics, TVETs)
      if (selectedCampusCategory !== 'all') {
        const itemInstType = item.institutionType || 
          UNIVERSITIES.find(u => u.id === item.universityId)?.institutionType;
        if (itemInstType !== selectedCampusCategory && item.universityId !== 'all') {
          return false;
        }
      }

      // Target University filter
      if (selectedUniversity !== 'all' && item.universityId !== 'all') {
        const allCampuses = getAllCampuses();
        const uniObj = allCampuses.find(u => u.id === selectedUniversity);
        const matchExact = item.universityId === selectedUniversity;
        const matchName = !!(uniObj && (
          item.campusName.toLowerCase().includes(uniObj.name.toLowerCase()) ||
          item.campusName.toLowerCase().includes(uniObj.shortName.toLowerCase()) ||
          (uniObj.name.toLowerCase().includes('kisii') && item.campusName.toLowerCase().includes('kisii')) ||
          (uniObj.name.toLowerCase().includes('ksii') && item.campusName.toLowerCase().includes('ksii'))
        ));
        if (!matchExact && !matchName) {
          return false;
        }
      }

      // Subcategory quick keyword filter
      if (selectedSubcategory !== 'all') {
        const itemCat = item.category.toLowerCase();
        const sub = selectedSubcategory.toLowerCase();
        if (!itemCat.includes(sub)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesCampus = item.campusName.toLowerCase().includes(query);
        const matchesSeller = item.seller.name.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesCat || matchesCampus || matchesSeller;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return a.price - b.price;
      if (sortOption === 'price_desc') return b.price - a.price;
      return 0;
    });
  }, [listings, activeTab, selectedCampusCategory, selectedUniversity, selectedSubcategory, searchQuery, sortOption]);

  const pendingListingsCount = useMemo(() => {
    return listings.filter(l => !l.isApproved).length;
  }, [listings]);

  // Counts for Campus Categories (Universities, KMTC Colleges, National Polys, TVETs)
  const campusCategoryCounts = useMemo(() => {
    const approved = listings.filter(l => l.isApproved);
    const getInstType = (l: Listing): InstitutionType => {
      if (l.institutionType) return l.institutionType;
      const u = UNIVERSITIES.find(uni => uni.id === l.universityId);
      return u?.institutionType || 'university';
    };

    return {
      all: approved.length,
      university: approved.filter(l => getInstType(l) === 'university').length,
      kmtc: approved.filter(l => getInstType(l) === 'kmtc').length,
      polytechnic: approved.filter(l => getInstType(l) === 'polytechnic').length,
      tvet: approved.filter(l => getInstType(l) === 'tvet').length,
    };
  }, [listings]);

  // Counts for pills (only approved items shown in category counts)
  const approvedCounts = useMemo(() => {
    const approved = listings.filter(l => l.isApproved);
    return {
      all: approved.length,
      item: approved.filter(l => l.type === 'item').length,
      hostel: approved.filter(l => l.type === 'hostel').length,
      gig: approved.filter(l => l.type === 'gig').length,
      business: approved.filter(l => l.type === 'business').length,
      buzz: communityPosts.length,
    };
  }, [listings, communityPosts]);

  const savedListingsObjects = useMemo(() => {
    return listings.filter(l => savedIds.includes(l.id));
  }, [listings, savedIds]);

  const currentUniName = useMemo(() => {
    const all = getAllCampuses();
    return all.find(u => u.id === selectedUniversity)?.name || 'All Campuses';
  }, [selectedUniversity]);

  // Main UI Canvas
  const mainContent = (
    <div className="min-h-screen bg-[#121212] text-slate-100 flex flex-col pb-24">
      {/* Test Cycle Quick Action Strip (Top Banner) */}
      <div className="bg-[#1C1C1C] border-b border-neutral-800 px-4 py-1.5 text-xs text-neutral-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F3B71B] shrink-0" />
            <span className="font-bold text-white">STUDSPOT End-to-End Workflow:</span>
            <span className="text-[11px] text-neutral-400 hidden sm:inline">
              1. Register with Terms &gt; 2. Post Listing &gt; 3. M-Pesa KSh 80 Instructions &gt; 4. Admin Database Approval &gt; 5. Public Feed Live
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAdminConsoleOpen(true)}
              className="text-[#F3B71B] hover:underline font-bold text-[11px] flex items-center gap-1"
            >
              <Database className="w-3 h-3" />
              <span>Admin Database Console ({pendingListingsCount} Pending)</span>
            </button>
            <span className="text-neutral-600">|</span>
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="text-neutral-400 hover:text-white text-[11px]"
            >
              Legal Terms
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Top Header */}
      <MobileHeader
        selectedUniversity={selectedUniversity}
        onSelectUniversity={setSelectedUniversity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        currentUser={currentUser}
        onOpenSignUp={() => setIsSignUpOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        pendingCount={pendingListingsCount}
        isMobileDeviceView={isMobileDeviceView}
        onToggleDeviceView={() => setIsMobileDeviceView(!isMobileDeviceView)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenShareApp={handleOpenShareApp}
        onOpenTransactionHistory={() => setIsTransactionHistoryOpen(true)}
        soldCount={listings.filter(l => l.isSold).length}
      />

      <main className="max-w-7xl mx-auto px-4 w-full flex-1 pt-3 space-y-4">
        {/* Campus Hero Card with STUDSPOT Gold Accent & Dark Contrast */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#242424] via-[#1A1A1A] to-[#121212] border border-neutral-800 text-white p-5 sm:p-7 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-xl space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-black bg-[#F3B71B] px-2.5 py-0.5 rounded font-mono">
                  {currentUniName}
                </span>
                <span className="text-xs text-neutral-400">· Peer-to-Peer Campus Directory</span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-br from-[#0F2D59] via-[#08182F] to-black border-2 border-cyan-400/50 shadow-xl shadow-cyan-950/60 shrink-0 hidden sm:flex items-center justify-center">
                  <img
                    src="/src/assets/images/studspot_official_icon_1791805148976.jpg"
                    alt="STUDSPOT Official Logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight font-heading leading-tight text-white">
                    STUDSPOT Campus Marketplace
                  </h1>
                  <p className="text-[11px] text-[#F3B71B] font-mono font-bold">
                    Official Peer-to-Peer Directory · Kenya
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
                Verified peer-to-peer campus marketplace, hostel finder, student job gigs, and local directory for Kenyan Universities, KMTC Medical Colleges, National Polytechnics & TVETs.
              </p>

              {/* Quick Metrics & Fee Badge */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-300">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Admin Vetted (<code className="text-white">isApproved == True</code>)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#F3B71B] font-mono">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>KSh 80 / Month Advertising Fee</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-[#F3B71B]" />
                  <span>35+ Campuses, KMTCs, Polys & TVETs</span>
                </div>
              </div>

              {/* Install PWA and Share Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <PWAInstallButton />
                <button
                  type="button"
                  onClick={handleOpenShareApp}
                  className="px-3.5 py-1.5 rounded-xl bg-[#242424] hover:bg-[#2e2e2e] text-neutral-200 border border-neutral-700 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#F3B71B]" />
                  <span>Share with Comrades</span>
                </button>
              </div>
            </div>

            {/* Featured Campus Gate Preview: KISII UNIVERSITY */}
            <div className="hidden lg:block w-80 shrink-0">
              <div className="rounded-2xl overflow-hidden border border-neutral-700/80 shadow-2xl bg-[#181818] group">
                <div className="relative">
                  <img
                    src="/src/assets/images/kisii_university_campus_1791808842007.jpg"
                    alt="Kisii University Campus Gate"
                    className="w-full h-40 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-[#F3B71B] border border-[#F3B71B]/40">
                    FEATURED CAMPUS
                  </div>
                </div>
                <div className="p-3 bg-[#161616] border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">KISII UNIVERSITY</span>
                    <span className="text-[10px] text-neutral-400 font-mono">Training for Development · Kisii</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUniversity('kisii_uni')}
                    className="px-2.5 py-1 text-[11px] font-bold bg-[#F3B71B] text-black rounded-lg hover:bg-[#dca415] transition-colors"
                  >
                    {selectedUniversity === 'kisii_uni' ? 'Active' : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Background image subtle overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none hidden md:block">
            <img
              src="/src/assets/images/kisii_university_campus_1791808842007.jpg"
              alt="Kisii University Campus"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pending Approvals Notice Banner if items are awaiting approval */}
        {pendingListingsCount > 0 && (
          <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-neutral-200">
                <strong className="text-amber-300">{pendingListingsCount} listing(s)</strong> awaiting Admin approval and KSh 80 M-Pesa fee verification.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAdminConsoleOpen(true)}
              className="px-3 py-1 bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-[11px] rounded-lg transition-colors whitespace-nowrap"
            >
              Open Admin Console →
            </button>
          </div>
        )}

        {/* Campus Categories Filter Bar (Universities, KMTC Colleges, National Polys, TVET Institutes) */}
        <CampusCategoryFilterBar
          selectedCampusCategory={selectedCampusCategory}
          onSelectCampusCategory={setSelectedCampusCategory}
          selectedUniversity={selectedUniversity}
          onSelectUniversity={setSelectedUniversity}
          categoryCounts={campusCategoryCounts}
        />

        {/* Category Filter Pills (Marketplace, Housing, Jobs, Services, Buzz) */}
        <CategoryFilterPills
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSelectedSubcategory('all');
          }}
          counts={approvedCounts}
        />

        {/* Subcategory & Sort Bar (shown when not in Buzz view) */}
        {activeTab !== 'buzz' && (
          <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
            {/* Quick Keyword Shortcuts */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'medical', label: '🩺 KMTC Medical' },
                { id: 'engineering', label: '⚙️ Poly Workshop' },
                { id: 'textbook', label: '📖 Books & Past Papers' },
                { id: 'electronic', label: '💻 Laptops & Tech' },
                { id: 'bedsitter', label: '🏠 Bedsitters' },
                { id: 'thrift', label: '👟 Thrift Drip' },
                { id: 'appliance', label: '⚡ Kettles & Hotplates' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedSubcategory === sub.id
                      ? 'bg-[#F3B71B] text-black font-bold'
                      : 'bg-[#1E1E1E] border border-neutral-800 text-neutral-300 hover:bg-[#252525]'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Price Sorting Dropdown & History Shortcut */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <button
                type="button"
                onClick={() => setIsTransactionHistoryOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#202020] hover:bg-[#282828] text-neutral-300 border border-neutral-800 transition-colors"
                title="View your campus deals & sold transaction history"
              >
                <History className="w-3.5 h-3.5 text-[#F3B71B]" />
                <span className="hidden sm:inline">History</span>
                {listings.filter(l => l.isSold).length > 0 && (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                    {listings.filter(l => l.isSold).length} sold
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="bg-[#1E1E1E] border border-neutral-800 rounded-lg px-2 py-1 text-xs text-neutral-300 outline-none cursor-pointer"
                >
                  <option value="default">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content Display: Either Campus Buzz or Approved Public Feed */}
        {activeTab === 'buzz' ? (
          <CampusBuzzFeed
            posts={communityPosts}
            onAddPost={handleAddCommunityPost}
            selectedUniversity={selectedUniversity}
            isVerifiedStudent={currentUser?.isVerifiedStudent ?? true}
          />
        ) : (
          <div>
            {publicFeedListings.length === 0 ? (
              <div className="bg-[#1A1A1A] rounded-3xl border border-neutral-800 p-12 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No active approved listings found</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Only listings with <code className="text-[#F3B71B]">isApproved == True</code> appear in this public feed.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(true)}
                    className="px-4 py-2 bg-[#F3B71B] text-black text-xs font-bold rounded-xl hover:bg-[#dca415] transition-colors"
                  >
                    Post New Listing
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAdminConsoleOpen(true)}
                    className="px-4 py-2 bg-[#242424] text-neutral-300 text-xs font-bold rounded-xl hover:bg-neutral-700 transition-colors"
                  >
                    Check Pending Approvals ({pendingListingsCount})
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {publicFeedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    isSaved={savedIds.includes(listing.id)}
                    onToggleSave={toggleSave}
                    onOpenDetail={(item) => setSelectedListing(item)}
                    onOpenMpesaGuide={(item, e) => {
                      e.stopPropagation();
                      setMpesaListing(item);
                    }}
                    onShare={(item) => handleOpenShareListing(item)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Legal Safeguard & Terms Banner */}
        <section className="bg-[#1A1A1A] border border-neutral-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-1.5 text-[#F3B71B] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>STUDSPOT Legal Framework & Liability Protection</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-heading">
              Directory Intermediary Disclaimer
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              STUDSPOT acts solely as an advertising directory and is not a party to user transactions, leases, or job contracts. No stolen goods, illegal items, or academic fraud services. Flat KSh 80 fee covers 30 days advertising and is strictly non-refundable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl border border-neutral-700 transition-all flex items-center justify-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-[#F3B71B]" />
              <span>Read Full Legal Terms</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPostModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#F3B71B] hover:bg-[#dca415] text-black font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Listing (KSh 80)</span>
            </button>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Mobile App Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      {/* 4. MODALS & SCREENS IN WORKFLOW */}

      {/* Screen 1: Welcome / Onboarding Screen */}
      <OnboardingScreen
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onOpenSignUp={() => setIsSignUpOpen(true)}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Screen 2: Sign-Up Screen with Mandatory Terms Consent */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onUserRegistered={handleUserRegistered}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Screen 4: Listing Creation Screen */}
      <PostListingModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddListing={handleAddListing}
        currentUser={currentUser}
        onOpenTerms={() => setIsTermsOpen(true)}
      />

      {/* Screen 5: Pending Payment / Instruction Screen (M-Pesa KSh 80) */}
      <PaymentInstructionScreen
        listing={paymentListing}
        isOpen={!!paymentListing}
        onClose={() => setPaymentListing(null)}
        onSubmitMpesaRef={handleSubmitMpesaRef}
        onOpenAdminConsole={() => {
          setPaymentListing(null);
          setIsAdminConsoleOpen(true);
        }}
      />

      {/* Screen 6: Legal / Terms of Service Screen */}
      <TermsOfServiceModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Screen 7: Admin Approval & Adalo Database Console */}
      <AdminApprovalModal
        isOpen={isAdminConsoleOpen}
        onClose={() => setIsAdminConsoleOpen(false)}
        listings={listings}
        users={users}
        onApproveListing={handleApproveListing}
        onRejectListing={handleRejectListing}
        onMarkFeePaid={handleMarkFeePaid}
        onOpenListingDetail={(item) => setSelectedListing(item)}
      />

      {/* Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
        isSaved={selectedListing ? savedIds.includes(selectedListing.id) : false}
        onToggleSave={toggleSave}
        onOpenMpesaModal={(item) => {
          setSelectedListing(null);
          setMpesaListing(item);
        }}
        onOpenInAppChat={(item) => {
          setSelectedListing(null);
          setChatListing(item);
        }}
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenShareModal={(item) => handleOpenShareListing(item)}
        onToggleSold={handleToggleSold}
        onOpenTransactionHistory={() => setIsTransactionHistoryOpen(true)}
      />

      {/* M-Pesa Safe Transaction Helper */}
      <MpesaModal
        listing={mpesaListing}
        onClose={() => setMpesaListing(null)}
      />

      {/* In-App Direct Chat */}
      <InAppChatModal
        listing={chatListing}
        onClose={() => setChatListing(null)}
      />

      {/* Saved / Wishlist Modal */}
      <SavedModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedListings={savedListingsObjects}
        onRemoveSaved={toggleSave}
        onOpenDetail={(item) => setSelectedListing(item)}
      />

      {/* Transaction History & Sold Archival Modal */}
      <TransactionHistoryModal
        isOpen={isTransactionHistoryOpen}
        onClose={() => setIsTransactionHistoryOpen(false)}
        listings={listings}
        currentUser={currentUser}
        onToggleSold={handleToggleSold}
        onOpenDetail={(item) => setSelectedListing(item)}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      {/* Universal Share Modal (App & Listings) */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        target={shareTarget}
      />

      {/* PWA Offline Mode Indicator */}
      <OfflineIndicator />
    </div>
  );

  // Optional Phone Frame Preview on Desktop
  if (isMobileDeviceView) {
    return (
      <div className="min-h-screen bg-black py-8 px-4 flex flex-col items-center justify-center">
        {/* Device toggle toolbar */}
        <div className="mb-4 flex items-center justify-between w-full max-w-[420px] text-white text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#F3B71B]" />
            <span className="font-bold">STUDSPOT Mobile Screen</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileDeviceView(false)}
            className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white font-medium text-xs transition-colors"
          >
            Switch to Full Web View
          </button>
        </div>

        {/* Smartphone bezel frame */}
        <div className="w-full max-w-[420px] h-[860px] bg-[#121212] rounded-[52px] p-3 shadow-2xl border-4 border-neutral-700 relative overflow-hidden flex flex-col">
          {/* Dynamic Island Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-neutral-800 rounded-full mr-2" />
          </div>

          {/* Screen Content Container */}
          <div className="w-full h-full bg-[#121212] rounded-[44px] overflow-y-auto no-scrollbar relative pt-2">
            {mainContent}
          </div>
        </div>
      </div>
    );
  }

  return mainContent;
}
