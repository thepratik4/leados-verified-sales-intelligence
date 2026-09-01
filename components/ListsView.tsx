'use client';

import React, { useState } from 'react';
import {
  Folder,
  Plus,
  Search,
  MoreVertical,
  Users,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { LeadCohortList, CompanyLead } from '@/lib/types';
import CompanyLogo from './CompanyLogo';

interface ListsViewProps {
  lists: LeadCohortList[];
  companies: CompanyLead[];
  onCreateList: () => void;
  onOpenListLeads: (list: LeadCohortList) => void;
  onDeleteList: (listId: string) => void;
  onExportList: (list: LeadCohortList) => void;
}

export default function ListsView({
  lists,
  companies,
  onCreateList,
  onOpenListLeads,
  onDeleteList,
  onExportList,
}: ListsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedList, setSelectedList] = useState<LeadCohortList | null>(lists[0] || null);

  const filteredLists = lists.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentListCompanies = selectedList
    ? companies.filter((c) => selectedList.companyIds.includes(c.id))
    : [];

  const getColorClass = (type?: string) => {
    switch (type) {
      case 'warning':
        return 'bg-[#A66A00]/10 text-[#A66A00] border-[#A66A00]/30';
      case 'info':
        return 'bg-[#315F9B]/10 text-[#315F9B] border-[#315F9B]/30';
      case 'success':
        return 'bg-[#237A52]/10 text-[#237A52] border-[#237A52]/30';
      default:
        return 'bg-[#005138]/10 text-[#005138] border-[#005138]/30';
    }
  };

  return (
    <div id="cohort-lists-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138] uppercase tracking-wider">
              Segment Engine
            </span>
            <span className="text-xs text-[#8A8F98]">· {lists.length} Active Cohorts</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1c1b] tracking-tight">Cohort Lists</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="create-cohort-list-btn"
            onClick={onCreateList}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Cohort List</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A8F98] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter saved cohort lists..."
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white text-[#1a1c1b] rounded-xl border border-[#E5E5E1] focus:border-[#005138] focus:ring-1 focus:ring-[#A4F3CC] outline-none"
        />
      </div>

      {/* Cohort Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredLists.map((list) => {
          const isSelected = selectedList?.id === list.id;
          return (
            <div
              key={list.id}
              onClick={() => setSelectedList(list)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-white border-[#005138] ring-2 ring-[#A4F3CC] shadow-sm'
                  : 'bg-white border-[#E5E5E1] hover:border-[#D6D6D0] hover:shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl border ${getColorClass(list.colorType)}`}>
                  <Folder className="w-5 h-5" />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteList(list.id);
                  }}
                  className="text-[#8A8F98] hover:text-[#B42318] p-1 rounded transition-colors"
                  title="Delete list"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#1a1c1b]">{list.name}</h3>
                <p className="text-xs text-[#8A8F98] line-clamp-2 mt-0.5">{list.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F4F4F2] text-xs">
                <span className="font-bold text-[#005138]">{list.leadCount} Accounts</span>
                <span className="text-[10px] text-[#8A8F98]">{list.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Cohort Detail Preview */}
      {selectedList && (
        <div className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E1] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#1a1c1b]">{selectedList.name}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                  {selectedList.leadCount} Leads
                </span>
              </div>
              <p className="text-xs text-[#8A8F98] mt-0.5">{selectedList.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onExportList(selectedList)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E1] hover:bg-[#F4F4F2] text-xs font-semibold text-[#1a1c1b]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Cohort</span>
              </button>

              <button
                onClick={() => onOpenListLeads(selectedList)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-bold shadow-xs"
              >
                <span>View in Results Table</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Companies in this cohort */}
          <div className="divide-y divide-[#E5E5E1]">
            {currentListCompanies.length === 0 ? (
              <div className="py-8 text-center text-[#8A8F98] text-xs">
                No companies populated yet in this cohort. Select leads from Search Results to add them.
              </div>
            ) : (
              currentListCompanies.map((comp) => (
                <div
                  key={comp.id}
                  className="py-3 flex items-center justify-between hover:bg-[#F9F9F7] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CompanyLogo company={comp} size="sm" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#1a1c1b]">{comp.name}</span>
                        <span className="text-[11px] text-[#8A8F98]">({comp.domain})</span>
                      </div>
                      <span className="text-[11px] text-[#3F4943]">{comp.keySignal.title}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#005138]">
                      Score {comp.leadScore}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
