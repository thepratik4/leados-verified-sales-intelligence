'use client';

import React, { useState, useEffect } from 'react';
import Sidebar, { USER_AVATAR_URL } from '@/components/Sidebar';
import Header from '@/components/Header';
import DiscoverView from '@/components/DiscoverView';
import ResultsView from '@/components/ResultsView';
import LeadDossierView from '@/components/LeadDossierView';
import SavedSearchesView from '@/components/SavedSearchesView';
import ListsView from '@/components/ListsView';
import ActivityLogView from '@/components/ActivityLogView';
import SettingsView from '@/components/SettingsView';

import AnalyzingModal from '@/components/AnalyzingModal';
import OutreachModal from '@/components/OutreachModal';
import AddToListModal from '@/components/AddToListModal';
import ExportModal from '@/components/ExportModal';
import QuickSearchModal from '@/components/QuickSearchModal';

import { CompanyLead, LeadCohortList, ActivityEvent } from '@/lib/types';
import { getFieldValue } from '@/lib/provenance-utils';
import {
  INITIAL_COMPANIES,
  INITIAL_LISTS,
  INITIAL_ACTIVITIES,
} from '@/lib/initial-data';

export default function LeadOSApp() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('DISCOVER');

  // Application Data State
  const [companies, setCompanies] = useState<CompanyLead[]>(INITIAL_COMPANIES);
  const [cohortLists, setCohortLists] = useState<LeadCohortList[]>(INITIAL_LISTS);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  // Selected Entities
  const [selectedCompany, setSelectedCompany] = useState<CompanyLead | null>(null);
  const [activeCohortFilter, setActiveCohortFilter] = useState<string | null>(null);

  // Modal States
  const [isAnalyzingOpen, setIsAnalyzingOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [analyzingSummary, setAnalyzingSummary] = useState('');
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);
  const [outreachCompany, setOutreachCompany] = useState<CompanyLead | null>(null);
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [selectedIdsForList, setSelectedIdsForList] = useState<string[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSearchSummary, setLastSearchSummary] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Keyboard shortcut ⌘K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 1. Handle Search Trigger from Discover Screen
  const handleInitiateSearch = async (query: string, filters: any) => {
    const queryLabel = query || (filters?.industries?.length ? `${filters.industries.join(', ')} (${filters.locations?.join(', ') || 'Global'})` : 'High-Growth Tech Accounts');
    setAnalyzingSummary(`Searching "${queryLabel}" across live job boards, SEC filings & firmographics...`);
    setIsAnalyzingOpen(true);
    setIsSearchLoading(true);

    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          filters,
          existingCompanyIds: companies.map((c) => c.id),
        }),
      });
      const data = await res.json();

      if (data.results && Array.isArray(data.results)) {
        setCompanies((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newLeads = data.results.filter((r: CompanyLead) => !existingIds.has(r.id));

          if (newLeads.length > 0) {
            return [...newLeads, ...prev];
          }
          return data.results;
        });
        setLastSearchSummary(data.summary || `Discovered ${data.results.length} verified accounts for "${queryLabel}"`);
      }
    } catch (e) {
      console.error('Search API error', e);
    } finally {
      setIsSearchLoading(false);
    }

    // Add activity event
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      title: `Live intelligence search completed`,
      description: `Executed query for "${query || 'B2B SaaS with SDR hiring'}" and expanded qualified accounts pipeline.`,
      time: 'Just now',
      dateGroup: 'TODAY',
      type: 'search',
      isAiAnalysis: true,
      actionLabel: 'View Results',
      actionTarget: { tab: 'RESULTS' },
    };
    setActivityEvents((prev) => [newEvent, ...prev]);
  };

  const handleAnalysisCompleted = () => {
    setIsAnalyzingOpen(false);
    setCurrentTab('RESULTS');
    showToast(`Ranked verified accounts matching your search criteria.`);
  };

  // 2. Lead Selection & Dossier
  const handleSelectCompany = (company: CompanyLead) => {
    setSelectedCompany(company);
    setCurrentTab('DOSSIER');

    // Add to activity
    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      title: `Viewed intelligence dossier for ${company.name}`,
      description: `Synthesized why-this-lead reasons and sales intelligence for ${company.name} (${company.domain}).`,
      time: 'Just now',
      dateGroup: 'TODAY',
      type: 'bookmark',
      isAiAnalysis: true,
      actionLabel: 'View Dossier',
      actionTarget: { tab: 'DOSSIER', entityId: company.id },
    };
    setActivityEvents((prev) => [newEvent, ...prev]);
  };

  // 3. Toggle Bookmark / Save
  const handleToggleSaveCompany = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === companyId) {
          const newStatus = c.status === 'SAVED' ? 'NEW' : 'SAVED';
          if (newStatus === 'SAVED') {
            showToast(`Saved ${c.name} to workspace repository`);
          } else {
            showToast(`Removed ${c.name} from saved leads`);
          }
          return { ...c, status: newStatus };
        }
        return c;
      })
    );
  };

  // 4. Add to List Modal Handlers
  const handleOpenAddToList = (companyIds: string[]) => {
    setSelectedIdsForList(companyIds);
    setIsAddToListOpen(true);
  };

  const handleConfirmAddToList = (listId: string, companyIds: string[]) => {
    setCohortLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          const combined = Array.from(new Set([...l.companyIds, ...companyIds]));
          return { ...l, companyIds: combined, leadCount: combined.length };
        }
        return l;
      })
    );
    showToast(`Added ${companyIds.length} leads to list`);
  };

  const handleCreateAndAddToList = (newListName: string, companyIds: string[]) => {
    const newList: LeadCohortList = {
      id: `list-${Date.now()}`,
      name: newListName,
      description: `Custom cohort created with ${companyIds.length} high-intent accounts`,
      leadCount: companyIds.length,
      lastUpdated: 'Just now',
      colorType: 'primary',
      companyIds: companyIds,
    };
    setCohortLists((prev) => [newList, ...prev]);
    showToast(`Created list "${newListName}" with ${companyIds.length} leads`);

    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      title: `Created cohort list: ${newListName}`,
      description: `Saved ${companyIds.length} verified accounts to cohort list.`,
      time: 'Just now',
      dateGroup: 'TODAY',
      type: 'list_created',
      actionLabel: 'Open List',
      actionTarget: { tab: 'LISTS', entityId: newList.id },
    };
    setActivityEvents((prev) => [newEvent, ...prev]);
  };

  // 5. Delete List
  const handleDeleteList = (listId: string) => {
    setCohortLists((prev) => prev.filter((l) => l.id !== listId));
    showToast('Cohort list removed');
  };

  // 6. Outreach Modal Handlers
  const handleOpenOutreachModal = (company: CompanyLead) => {
    setOutreachCompany(company);
    setIsOutreachOpen(true);
  };

  // 7. Export Handlers
  const handleExportCsv = (selectedOnly?: boolean) => {
    const targetCompanies = selectedOnly
      ? companies.filter((c) => selectedIdsForList.includes(c.id))
      : companies;

    // Generate CSV content
    const headers = [
      'Company Name',
      'Domain',
      'Industry',
      'Location',
      'Headcount',
      'Lead Score',
      'Key Trigger Signal',
      'Signal Source',
      'Why This Lead',
    ];
    const rows = targetCompanies.map((c) => [
      `"${c.name}"`,
      `"${c.domain}"`,
      `"${getFieldValue(c.industry).text}"`,
      `"${getFieldValue(c.location).text}"`,
      `"${getFieldValue(c.employeeCount).text}"`,
      c.leadScore,
      `"${c.keySignal.title.replace(/"/g, '""')}"`,
      `"${c.keySignal.sourceName}"`,
      `"${c.whyThisLead.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LeadOS_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${targetCompanies.length} accounts to CSV`);

    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      title: `Exported ${targetCompanies.length} leads to CSV`,
      description: `Generated export containing firmographics, trigger signals, and contact dossiers.`,
      time: 'Just now',
      dateGroup: 'TODAY',
      type: 'export',
      actionLabel: 'View File',
    };
    setActivityEvents((prev) => [newEvent, ...prev]);
  };

  // Navigation router helper
  const handleNavigateFromActivity = (target: { tab: string; entityId?: string }) => {
    if (target.tab === 'DOSSIER' && target.entityId) {
      const comp = companies.find((c) => c.id === target.entityId);
      if (comp) {
        setSelectedCompany(comp);
      }
    }
    setCurrentTab(target.tab);
  };

  return (
    <div id="leados-root-container" className="flex h-screen bg-[#F4F4F2] text-[#1a1c1b] overflow-hidden font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'DOSSIER') {
            // keep selectedCompany in memory but view switches
          }
        }}
        savedCount={companies.filter((c) => c.status === 'SAVED').length}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
          onOpenNotifications={() => setCurrentTab('ACTIVITY')}
          onOpenSettings={() => setCurrentTab('SETTINGS')}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {currentTab === 'DISCOVER' && (
            <DiscoverView
              onExecuteSearch={(filters) => handleInitiateSearch(filters.aiPrompt, filters)}
              isAnalyzing={isAnalyzingOpen}
            />
          )}

          {currentTab === 'RESULTS' && (
            <ResultsView
              companies={companies}
              onSelectCompany={handleSelectCompany}
              onToggleSaveCompany={handleToggleSaveCompany}
              onAddToList={handleOpenAddToList}
              onExportCsv={handleExportCsv}
              searchSummary={lastSearchSummary}
              onNavigateDiscover={() => setCurrentTab('DISCOVER')}
            />
          )}

          {currentTab === 'DOSSIER' && selectedCompany && (
            <LeadDossierView
              company={selectedCompany}
              onBack={() => setCurrentTab('RESULTS')}
              onToggleSave={handleToggleSaveCompany}
              onAddToList={handleOpenAddToList}
              onOpenOutreachModal={handleOpenOutreachModal}
            />
          )}

          {currentTab === 'SAVED_SEARCHES' && (
            <SavedSearchesView
              companies={companies}
              onSelectCompany={handleSelectCompany}
              onToggleSave={handleToggleSaveCompany}
              onAddToList={handleOpenAddToList}
              onExportCsv={handleExportCsv}
            />
          )}

          {currentTab === 'LISTS' && (
            <ListsView
              lists={cohortLists}
              companies={companies}
              onCreateList={() => {
                const name = prompt('Enter cohort list name:');
                if (name && name.trim()) {
                  handleCreateAndAddToList(name.trim(), []);
                }
              }}
              onOpenListLeads={(list) => {
                setActiveCohortFilter(list.id);
                setCurrentTab('RESULTS');
              }}
              onDeleteList={handleDeleteList}
              onExportList={(list) => {
                const listComps = companies.filter((c) => list.companyIds.includes(c.id));
                handleExportCsv();
              }}
            />
          )}

          {currentTab === 'ACTIVITY' && (
            <ActivityLogView
              activities={activityEvents}
              onNavigateAction={handleNavigateFromActivity}
              onExportLog={() => {
                showToast('Activity log exported');
              }}
            />
          )}

          {currentTab === 'SETTINGS' && <SettingsView />}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          id="toast-notification"
          className="fixed bottom-6 right-6 z-50 bg-[#005138] text-white px-4 py-3 rounded-2xl shadow-xl border border-[#176B4D] flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-5"
        >
          <div className="w-2 h-2 rounded-full bg-[#A4F3CC]"></div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AnalyzingModal
        isOpen={isAnalyzingOpen}
        isLoading={isSearchLoading}
        onComplete={handleAnalysisCompleted}
        querySummary={analyzingSummary}
      />

      <OutreachModal
        isOpen={isOutreachOpen}
        onClose={() => setIsOutreachOpen(false)}
        company={outreachCompany}
      />

      <AddToListModal
        isOpen={isAddToListOpen}
        onClose={() => setIsAddToListOpen(false)}
        lists={cohortLists}
        selectedCompanyIds={selectedIdsForList}
        onConfirmAdd={handleConfirmAddToList}
        onCreateAndAdd={handleCreateAndAddToList}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        companies={companies}
        onConfirmExport={() => handleExportCsv(false)}
      />

      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        companies={companies}
        lists={cohortLists}
        onSelectCompany={handleSelectCompany}
        onSelectList={(list) => {
          setActiveCohortFilter(list.id);
          setCurrentTab('RESULTS');
        }}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}
