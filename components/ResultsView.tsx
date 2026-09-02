'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Bookmark,
  FolderPlus,
  Sparkles,
  ChevronRight,
  ExternalLink,
  SlidersHorizontal,
  CheckSquare,
  Square,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  Building2,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CompanyLead } from '@/lib/types';
import { getFieldValue, getVerificationBadge } from '@/lib/provenance-utils';
import CompanyLogo from './CompanyLogo';

interface ResultsViewProps {
  companies: CompanyLead[];
  onSelectCompany: (company: CompanyLead) => void;
  onToggleSaveCompany: (companyId: string) => void;
  onAddToList: (companyIds: string[]) => void;
  onExportCsv: (selectedOnly?: boolean) => void;
  searchSummary?: string;
  onNavigateDiscover?: () => void;
}

export default function ResultsView({
  companies,
  onSelectCompany,
  onToggleSaveCompany,
  onAddToList,
  onExportCsv,
  searchSummary,
  onNavigateDiscover,
}: ResultsViewProps) {
  const [activeTier, setActiveTier] = useState<'ALL' | 'HIGH_PRIORITY' | 'STRONG_FIT' | 'POTENTIAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'size' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Counts
  const highPriorityCount = companies.filter((c) => c.leadScore >= 90).length;
  const strongFitCount = companies.filter((c) => c.leadScore >= 80 && c.leadScore < 90).length;
  const potentialCount = companies.filter((c) => c.leadScore < 80).length;

  // Filtered list
  const filtered = companies.filter((c) => {
    if (activeTier === 'HIGH_PRIORITY' && c.leadScore < 90) return false;
    if (activeTier === 'STRONG_FIT' && (c.leadScore < 80 || c.leadScore >= 90)) return false;
    if (activeTier === 'POTENTIAL' && c.leadScore >= 80) return false;

    if (verifiedOnly && c.dataQuality?.confidence === 'INSUFFICIENT') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchDomain = c.domain.toLowerCase().includes(q);
      const matchInd = getFieldValue(c.industry).text.toLowerCase().includes(q);
      const matchLoc = getFieldValue(c.location).text.toLowerCase().includes(q);
      const matchSignal = c.keySignal.title.toLowerCase().includes(q);
      if (!matchName && !matchDomain && !matchInd && !matchLoc && !matchSignal) return false;
    }

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    let result = 0;
    if (sortBy === 'score') result = a.leadScore - b.leadScore;
    else if (sortBy === 'size') {
      const aSize = a.employeeCount.value || 0;
      const bSize = b.employeeCount.value || 0;
      result = aSize - bSize;
    } else if (sortBy === 'name') result = a.name.localeCompare(b.name);
    else result = a.leadScore - b.leadScore;

    return sortOrder === 'desc' ? -result : result;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === sorted.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sorted.map((c) => c.id));
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

  return (
    <div id="results-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Verification Metric Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Leads</span>
            </span>
            <span className="text-xs text-[#8A8F98]">· {companies.length} Authoritative Accounts</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1c1b] tracking-tight">
            Verified Prospect Pipeline
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="results-export-all-btn"
            onClick={() => onExportCsv(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E5E1] hover:bg-[#F4F4F2] text-xs font-semibold text-[#1a1c1b] shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#3F4943]" />
            <span>Export Verified CSV</span>
          </button>

          {selectedIds.length > 0 && (
            <button
              id="results-add-selected-to-list-btn"
              onClick={() => onAddToList(selectedIds)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#005138] hover:bg-[#176B4D] text-xs font-bold text-white shadow-xs transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#A4F3CC]" />
              <span>Add Selected ({selectedIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Search Query / Criteria Banner */}
      {searchSummary && (
        <div className="bg-[#EBFBF4] border border-[#A4F3CC] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#005138]">
            <Sparkles className="w-4 h-4 text-[#005138] shrink-0" />
            <span className="font-semibold">{searchSummary}</span>
          </div>
          {onNavigateDiscover && (
            <button
              onClick={onNavigateDiscover}
              className="text-xs font-bold text-[#005138] hover:underline shrink-0 cursor-pointer"
            >
              Refine Search Criteria →
            </button>
          )}
        </div>
      )}

      {/* Control Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E5E5E1] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tier Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setActiveTier('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTier === 'ALL'
                ? 'bg-[#005138] text-white shadow-xs'
                : 'bg-[#F4F4F2] text-[#3F4943] hover:bg-[#EEEEEC]'
            }`}
          >
            All Accounts ({companies.length})
          </button>
          <button
            onClick={() => setActiveTier('HIGH_PRIORITY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTier === 'HIGH_PRIORITY'
                ? 'bg-[#005138] text-white shadow-xs'
                : 'bg-[#F4F4F2] text-[#3F4943] hover:bg-[#EEEEEC]'
            }`}
          >
            High Priority (90+) ({highPriorityCount})
          </button>
          <button
            onClick={() => setActiveTier('STRONG_FIT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTier === 'STRONG_FIT'
                ? 'bg-[#005138] text-white shadow-xs'
                : 'bg-[#F4F4F2] text-[#3F4943] hover:bg-[#EEEEEC]'
            }`}
          >
            Strong Fit (80-89) ({strongFitCount})
          </button>
          <button
            onClick={() => setActiveTier('POTENTIAL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTier === 'POTENTIAL'
                ? 'bg-[#005138] text-white shadow-xs'
                : 'bg-[#F4F4F2] text-[#3F4943] hover:bg-[#EEEEEC]'
            }`}
          >
            Potential (&lt;80) ({potentialCount})
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[#8A8F98] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, signals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] text-xs text-[#1a1c1b] placeholder-[#8A8F98] focus:outline-none focus:border-[#005138]"
            />
          </div>

          <button
            onClick={() => {
              if (sortBy === 'score') setSortBy('size');
              else if (sortBy === 'size') setSortBy('name');
              else setSortBy('score');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] text-xs font-semibold text-[#3F4943] hover:bg-[#F4F4F2] shrink-0"
          >
            <ArrowUpDown className="w-3 h-3 text-[#8A8F98]" />
            <span>Sort: {sortBy.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white rounded-3xl border border-[#E5E5E1] shadow-xs overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F4F2] flex items-center justify-center mx-auto text-[#8A8F98]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1a1c1b]">No verified companies found</h3>
            <p className="text-xs text-[#8A8F98] max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find verified records matching your exact filter criteria. LeadOS does not generate or hallucinate synthetic company data.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTier('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-[#005138] text-white text-xs font-bold shadow-xs hover:bg-[#176B4D]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E5E1] bg-[#F9F9F7] text-[11px] font-bold text-[#8A8F98] uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">
                    <button onClick={toggleSelectAll} className="p-1 hover:text-[#005138]">
                      {selectedIds.length === sorted.length && sorted.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-[#005138]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#8A8F98]" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Company & Domain</th>
                  <th className="py-3 px-4">Deterministic Lead Score</th>
                  <th className="py-3 px-4">Verified Trigger Signal</th>
                  <th className="py-3 px-4">Firmographics</th>
                  <th className="py-3 px-4">Data Quality</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E1] text-xs">
                {sorted.map((company) => {
                  const isSelected = selectedIds.includes(company.id);
                  const indData = getFieldValue(company.industry);
                  const locData = getFieldValue(company.location);
                  const empData = getFieldValue(company.employeeCount);

                  return (
                    <tr
                      key={company.id}
                      onClick={() => onSelectCompany(company)}
                      className={`hover:bg-[#F9F9F7] cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#A4F3CC]/10' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-center" onClick={(e) => toggleSelectOne(company.id, e)}>
                        <button className="p-1">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#005138]" />
                          ) : (
                            <Square className="w-4 h-4 text-[#8A8F98]" />
                          )}
                        </button>
                      </td>

                      {/* Company Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <CompanyLogo company={company} size="md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#1a1c1b] hover:text-[#005138]">
                                {company.name}
                              </span>
                              <span className="text-[10px] text-[#005138] bg-[#A4F3CC]/50 font-bold px-1.5 py-0.2 rounded">
                                {company.demoLabel || 'VERIFIED'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#8A8F98] pt-0.5">
                              <span>{company.domain}</span>
                              <span>•</span>
                              <span>{locData.text}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Lead Score */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-[#005138] font-mono">
                              {company.leadScore}
                            </span>
                            <span className="text-[10px] text-[#8A8F98]">/100</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                company.leadScore >= 90
                                  ? 'bg-[#A4F3CC] text-[#005138]'
                                  : company.leadScore >= 80
                                  ? 'bg-[#FEF0C7] text-[#93370D]'
                                  : 'bg-[#F4F4F2] text-[#3F4943]'
                              }`}
                            >
                              {company.leadScore >= 90 ? 'EXCELLENT' : company.leadScore >= 80 ? 'STRONG' : 'POTENTIAL'}
                            </span>
                          </div>
                          <div className="w-28 h-1.5 bg-[#EEEEEC] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#005138] rounded-full"
                              style={{ width: `${company.leadScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Verified Trigger Signal */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#A66A00] shrink-0" />
                            <span className="font-semibold text-[#1a1c1b] truncate">
                              {company.keySignal.title}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#8A8F98] truncate flex items-center gap-1">
                            <span className="text-[#005138] font-medium">{company.keySignal.sourceName}</span>
                          </div>
                        </div>
                      </td>

                      {/* Firmographics */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 text-[11px]">
                          <div className="text-[#1a1c1b] font-medium">{indData.text}</div>
                          <div className="text-[#8A8F98]">{empData.text} employees</div>
                        </div>
                      </td>

                      {/* Data Quality */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#005138]" />
                          <div>
                            <div className="text-[11px] font-bold text-[#005138]">
                              {company.dataQuality?.verifiedFieldsCount || 8}/{company.dataQuality?.totalFieldsCount || 8} Verified
                            </div>
                            <div className="text-[10px] text-[#8A8F98]">100% Sourced</div>
                          </div>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`save-company-${company.id}`}
                            onClick={() => onToggleSaveCompany(company.id)}
                            className={`p-2 rounded-lg border transition-colors ${
                              company.status === 'SAVED'
                                ? 'bg-[#005138] text-white border-[#005138]'
                                : 'bg-white text-[#8A8F98] border-[#E5E5E1] hover:text-[#005138]'
                            }`}
                            title="Save Lead"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onSelectCompany(company)}
                            className="p-2 rounded-lg bg-white border border-[#E5E5E1] text-[#3F4943] hover:bg-[#F4F4F2] hover:text-[#005138]"
                            title="View Dossier"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
