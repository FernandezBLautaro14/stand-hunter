import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unclaimedRewards?: boolean;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'misiones', label: 'Misiones', icon: 'explore' },
  { id: 'escaner-ar', label: 'Escáner AR', icon: 'center_focus_strong' },
  { id: 'asistente-ia', label: 'Asistente IA', icon: 'smart_toy' },
  { id: 'recompensas', label: 'Recompensas', icon: 'military_tech' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onSelectTab,
  unclaimedRewards = false,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#131027]/90 backdrop-blur-xl border-t border-[#00eefc]/15 shadow-[0_-1px_16px_rgba(0,0,0,0.45)]">
      <div className="h-20 max-w-lg mx-auto px-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-1 min-w-[68px] min-h-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#00eefc] bg-[#2a273e]/70 shadow-[0_0_16px_rgba(0,238,252,0.3)] border border-[#00eefc]/40 font-semibold'
                  : 'text-[#c9c5d0] hover:text-[#e5defe] hover:bg-[#201d33]/40'
              }`}
            >
              {item.id === 'recompensas' && unclaimedRewards && (
                <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#ff027f] animate-ping" />
              )}
              <span
                className="material-symbols-outlined text-[24px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label-md text-[11px] truncate tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
