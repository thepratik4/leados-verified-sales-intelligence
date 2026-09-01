'use client';

import React from 'react';
import { Sparkles, Search, Download, Plus, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenQuickSearch?: () => void;
  onOpenNotifications?: () => void;
  onOpenSettings?: () => void;
  onExportCsv?: () => void;
  onCreateList?: () => void;
}

export default function Header({
  currentTab,
  onOpenQuickSearch,
  onOpenNotifications,
  onOpenSettings,
  onExportCsv,
  onCreateList,
}: HeaderProps) {
  const getHeaderInfo = (tab: string) => {
    switch (tab) {
      case 'RESULTS':
        return {
          title: 'Lead Pipeline & Search Results',
          subtitle: 'Multi-factor scored accounts matching your live intent triggers',
        };
      case 'DOSSIER':
        return {
          title: 'Lead Intelligence Dossier',
          subtitle: 'Deep-dive analysis, business signals & AI outreach synthesis',
        };
      case 'SAVED_SEARCHES':
        return {
          title: 'Saved Leads Repository',
          subtitle: 'High-priority prospect database and monitored target accounts',
        };
      case 'LISTS':
        return {
          title: 'Cohort Lists',
          subtitle: 'Segmented account groups organized for GTM campaigns',
        };
      case 'ACTIVITY':
        return {
          title: 'Prospecting Activity & Audit Stream',
          subtitle: 'Timeline of AI intelligence scans, list exports, and sequence generations',
        };
      case 'SETTINGS':
        return {
          title: 'Workspace Configuration & Integrations',
          subtitle: 'CRM connections, AI preferences, and organization settings',
        };
      default:
        return {
          title: 'Discover & Search Engine',
          subtitle: 'Find high-fit accounts using live market triggers and verified signals',
        };
    }
  };

  const { title, subtitle } = getHeaderInfo(currentTab);

  return (
    <header
      id="leados-header"
      className="h-16 px-8 bg-white border-b border-[#E5E5E1] flex items-center justify-between shrink-0 select-none z-20"
    >
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-bold text-[#1a1c1b] tracking-tight">{title}</h1>
          <p className="text-xs text-[#8A8F98] truncate max-w-md hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live AI Status pill */}
        <div
          id="ai-engine-status-badge"
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F4F2] border border-[#E5E5E1] text-xs text-[#3F4943]"
        >
          <span className="w-2 h-2 rounded-full bg-[#237A52] animate-pulse"></span>
          <span className="font-medium">Gemini 3.7 Intelligence Active</span>
        </div>

        {/* Global Quick Search Shortcut */}
        {onOpenQuickSearch && (
          <button
            id="header-global-search-btn"
            onClick={onOpenQuickSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9F9F7] border border-[#E5E5E1] text-xs text-[#8A8F98] hover:text-[#1a1c1b] hover:border-[#D6D6D0] transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quick lookup...</span>
            <kbd className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#E5E5E1] font-mono text-[#3F4943]">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Notifications Icon Button */}
        {onOpenNotifications && (
          <button
            id="header-notifications-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-[#3F4943] hover:bg-[#F4F4F2] border border-[#E5E5E1] transition-colors"
            title="Activity Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#005138]"></span>
          </button>
        )}

        {/* Settings Icon Button */}
        {onOpenSettings && (
          <button
            id="header-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-[#3F4943] hover:bg-[#F4F4F2] border border-[#E5E5E1] transition-colors"
            title="Workspace Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}

        {/* Export CSV if provided */}
        {onExportCsv && (
          <button
            id="header-export-btn"
            onClick={onExportCsv}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E1] hover:bg-[#F4F4F2] text-xs font-medium text-[#1a1c1b] transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#3F4943]" />
            <span>Export</span>
          </button>
        )}

        {/* Create List if provided */}
        {onCreateList && (
          <button
            id="header-create-list-btn"
            onClick={onCreateList}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New List</span>
          </button>
        )}
      </div>
    </header>
  );
}
