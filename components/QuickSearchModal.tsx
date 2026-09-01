'use client';

import React, { useState, useEffect } from 'react';
import { Search, Building2, Folder, ArrowRight, X, Sparkles, Bookmark } from 'lucide-react';
import { CompanyLead, LeadCohortList } from '@/lib/types';
import { getFieldValue } from '@/lib/provenance-utils';
import CompanyLogo from './CompanyLogo';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyLead[];
  lists: LeadCohortList[];
  onSelectCompany: (company: CompanyLead) => void;
  onSelectList: (list: LeadCohortList) => void;
  onNavigateTab: (tab: string) => void;
}

export default function QuickSearchModal({
  isOpen,
  onClose,
  companies,
  lists,
  onSelectCompany,
  onSelectList,
  onNavigateTab,
}: QuickSearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.domain.toLowerCase().includes(query.toLowerCase()) ||
      getFieldValue(c.industry).text.toLowerCase().includes(query.toLowerCase())
  );

  const matchedLists = lists.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      id="quick-search-modal-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-24 p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="quick-search-modal-card"
        className="w-full max-w-xl bg-white rounded-3xl border border-[#E5E5E1] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="p-4 border-b border-[#E5E5E1] flex items-center gap-3 bg-[#F9F9F7]">
          <Search className="w-5 h-5 text-[#005138]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, cohorts, signals, navigation..."
            autoFocus
            className="w-full bg-transparent text-sm text-[#1a1c1b] placeholder-[#8A8F98] outline-none font-medium"
          />
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E5E5E1] text-[#8A8F98]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar p-3 space-y-4">
          {/* Quick Actions */}
          {!query && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8A8F98] uppercase px-3">
                Quick Navigation
              </span>
              <div className="space-y-1">
                {[
                  { label: 'Discover & Search Engine', tab: 'DISCOVER' },
                  { label: 'Saved Leads Repository', tab: 'SAVED_SEARCHES' },
                  { label: 'Cohort Lists', tab: 'LISTS' },
                  { label: 'Prospecting Activity Log', tab: 'ACTIVITY' },
                ].map((item) => (
                  <div
                    key={item.tab}
                    onClick={() => {
                      onNavigateTab(item.tab);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#F4F4F2] flex items-center justify-between text-xs font-semibold text-[#1a1c1b] cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8A8F98]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companies */}
          {matchedCompanies.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8A8F98] uppercase px-3">
                Target Accounts ({matchedCompanies.length})
              </span>
              <div className="space-y-1">
                {matchedCompanies.slice(0, 5).map((comp) => (
                  <div
                    key={comp.id}
                    onClick={() => {
                      onSelectCompany(comp);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#F4F4F2] flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <CompanyLogo company={comp} size="sm" />
                      <div>
                        <p className="text-xs font-bold text-[#1a1c1b]">{comp.name}</p>
                        <p className="text-[10px] text-[#8A8F98]">
                          {getFieldValue(comp.industry).text} · {getFieldValue(comp.location).text}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#005138]">
                      Score {comp.leadScore}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lists */}
          {matchedLists.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8A8F98] uppercase px-3">
                Cohort Lists
              </span>
              <div className="space-y-1">
                {matchedLists.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onSelectList(l);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl hover:bg-[#F4F4F2] flex items-center justify-between text-xs font-semibold text-[#1a1c1b] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-[#005138]" />
                      <span>{l.name}</span>
                    </div>
                    <span className="text-[10px] text-[#8A8F98]">{l.leadCount} leads</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
