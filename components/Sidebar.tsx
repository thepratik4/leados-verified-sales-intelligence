'use client';

import React from 'react';
import Image from 'next/image';
import {
  Compass,
  Database,
  Bookmark,
  Folder,
  Clock,
  Settings,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  savedCount?: number;
  listsCount?: number;
  resultsCount?: number;
}

export const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCbecigvAZYkyPiQeQ-BX_EzkmpkyPxLK0I-43fEpXAFc-1BxQ8G6szGDUQUtaCfc20cnGyD54N_sonjN7TI5NIp_oOq15lJn89tuNXKesfAYIKDhqqiBA7zXQSVbqOGkxJEkvrLVGNMV5ZpqvCGwgAC6cnN-8JF9XAqdwiFl_GOmcL9Dljui8BwxQJFfrdlDe4Dj9GwfPauPVioAVDqvjhxB-h4UsfWaf_KjxMkJBLC0t_0HrDZxq-';

export const USER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBTQik0VFXVQouIqaujwZkKgqjLYgjIcwwHU8pTuJnHMSVbVjxhtVOHaCc3qt1vCmDa1c2CYgfDvqT0P7M6lFk2goZZCmqg80EMUIbCLATpwXUdrTzyAO4K_8RGgC_vG_tujQvDlciMtIYXWKDVLHtTHNZSRllO4Z_HO-5zd7u4dUH1g0dUxHh7YxUrGFTVPK0GhimVZHW1TuU3GFe91QoG0z5gHhXv9o6TsmgEWEIK6HSVddUbSJCY';

export default function Sidebar({
  currentTab,
  onSelectTab,
  savedCount = 0,
  listsCount = 0,
  resultsCount = 0,
}: SidebarProps) {
  const normTab = currentTab.toLowerCase().replace(/_/g, '-');

  const navItems = [
    {
      id: 'discover',
      label: 'Discover',
      icon: Compass,
      badge: null,
    },
    {
      id: 'results',
      label: 'Leads & Results',
      icon: Database,
      badge: resultsCount > 0 ? `${resultsCount}` : null,
    },
    {
      id: 'saved_searches',
      canonicalId: 'saved-searches',
      label: 'Saved Leads',
      icon: Bookmark,
      badge: savedCount > 0 ? `${savedCount}` : null,
    },
    {
      id: 'lists',
      label: 'Cohort Lists',
      icon: Folder,
      badge: listsCount > 0 ? `${listsCount}` : null,
    },
    {
      id: 'activity',
      label: 'Activity Log',
      icon: Clock,
      badge: null,
    },
  ];

  return (
    <aside
      id="leados-sidebar"
      className="w-64 bg-white border-r border-[#E5E5E1] flex flex-col h-screen shrink-0 select-none z-30"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#E5E5E1] flex items-center justify-between">
        <div
          id="brand-header"
          onClick={() => onSelectTab('discover')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#005138] flex items-center justify-center shadow-sm overflow-hidden p-1">
            <Image
              src={LOGO_URL}
              alt="LeadOS Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-base text-[#1a1c1b] tracking-tight group-hover:text-[#005138] transition-colors">
                LeadOS
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                B2B
              </span>
            </div>
            <p className="text-[11px] text-[#8A8F98]">Enterprise Intelligence</p>
          </div>
        </div>
      </div>

      {/* Workspace pill */}
      <div className="px-4 pt-4 pb-2">
        <div
          id="workspace-switcher"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F4F4F2] border border-[#E5E5E1] text-xs hover:border-[#D6D6D0] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-[#237A52] animate-pulse"></div>
            <span className="font-medium text-[#1a1c1b] truncate">Enterprise Pipeline</span>
          </div>
          <span className="text-[10px] text-[#8A8F98] font-mono">v3.7</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav id="sidebar-nav" className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-[#8A8F98] uppercase">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentTab.toUpperCase() === item.id.toUpperCase() ||
            normTab === item.id ||
            normTab === item.canonicalId;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => onSelectTab(item.id.toUpperCase())}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#005138] text-white shadow-sm font-semibold'
                  : 'text-[#3F4943] hover:bg-[#F4F4F2] hover:text-[#1a1c1b]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#A4F3CC]' : 'text-[#8A8F98] group-hover:text-[#1a1c1b]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#176B4D] text-[#A4F3CC]'
                      : 'bg-[#EEEEEC] text-[#3F4943]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-5 px-3 py-1.5 text-[11px] font-semibold tracking-wider text-[#8A8F98] uppercase flex items-center justify-between">
          <span>AI Engine</span>
          <Sparkles className="w-3 h-3 text-[#237A52]" />
        </div>

        <div className="p-3 mx-1 rounded-xl bg-gradient-to-br from-[#F4F4F2] to-[#E8E8E6] border border-[#E5E5E1] space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#005138]" />
            <span className="text-xs font-semibold text-[#1a1c1b]">Live Signal Monitor</span>
          </div>
          <p className="text-[11px] text-[#3F4943] leading-relaxed">
            Real-time triggers active across SEC filings, hiring changes & executive moves.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-[#005138] font-medium pt-1">
            <Zap className="w-3 h-3 text-[#237A52]" />
            <span>99.4% Verified Accuracy</span>
          </div>
        </div>
      </nav>

      {/* Bottom Footer & User Profile */}
      <div className="p-3 border-t border-[#E5E5E1] space-y-2 bg-[#F9F9F7]">
        <button
          id="nav-link-settings"
          onClick={() => onSelectTab('SETTINGS')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            normTab === 'settings'
              ? 'bg-[#005138] text-white font-semibold'
              : 'text-[#3F4943] hover:bg-[#EEEEEC] hover:text-[#1a1c1b]'
          }`}
        >
          <Settings className={`w-4 h-4 ${normTab === 'settings' ? 'text-[#A4F3CC]' : 'text-[#8A8F98]'}`} />
          <span>Settings & Data Sources</span>
        </button>

        {/* User Card */}
        <div
          id="sidebar-user-card"
          onClick={() => onSelectTab('SETTINGS')}
          className="flex items-center gap-3 p-2 rounded-lg bg-white border border-[#E5E5E1] hover:border-[#D6D6D0] cursor-pointer transition-all shadow-xs"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E5E5E1]">
            <Image
              src={USER_AVATAR_URL}
              alt="Sarah Jenkins"
              width={32}
              height={32}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#237A52] ring-1 ring-white"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#1a1c1b] truncate">Sarah Jenkins</p>
            <p className="text-[11px] text-[#8A8F98] truncate">VP of Sales Ops</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#8A8F98]" />
        </div>
      </div>
    </aside>
  );
}
