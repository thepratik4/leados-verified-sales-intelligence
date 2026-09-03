'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  Search,
  Download,
  Filter,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Trash2,
  FolderPlus,
  Plus,
  CheckSquare,
  Square,
} from 'lucide-react';
import { CompanyLead } from '@/lib/types';
import { getFieldValue } from '@/lib/provenance-utils';
import CompanyLogo from './CompanyLogo';

interface SavedSearchesViewProps {
  companies: CompanyLead[];
  onSelectCompany: (company: CompanyLead) => void;
  onToggleSave: (companyId: string) => void;
  onAddToList: (companyIds: string[]) => void;
  onExportCsv: () => void;
  onDeleteCompany?: (companyId: string) => void;
  onDeleteSelectedCompanies?: (companyIds: string[]) => void;
}

export default function SavedSearchesView({
  companies,
  onSelectCompany,
  onToggleSave,
  onAddToList,
  onExportCsv,
  onDeleteCompany,
  onDeleteSelectedCompanies,
}: SavedSearchesViewProps) {
  const [activeTab, setActiveTab] = useState<'SAVED_LEADS' | 'SAVED_SEARCHES' | 'HIGH_PRIORITY' | 'RECENT'>(
    'SAVED_LEADS'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const savedLeads = companies.filter((c) => c.status === 'SAVED');
  const highPrioritySaved = savedLeads.filter((c) => c.leadScore >= 90);

  const displayedLeads = (
    activeTab === 'HIGH_PRIORITY'
      ? highPrioritySaved
      : activeTab === 'RECENT'
      ? savedLeads.slice(0, 5)
      : savedLeads
  ).filter((c) => {
    const indText = getFieldValue(c.industry).text;
    if (selectedIndustry !== 'ALL' && indText !== selectedIndustry) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q) ||
        c.keySignal.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const industries = ['ALL', ...Array.from(new Set(savedLeads.map((c) => getFieldValue(c.industry).text)))];

  const toggleSelectAll = () => {
    if (selectedIds.length === displayedLeads.length && displayedLeads.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedLeads.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (onDeleteSelectedCompanies) {
      onDeleteSelectedCompanies(selectedIds);
    } else {
      selectedIds.forEach((id) => onToggleSave(id));
    }
    setSelectedIds([]);
  };

  const handleDeleteOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteCompany) {
      onDeleteCompany(id);
    } else {
      onToggleSave(id);
    }
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <div id="saved-leads-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138] uppercase tracking-wider">
              Workspace Repository
            </span>
            <span className="text-xs text-[#8A8F98]">· {savedLeads.length} Saved Accounts</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1c1b] tracking-tight">Saved Leads</h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedIds.length > 0 && (
            <>
              <button
                id="saved-delete-selected-btn"
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>

              <button
                id="saved-add-selected-btn"
                onClick={() => {
                  onAddToList(selectedIds);
                  setSelectedIds([]);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5 text-[#A4F3CC]" />
                <span>Add to Cohort ({selectedIds.length})</span>
              </button>
            </>
          )}

          <button
            id="saved-leads-export-btn"
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E5E1] hover:bg-[#F4F4F2] text-xs font-semibold text-[#1a1c1b] shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#3F4943]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E5E1] pb-3">
        <div className="flex items-center gap-2">
          <button
            id="saved-tab-all"
            onClick={() => setActiveTab('SAVED_LEADS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'SAVED_LEADS'
                ? 'bg-[#005138] text-white font-semibold'
                : 'bg-white text-[#3F4943] hover:bg-[#F4F4F2] border border-[#E5E5E1]'
            }`}
          >
            All Saved ({savedLeads.length})
          </button>

          <button
            id="saved-tab-high-priority"
            onClick={() => setActiveTab('HIGH_PRIORITY')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'HIGH_PRIORITY'
                ? 'bg-[#005138] text-white font-semibold'
                : 'bg-white text-[#005138] hover:bg-[#F4F4F2] border border-[#A4F3CC]'
            }`}
          >
            High Priority ({highPrioritySaved.length})
          </button>

          <button
            id="saved-tab-recent"
            onClick={() => setActiveTab('RECENT')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'RECENT'
                ? 'bg-[#005138] text-white font-semibold'
                : 'bg-white text-[#3F4943] hover:bg-[#F4F4F2] border border-[#E5E5E1]'
            }`}
          >
            Recently Viewed
          </button>
        </div>

        {/* Industry Filter Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white text-[#1a1c1b] border border-[#E5E5E1] rounded-lg outline-none cursor-pointer"
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind === 'ALL' ? 'All Industries' : ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Filter Toolbar & Batch Select Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8A8F98] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by company name, trigger signal, or domain..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white text-[#1a1c1b] rounded-xl border border-[#E5E5E1] focus:border-[#005138] focus:ring-1 focus:ring-[#A4F3CC] outline-none"
          />
        </div>

        {displayedLeads.length > 0 && (
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-[#E5E5E1] hover:bg-[#F9F9F7] text-xs font-semibold text-[#3F4943] shrink-0 cursor-pointer"
          >
            {selectedIds.length === displayedLeads.length && displayedLeads.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-[#005138]" />
            ) : (
              <Square className="w-4 h-4 text-[#8A8F98]" />
            )}
            <span>
              {selectedIds.length === displayedLeads.length
                ? 'Deselect All'
                : `Select All (${displayedLeads.length})`}
            </span>
          </button>
        )}
      </div>

      {/* Saved Leads Cards / Table */}
      <div className="bg-white rounded-2xl border border-[#E5E5E1] shadow-xs divide-y divide-[#E5E5E1]">
        {displayedLeads.length === 0 ? (
          <div className="py-16 text-center text-[#8A8F98]">
            <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="font-semibold text-sm text-[#1a1c1b]">No saved leads in this view</p>
            <p className="text-xs text-[#8A8F98] mt-1">
              Click the bookmark icon on any lead in the Results view to save it here.
            </p>
          </div>
        ) : (
          displayedLeads.map((comp) => {
            const isSelected = selectedIds.includes(comp.id);
            return (
              <div
                key={comp.id}
                onClick={() => onSelectCompany(comp)}
                className={`p-4 hover:bg-[#F9F9F7] cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${
                  isSelected ? 'bg-[#A4F3CC]/10' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Select Checkbox */}
                  <button
                    onClick={(e) => toggleSelectOne(comp.id, e)}
                    className="p-1 hover:text-[#005138] cursor-pointer text-[#8A8F98]"
                    title={isSelected ? 'Deselect' : 'Select'}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#005138]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#8A8F98]" />
                    )}
                  </button>

                  <CompanyLogo company={comp} size="md" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1a1c1b] group-hover:text-[#005138] transition-colors">
                        {comp.name}
                      </span>
                      <span className="text-xs text-[#8A8F98]">({comp.domain})</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                        Score {comp.leadScore}
                      </span>
                    </div>
                    <div className="text-xs text-[#3F4943] flex items-center gap-2">
                      <span>{getFieldValue(comp.industry).text}</span>
                      <span>•</span>
                      <span>{getFieldValue(comp.location).text}</span>
                      <span>•</span>
                      <span className="text-[#8A8F98]">{getFieldValue(comp.size).text}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-medium text-[#1a1c1b] truncate max-w-xs">
                      {comp.keySignal.title}
                    </p>
                    <p className="text-[10px] text-[#8A8F98]">{comp.keySignal.sourceName}</p>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {/* Delete Lead Button */}
                    <button
                      id={`delete-saved-lead-${comp.id}`}
                      onClick={(e) => handleDeleteOne(comp.id, e)}
                      className="p-1.5 rounded-lg border border-[#E5E5E1] text-[#8A8F98] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => onToggleSave(comp.id)}
                      className="p-1.5 rounded-lg border border-[#E5E5E1] text-[#005138] bg-[#A4F3CC]/20 hover:bg-[#B42318]/10 hover:text-[#B42318] transition-colors"
                      title="Remove from saved"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>

                    <button
                      onClick={() => onSelectCompany(comp)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#005138] hover:bg-[#176B4D] text-white font-semibold text-xs shadow-xs"
                    >
                      <span>Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
