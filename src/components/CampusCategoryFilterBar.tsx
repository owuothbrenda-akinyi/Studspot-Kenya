import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  GraduationCap, 
  Stethoscope, 
  Wrench, 
  Cpu, 
  Layers, 
  Check, 
  ChevronRight,
  Plus,
  PenTool,
  X
} from 'lucide-react';
import { InstitutionType, University } from '../types';
import { UNIVERSITIES } from '../data/seedData';
import { getAllCampuses, saveCustomCampus } from '../utils/campusStore';

interface CampusCategoryFilterBarProps {
  selectedCampusCategory: InstitutionType;
  onSelectCampusCategory: (category: InstitutionType) => void;
  selectedUniversity: string;
  onSelectUniversity: (universityId: string) => void;
  categoryCounts: Record<InstitutionType, number>;
}

export const CampusCategoryFilterBar: React.FC<CampusCategoryFilterBarProps> = ({
  selectedCampusCategory,
  onSelectCampusCategory,
  selectedUniversity,
  onSelectUniversity,
  categoryCounts,
}) => {
  const [availableCampuses, setAvailableCampuses] = useState<University[]>(() => getAllCampuses());
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customCampusName, setCustomCampusName] = useState('');
  const [customCategory, setCustomCategory] = useState<InstitutionType>(
    selectedCampusCategory === 'all' ? 'university' : selectedCampusCategory
  );

  useEffect(() => {
    const handleUpdate = () => {
      setAvailableCampuses(getAllCampuses());
    };
    window.addEventListener('studspot_campuses_updated', handleUpdate);
    return () => window.removeEventListener('studspot_campuses_updated', handleUpdate);
  }, []);

  const campusCategories: { id: InstitutionType; label: string; icon: React.FC<{ className?: string }>; description: string }[] = [
    {
      id: 'all',
      label: 'All Institutions',
      icon: Layers,
      description: '500,000+ Comrades nationwide across all institutions'
    },
    {
      id: 'university',
      label: '🎓 Universities',
      icon: GraduationCap,
      description: 'Public & private degree-granting universities'
    },
    {
      id: 'kmtc',
      label: '🩺 KMTC Colleges',
      icon: Stethoscope,
      description: 'Kenya Medical Training College campuses'
    },
    {
      id: 'polytechnic',
      label: '⚙️ National Polys',
      icon: Cpu,
      description: 'National Polytechnics offering engineering, technical & craft certs'
    },
    {
      id: 'tvet',
      label: '🔧 TVET Institutes',
      icon: Wrench,
      description: 'Technical & Vocational Education Training institutes'
    },
  ];

  // Specific campuses belonging to the currently selected category
  const filteredCampuses = availableCampuses.filter(u => {
    if (selectedCampusCategory === 'all') return u.id !== 'all';
    return u.institutionType === selectedCampusCategory;
  });

  // Helper label for the "All [Category]" button
  const getAllButtonLabel = () => {
    switch (selectedCampusCategory) {
      case 'university': return 'All Universities';
      case 'kmtc': return 'All KMTC Campuses';
      case 'polytechnic': return 'All National Polys';
      case 'tvet': return 'All TVET Institutes';
      default: return 'All 75+ Campuses';
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCampusName.trim()) return;
    const created = saveCustomCampus(customCampusName.trim(), customCategory, 'Main Campus');
    setAvailableCampuses(getAllCampuses());
    onSelectCampusCategory(customCategory);
    onSelectUniversity(created.id);
    setCustomCampusName('');
    setShowCustomModal(false);
  };

  const activeCategoryObj = campusCategories.find(c => c.id === selectedCampusCategory);
  const activeUniObj = availableCampuses.find(u => u.id === selectedUniversity);

  return (
    <div className="bg-[#181818] rounded-2xl border border-neutral-800 p-3 space-y-2.5 shadow-sm">
      {/* Label and description with Active Filter Tag & Reset */}
      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-[#F3B71B]" />
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Campus Categories
          </span>
          {selectedCampusCategory !== 'all' && (
            <span className="text-[10px] bg-[#F3B71B]/15 text-[#F3B71B] border border-[#F3B71B]/30 px-1.5 py-0.2 rounded font-mono font-semibold">
              {activeCategoryObj?.label}
            </span>
          )}
          {selectedUniversity !== 'all' && (
            <span className="text-[10px] bg-neutral-800 text-neutral-200 border border-neutral-700 px-1.5 py-0.2 rounded font-mono font-semibold">
              {activeUniObj?.shortName}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(selectedCampusCategory !== 'all' || selectedUniversity !== 'all') && (
            <button
              type="button"
              onClick={() => {
                onSelectCampusCategory('all');
                onSelectUniversity('all');
              }}
              className="text-[11px] text-[#F3B71B] hover:underline font-bold"
            >
              Reset to All Kenya
            </button>
          )}
          <span className="text-[11px] text-neutral-400 hidden sm:inline">
            35+ accredited campuses & colleges
          </span>
        </div>
      </div>

      {/* Main Campus Category Segmented Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
        {campusCategories.map((cat) => {
          const isActive = selectedCampusCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                onSelectCampusCategory(cat.id);
                // If switching category, reset to 'all' or keep if matching
                if (cat.id === 'all') {
                  onSelectUniversity('all');
                } else {
                  // If the currently selected university doesn't belong to the newly selected category, select 'all' in this category
                  const match = UNIVERSITIES.find(u => u.id === selectedUniversity && u.institutionType === cat.id);
                  if (!match) {
                    onSelectUniversity('all');
                  }
                }
              }}
              className={`p-2 rounded-xl text-left transition-all border flex flex-col justify-between min-h-[46px] ${
                isActive
                  ? 'bg-[#F3B71B] text-black border-[#F3B71B] font-bold shadow-sm'
                  : 'bg-[#222222] text-neutral-300 border-neutral-800 hover:border-neutral-700 hover:bg-[#282828]'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs truncate">{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1 py-0.2 rounded font-bold ${
                    isActive ? 'bg-black text-[#F3B71B]' : 'bg-[#181818] text-neutral-400'
                  }`}
                  title={`${count} active approved listings`}
                >
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-campus quick selector strip */}
      <div className="pt-2 border-t border-neutral-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider shrink-0 mr-1">
            Campuses:
          </span>

          <button
            type="button"
            onClick={() => onSelectUniversity('all')}
            className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
              selectedUniversity === 'all'
                ? 'bg-[#F3B71B]/20 text-[#F3B71B] border border-[#F3B71B]/40 font-bold'
                : 'bg-[#242424] text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            {getAllButtonLabel()}
          </button>

          {filteredCampuses.map((uni) => {
            const isUniActive = selectedUniversity === uni.id;
            return (
              <button
                key={uni.id}
                type="button"
                onClick={() => onSelectUniversity(uni.id)}
                className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1 ${
                  isUniActive
                    ? 'bg-[#F3B71B] text-black font-extrabold shadow-sm'
                    : 'bg-[#242424] text-neutral-300 hover:text-white border border-neutral-800 hover:bg-[#2c2c2c]'
                }`}
              >
                <span>{uni.shortName}</span>
                {isUniActive && <Check className="w-3 h-3 stroke-[3]" />}
              </button>
            );
          })}

          {/* Quick Add / Type Campus Pill */}
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1 bg-[#222222] text-[#F3B71B] hover:bg-[#F3B71B]/15 border border-[#F3B71B]/40"
            title="Type your campus if not listed (e.g. KSII uni)"
          >
            <Plus className="w-3 h-3" />
            <span>Type Campus...</span>
          </button>
        </div>
      </div>

      {/* Inline Quick Modal for Custom Campus */}
      {showCustomModal && (
        <div className="pt-2 border-t border-neutral-800 animate-in fade-in duration-150">
          <form onSubmit={handleApplyCustom} className="p-3 bg-[#1C1C1C] rounded-xl border border-[#F3B71B]/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#F3B71B] flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5" />
                Type Your Campus (e.g. KSII uni, Zetech, KCA...)
              </span>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                autoFocus
                required
                value={customCampusName}
                onChange={(e) => setCustomCampusName(e.target.value)}
                placeholder="Enter campus name (e.g. KSII uni, Maasai Mara...)"
                className="flex-1 px-3 py-1.5 bg-[#262626] text-white text-xs rounded-lg border border-neutral-700 focus:border-[#F3B71B] outline-none"
              />

              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as any)}
                className="px-2.5 py-1.5 bg-[#262626] text-white text-xs rounded-lg border border-neutral-700 outline-none"
              >
                <option value="university">🎓 University</option>
                <option value="kmtc">🩺 KMTC</option>
                <option value="polytechnic">⚙️ Polytechnic</option>
                <option value="tvet">🔧 TVET</option>
              </select>

              <button
                type="submit"
                disabled={!customCampusName.trim()}
                className="px-4 py-1.5 bg-[#F3B71B] hover:bg-[#dca415] disabled:opacity-50 text-black font-extrabold text-xs rounded-lg whitespace-nowrap transition-colors"
              >
                Filter Feed
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
