import React from 'react';
import { 
  ShoppingBag, 
  Home, 
  Briefcase, 
  Store, 
  PlusCircle, 
  MessageSquareShare,
  Layers
} from 'lucide-react';
import { ListingType } from '../types';

export type NavTabType = 'all' | 'item' | 'hostel' | 'gig' | 'business' | 'buzz';

interface NavigationTabsProps {
  activeTab: NavTabType;
  onSelectTab: (tab: NavTabType) => void;
  onOpenPostModal: () => void;
}

export const BottomNavBar: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  onOpenPostModal,
}) => {
  const tabs = [
    { id: 'all' as NavTabType, label: 'Feed', icon: Layers },
    { id: 'item' as NavTabType, label: 'Marketplace', icon: ShoppingBag },
    { id: 'hostel' as NavTabType, label: 'Housing', icon: Home },
    { id: 'gig' as NavTabType, label: 'Jobs', icon: Briefcase },
    { id: 'business' as NavTabType, label: 'Services', icon: Store },
    { id: 'buzz' as NavTabType, label: 'Buzz', icon: MessageSquareShare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-md border-t border-neutral-800 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
      <div className="max-w-md md:max-w-xl mx-auto px-2 flex items-center justify-between h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative ${
                isActive ? 'text-[#F3B71B] font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#F3B71B]/15 scale-105' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#F3B71B] stroke-[2.2]' : 'text-neutral-400 stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 truncate ${isActive ? 'font-black text-[#F3B71B]' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 bg-[#F3B71B] rounded-full absolute bottom-1" />
              )}
            </button>
          );
        })}

        {/* Floating Post CTA Button */}
        <div className="px-1">
          <button
            type="button"
            onClick={onOpenPostModal}
            className="flex flex-col items-center justify-center min-h-[48px] min-w-[48px] px-2.5 py-1 rounded-2xl bg-[#F3B71B] hover:bg-[#dca415] text-black shadow-md shadow-[#F3B71B]/30 active:scale-95 transition-transform"
            aria-label="Post new listing"
          >
            <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] font-black mt-0.5">Post</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

interface CategoryFilterPillsProps {
  activeTab: NavTabType;
  onSelectTab: (tab: NavTabType) => void;
  counts: Record<string, number>;
}

export const CategoryFilterPills: React.FC<CategoryFilterPillsProps> = ({
  activeTab,
  onSelectTab,
  counts,
}) => {
  const categories = [
    { id: 'all' as NavTabType, label: 'All Feed', count: counts.all || 0 },
    { id: 'item' as NavTabType, label: '🛍️ Marketplace', count: counts.item || 0 },
    { id: 'hostel' as NavTabType, label: '🏠 Housing (Hostels)', count: counts.hostel || 0 },
    { id: 'gig' as NavTabType, label: '💼 Jobs & Gigs', count: counts.gig || 0 },
    { id: 'business' as NavTabType, label: '🏪 Local Services', count: counts.business || 0 },
    { id: 'buzz' as NavTabType, label: '📢 Campus Buzz', count: counts.buzz || 0 },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1">
      {categories.map((cat) => {
        const isActive = activeTab === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectTab(cat.id)}
            className={`whitespace-nowrap shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 min-h-[38px] ${
              isActive
                ? 'bg-[#F3B71B] text-black font-extrabold shadow-sm'
                : 'bg-[#1E1E1E] text-neutral-300 hover:text-white border border-neutral-800 hover:bg-[#252525]'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                isActive ? 'bg-black text-[#F3B71B] font-bold' : 'bg-[#2A2A2A] text-neutral-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
