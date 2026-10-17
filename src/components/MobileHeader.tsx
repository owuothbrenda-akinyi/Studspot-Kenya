import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  ChevronDown,
  Smartphone,
  Monitor,
  Database,
  FileText,
  User as UserIcon,
  Sparkles,
  PenTool,
  Plus,
  Check,
  Share2,
  Download,
  History,
  Clock,
  X
} from 'lucide-react';
import { University, User, InstitutionType } from '../types';
import { UNIVERSITIES } from '../data/seedData';
import { getAllCampuses, saveCustomCampus } from '../utils/campusStore';
import { PWAInstallButton } from './PWAInstallButton';

interface MobileHeaderProps {
  selectedUniversity: string;
  onSelectUniversity: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  currentUser: User | null;
  onOpenSignUp: () => void;
  onOpenTerms: () => void;
  onOpenAdminConsole: () => void;
  pendingCount: number;
  isMobileDeviceView: boolean;
  onToggleDeviceView: () => void;
  onOpenOnboarding: () => void;
  onOpenShareApp?: () => void;
  onOpenTransactionHistory?: () => void;
  soldCount?: number;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  selectedUniversity,
  onSelectUniversity,
  searchQuery,
  onSearchChange,
  savedCount,
  onOpenSaved,
  currentUser,
  onOpenSignUp,
  onOpenTerms,
  onOpenAdminConsole,
  pendingCount,
  isMobileDeviceView,
  onToggleDeviceView,
  onOpenOnboarding,
  onOpenShareApp,
  onOpenTransactionHistory,
  soldCount,
}) => {
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const [institutionFilter, setInstitutionFilter] = useState<'all' | 'university' | 'kmtc' | 'polytechnic' | 'tvet'>('all');
  const [uniSearchText, setUniSearchText] = useState('');
  const [isTypingCustom, setIsTypingCustom] = useState(false);
  const [customTypedName, setCustomTypedName] = useState('');
  const [customTypedCategory, setCustomTypedCategory] = useState<InstitutionType>('university');

  const [availableCampuses, setAvailableCampuses] = useState<University[]>(() => getAllCampuses());

  // Recent Searches state: tracks the last 3 unique searches performed by the student
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('studspot_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 3);
        }
      }
    } catch {
      // ignore
    }
    return ['Calculus 7th Edition', 'Bedsitter near Gate B', 'Gas cylinder 6kg'];
  });
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const saveSearchToRecent = (term: string) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 3);
      try {
        localStorage.setItem('studspot_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeRecentSearch = (e: React.MouseEvent, termToRemove: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== termToRemove);
      try {
        localStorage.setItem('studspot_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('studspot_recent_searches');
    } catch {
      // ignore
    }
  };

  React.useEffect(() => {
    const handleUpdate = () => {
      setAvailableCampuses(getAllCampuses());
    };
    window.addEventListener('studspot_campuses_updated', handleUpdate);
    return () => window.removeEventListener('studspot_campuses_updated', handleUpdate);
  }, []);

  const currentUni = availableCampuses.find(u => u.id === selectedUniversity) || UNIVERSITIES[0];

  const filteredUniversities = availableCampuses.filter((uni) => {
    if (institutionFilter !== 'all') {
      if (uni.id !== 'all' && uni.institutionType !== institutionFilter) {
        return false;
      }
    }
    if (uniSearchText.trim()) {
      const q = uniSearchText.toLowerCase();
      const matchName = uni.name.toLowerCase().includes(q);
      const matchShort = uni.shortName.toLowerCase().includes(q);
      const matchCity = uni.city.toLowerCase().includes(q);
      const matchCampus = uni.campuses.some(c => c.toLowerCase().includes(q));
      return matchName || matchShort || matchCity || matchCampus;
    }
    return true;
  });

  const handleApplyCustomCampus = (nameToUse: string, category: InstitutionType = 'university') => {
    if (!nameToUse.trim()) return;
    const createdUni = saveCustomCampus(nameToUse.trim(), category, 'Main Campus');
    setAvailableCampuses(getAllCampuses());
    onSelectUniversity(createdUni.id);
    setIsTypingCustom(false);
    setUniSearchText('');
    setCustomTypedName('');
    setShowUniDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#141414]/95 backdrop-blur-md border-b border-neutral-800 shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
      {/* Top row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand with Official STUDSPOT Logo */}
        <div 
          onClick={onOpenOnboarding}
          className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
          title="About STUDSPOT Campus Marketplace"
        >
          <div className="w-10 h-10 rounded-2xl overflow-hidden p-0.5 bg-neutral-950 border border-[#F3B71B]/50 shadow-md shadow-amber-950/30 group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
            <img
              src="/src/assets/images/studspot_gold_icon_1792275165524.jpg"
              alt="STUDSPOT Official Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-white font-heading">
                STUDSPOT
              </span>
              <span className="text-[9px] font-bold text-black bg-[#F3B71B] px-1.5 py-0.2 rounded font-mono">
                KENYA
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-medium hidden sm:block">
              Campus Marketplace & Community
            </p>
          </div>
        </div>

        {/* Center: University / KMTC / Poly / TVET Selector dropdown */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <button
            type="button"
            onClick={() => setShowUniDropdown(!showUniDropdown)}
            className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-[#242424] hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-700/80 text-left min-h-[38px]"
          >
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#F3B71B] shrink-0" />
              <span className="truncate">{currentUni.shortName}</span>
              {currentUni.categoryLabel && currentUni.id !== 'all' && (
                <span className="hidden sm:inline text-[9px] text-neutral-400 font-mono">
                  ({currentUni.categoryLabel})
                </span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          </button>

          {showUniDropdown && (
            <div className="absolute top-full mt-1.5 left-0 right-0 sm:w-80 sm:-left-6 bg-[#1A1A1A] rounded-2xl shadow-2xl border border-neutral-700 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden flex flex-col max-h-96">
              {/* Header & Instant Search inside dropdown */}
              <div className="p-2.5 bg-[#141414] border-b border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <span>Select Campus / College</span>
                  <span className="text-[#F3B71B] font-mono">{filteredUniversities.length} Campuses</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={uniSearchText}
                    onChange={(e) => setUniSearchText(e.target.value)}
                    placeholder="Search KMTC, Kabete, Nairobi Tech, Moi, Coast..."
                    className="w-full pl-8 pr-7 py-1.5 bg-[#242424] text-white text-xs rounded-lg border border-neutral-700 focus:border-[#F3B71B] outline-none placeholder:text-neutral-500"
                  />
                  {uniSearchText && (
                    <button
                      type="button"
                      onClick={() => setUniSearchText('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Institution Category Segmented Filter Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'university', label: 'Unis' },
                    { id: 'kmtc', label: 'KMTC' },
                    { id: 'polytechnic', label: 'Polys' },
                    { id: 'tvet', label: 'TVET' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInstitutionFilter(tab.id as any)}
                      className={`whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
                        institutionFilter === tab.id
                          ? 'bg-[#F3B71B] text-black'
                          : 'bg-[#242424] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable List of Institutions */}
              <div className="overflow-y-auto divide-y divide-neutral-800/60 flex-1">
                {uniSearchText.trim() && (
                  <div className="p-2 bg-[#202020] border-b border-neutral-700/80">
                    <button
                      type="button"
                      onClick={() => handleApplyCustomCampus(uniSearchText, institutionFilter === 'all' ? 'university' : institutionFilter)}
                      className="w-full py-2 px-2.5 bg-[#F3B71B]/15 hover:bg-[#F3B71B]/25 text-[#F3B71B] border border-[#F3B71B]/40 rounded-xl text-xs font-bold flex items-center justify-between text-left transition-colors"
                    >
                      <div className="truncate mr-2">
                        <span>✨ Use / Add &ldquo;{uniSearchText}&rdquo;</span>
                        <p className="text-[10px] text-neutral-400 font-normal">Set as your active campus</p>
                      </div>
                      <span className="text-[10px] bg-[#F3B71B] text-black px-2 py-0.5 rounded font-black shrink-0">SELECT</span>
                    </button>
                  </div>
                )}

                {filteredUniversities.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-400 space-y-2">
                    <p>No listed campuses match &quot;{uniSearchText}&quot;</p>
                    <button
                      type="button"
                      onClick={() => handleApplyCustomCampus(uniSearchText, institutionFilter === 'all' ? 'university' : institutionFilter)}
                      className="px-3 py-1.5 bg-[#F3B71B] text-black rounded-lg font-bold text-xs hover:bg-[#dca415]"
                    >
                      Add &ldquo;{uniSearchText}&rdquo; as My Campus
                    </button>
                  </div>
                ) : (
                  filteredUniversities.map((uni) => (
                    <button
                      key={uni.id}
                      type="button"
                      onClick={() => {
                        onSelectUniversity(uni.id);
                        setShowUniDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-start justify-between text-xs transition-colors hover:bg-[#242424] ${
                        selectedUniversity === uni.id ? 'bg-[#F3B71B]/15 text-[#F3B71B] font-semibold' : 'text-neutral-300'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium text-white truncate">{uni.name}</span>
                          {uni.institutionType === 'kmtc' && (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1 rounded font-bold font-mono">
                              KMTC
                            </span>
                          )}
                          {uni.institutionType === 'polytechnic' && (
                            <span className="text-[9px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 px-1 rounded font-bold font-mono">
                              POLY
                            </span>
                          )}
                          {uni.institutionType === 'tvet' && (
                            <span className="text-[9px] bg-purple-500/15 text-purple-400 border border-purple-500/30 px-1 rounded font-bold font-mono">
                              TVET
                            </span>
                          )}
                          {uni.id.startsWith('custom_') && (
                            <span className="text-[9px] bg-[#F3B71B]/20 text-[#F3B71B] border border-[#F3B71B]/40 px-1 rounded font-bold font-mono">
                              CUSTOM
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5 truncate">
                          {uni.city} · {uni.campuses[0]}
                        </div>
                      </div>
                      {selectedUniversity === uni.id && (
                        <span className="text-[#F3B71B] font-bold text-xs shrink-0 ml-1">✓</span>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer: Manual Campus Name Entry Option */}
              <div className="p-2.5 bg-[#141414] border-t border-neutral-800 space-y-2">
                {!isTypingCustom ? (
                  <button
                    type="button"
                    onClick={() => setIsTypingCustom(true)}
                    className="w-full py-1.5 px-3 bg-[#242424] hover:bg-[#2c2c2c] text-white border border-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <PenTool className="w-3.5 h-3.5 text-[#F3B71B]" />
                    <span>Campus not listed? Type your campus name</span>
                  </button>
                ) : (
                  <div className="space-y-2 bg-[#1E1E1E] p-2 rounded-xl border border-[#F3B71B]/40">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#F3B71B]">
                      <span>Type Your Campus Name</span>
                      <button
                        type="button"
                        onClick={() => setIsTypingCustom(false)}
                        className="text-neutral-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      type="text"
                      value={customTypedName}
                      onChange={(e) => setCustomTypedName(e.target.value)}
                      placeholder="e.g. KSII uni, Zetech, KCA..."
                      className="w-full px-2.5 py-1.5 bg-[#262626] text-white text-xs rounded-lg border border-neutral-700 focus:border-[#F3B71B] outline-none"
                    />
                    <div className="flex items-center gap-1.5">
                      <select
                        value={customTypedCategory}
                        onChange={(e) => setCustomTypedCategory(e.target.value as any)}
                        className="px-2 py-1 bg-[#262626] text-white text-[11px] rounded-lg border border-neutral-700 outline-none flex-1"
                      >
                        <option value="university">🎓 University</option>
                        <option value="kmtc">🩺 KMTC</option>
                        <option value="polytechnic">⚙️ Poly</option>
                        <option value="tvet">🔧 TVET</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleApplyCustomCampus(customTypedName, customTypedCategory)}
                        disabled={!customTypedName.trim()}
                        className="px-3 py-1 bg-[#F3B71B] hover:bg-[#dca415] disabled:opacity-50 text-black text-xs font-bold rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Admin Database Console Trigger with Pending Badge */}
          <button
            type="button"
            onClick={onOpenAdminConsole}
            className="min-h-[38px] px-2.5 py-1 text-xs font-bold rounded-xl bg-[#242424] text-neutral-200 border border-neutral-700 hover:border-[#F3B71B]/60 transition-all flex items-center gap-1.5"
            title="Open Adalo Database & Admin Approval Console"
          >
            <Database className="w-3.5 h-3.5 text-[#F3B71B]" />
            <span className="hidden md:inline">Admin DB</span>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-black font-mono font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          {/* Legal Terms Button */}
          <button
            type="button"
            onClick={onOpenTerms}
            className="min-h-[38px] px-2 py-1 text-xs font-medium rounded-xl text-neutral-300 hover:bg-[#242424] hover:text-white transition-colors hidden sm:flex items-center gap-1"
            title="Read STUDSPOT Terms & Disclaimers"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-400" />
            <span>Terms</span>
          </button>

          {/* User Profile / Registration Trigger */}
          <button
            type="button"
            onClick={onOpenSignUp}
            className="min-h-[38px] px-2.5 py-1 text-xs font-bold rounded-xl bg-[#F3B71B]/15 text-[#F3B71B] border border-[#F3B71B]/30 hover:bg-[#F3B71B]/25 transition-all flex items-center gap-1.5"
            title={currentUser ? `Logged in as ${currentUser.fullName}` : 'Sign Up / Log In'}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span className="hidden md:inline truncate max-w-[90px]">
              {currentUser ? currentUser.fullName.split(' ')[0] : 'Sign In'}
            </span>
          </button>

          {/* PWA Add to Home Screen Button */}
          <PWAInstallButton variant="badge" />

          {/* Share App Trigger */}
          <button
            type="button"
            onClick={onOpenShareApp}
            className="min-h-[38px] min-w-[38px] p-2 rounded-xl text-neutral-300 hover:text-[#F3B71B] hover:bg-[#242424] transition-colors flex items-center justify-center"
            title="Share STUDSPOT App with campus comrades"
            aria-label="Share STUDSPOT"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Saved Wishlist */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="min-h-[38px] min-w-[38px] p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#242424] relative transition-colors flex items-center justify-center"
            aria-label="Saved items"
            title="Saved listings"
          >
            <Heart className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {savedCount}
              </span>
            )}
          </button>

          {/* Transaction History & Sold Archival Trigger */}
          <button
            type="button"
            onClick={onOpenTransactionHistory}
            className="min-h-[38px] px-2.5 py-1 text-xs font-bold rounded-xl bg-[#242424] text-neutral-200 border border-neutral-700 hover:border-[#F3B71B]/60 hover:text-white transition-all flex items-center gap-1.5 relative"
            title="View Transaction History, Deals & Sold Items"
            aria-label="Transaction History"
          >
            <History className="w-3.5 h-3.5 text-[#F3B71B]" />
            <span className="hidden sm:inline">History</span>
            {soldCount !== undefined && soldCount > 0 && (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                {soldCount}
              </span>
            )}
          </button>

          {/* Device Simulator Toggle */}
          <button
            type="button"
            onClick={onToggleDeviceView}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-xl border border-neutral-700 bg-[#242424] text-neutral-300 hover:text-white transition-colors min-h-[38px]"
            title="Toggle between phone preview and expansive desktop layout"
          >
            {isMobileDeviceView ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-neutral-400" />
                <span>Web</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#F3B71B]" />
                <span>Phone</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Search Bar Row with Recent Searches Dropdown */}
      <div className="max-w-7xl mx-auto px-4 pb-2.5 pt-0.5">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 220)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                saveSearchToRecent(searchQuery);
                setIsSearchFocused(false);
              }
            }}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search verified items, hostels near Gate C, student gigs, chapati delivery..."
            className="w-full pl-10 pr-10 py-2 bg-[#242424] focus:bg-[#2c2c2c] text-white text-xs sm:text-sm rounded-xl border border-neutral-700/80 focus:border-[#F3B71B] outline-none transition-all placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white w-5 h-5 flex items-center justify-center rounded-full hover:bg-neutral-700"
            >
              ×
            </button>
          )}

          {/* Recent Searches Dropdown (Last 3 Searches) */}
          {isSearchFocused && (
            <div 
              className="absolute left-0 right-0 top-full mt-2 bg-[#1C1C1C] rounded-2xl border border-neutral-700/90 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-md"
              onMouseDown={(e) => e.preventDefault()}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#F3B71B]" />
                  <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Recent Searches
                  </span>
                  <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded-md font-mono">
                    Last 3
                  </span>
                </div>

                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllRecentSearches}
                    className="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors font-medium hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Last 3 Recent Searches Items */}
              {recentSearches.length > 0 ? (
                <div className="py-1 space-y-1">
                  {recentSearches.slice(0, 3).map((term, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        onSearchChange(term);
                        saveSearchToRecent(term);
                        setIsSearchFocused(false);
                      }}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 cursor-pointer transition-all border border-transparent hover:border-neutral-700"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-neutral-800/80 group-hover:bg-[#F3B71B]/15 flex items-center justify-center text-neutral-400 group-hover:text-[#F3B71B] transition-colors shrink-0">
                          <History className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs text-neutral-200 group-hover:text-white font-medium truncate">
                          {term}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => removeRecentSearch(e, term)}
                        className="p-1 rounded-md text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-70 group-hover:opacity-100"
                        title="Remove this search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center text-xs text-neutral-500">
                  No recent searches yet. Press Enter after typing to save searches.
                </div>
              )}

              {/* Popular Quick Suggestions */}
              <div className="pt-2.5 mt-1 border-t border-neutral-800/80">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#F3B71B]" />
                  <span>Popular Student Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Calculus', 'Bedsitter', 'Cooker', 'HP Laptop', 'Phone repair'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        onSearchChange(item);
                        saveSearchToRecent(item);
                        setIsSearchFocused(false);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors border border-neutral-700/60"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
