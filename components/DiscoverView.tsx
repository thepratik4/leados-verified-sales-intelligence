'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  X,
  ArrowRight,
  TrendingUp,
  Building2,
  MapPin,
  Users,
  Tag,
  Clock,
  CheckCircle2,
  Zap,
  Globe,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { SearchFilterState } from '@/lib/types';
import CompanyLogo from './CompanyLogo';

interface DiscoverViewProps {
  onExecuteSearch: (filters: SearchFilterState) => void;
  isAnalyzing: boolean;
}

const POPULAR_PROMPTS = [
  'Breakout B2B SaaS & underdog startups with <100 employees actively hiring',
  'Mid-market SaaS companies in the US with 500-1000 employees actively hiring sales reps',
  'Series B+ FinTech startups in New York expanding transatlantic operations',
  'High-growth AI & Developer Infrastructure startups with modern GTM stack',
  'Supply chain and logistics firms undergoing cloud ERP modernization',
  'Cybersecurity companies with >30% YoY growth',
];

const INDUSTRIES = [
  'All',
  'B2B SaaS',
  'FinTech',
  'Supply Chain',
  'Cybersecurity',
  'Healthcare IT',
  'AI / Cloud',
  'Aerospace & Defense',
  'E-Commerce Tech',
];

const LOCATIONS = [
  'All Locations',
  'United States',
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Boston, MA',
  'Chicago, IL',
  'United Kingdom',
  'Western Europe',
];

const SIZES = ['All', '1 - 50', '51 - 200', '201 - 500', '500 - 1000', '1,000+'];

export default function DiscoverView({ onExecuteSearch, isAnalyzing }: DiscoverViewProps) {
  const [prompt, setPrompt] = useState(
    'Breakout B2B SaaS & underdog startups with high-velocity hiring'
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['B2B SaaS']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['United States']);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [keywords, setKeywords] = useState('Salesforce, Cloud, Enterprise GTM, Expansion');
  const [showAdvanced, setShowAdvanced] = useState(true);

  const [advancedFilters, setAdvancedFilters] = useState({
    revenue: false, // Don't restrict by default so underdog companies are included!
    funding: false, // Don't restrict by default
    growthRate: true, // >30% YoY
    activelyHiring: true, // Active hiring
    techStack: true, // Modern Tech Stack
  });

  const [customFilters, setCustomFilters] = useState<string[]>(['SOC2 Certified']);
  const [customFilterInput, setCustomFilterInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const toggleIndustry = (ind: string) => {
    if (ind === 'All') {
      setSelectedIndustries(['All']);
      return;
    }
    const withoutAll = selectedIndustries.filter((i) => i !== 'All');
    if (withoutAll.includes(ind)) {
      const remaining = withoutAll.filter((i) => i !== ind);
      setSelectedIndustries(remaining.length > 0 ? remaining : ['All']);
    } else {
      setSelectedIndustries([...withoutAll, ind]);
    }
  };

  const toggleLocation = (loc: string) => {
    if (loc === 'All Locations' || loc === 'All') {
      setSelectedLocations(['All Locations']);
      return;
    }
    const withoutAll = selectedLocations.filter((l) => l !== 'All Locations' && l !== 'All');
    if (withoutAll.includes(loc)) {
      const remaining = withoutAll.filter((l) => l !== loc);
      setSelectedLocations(remaining.length > 0 ? remaining : ['All Locations']);
    } else {
      setSelectedLocations([...withoutAll, loc]);
    }
  };

  const handleAddCustomFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (customFilterInput.trim()) {
      setCustomFilters([...customFilters, customFilterInput.trim()]);
      setCustomFilterInput('');
      setIsAddingCustom(false);
    }
  };

  const removeCustomFilter = (filter: string) => {
    setCustomFilters(customFilters.filter((f) => f !== filter));
  };

  const handleResetFilters = () => {
    setSelectedIndustries(['B2B SaaS']);
    setSelectedLocations(['United States']);
    setSelectedSize('All');
    setKeywords('Salesforce, Cloud, Enterprise GTM, Expansion');
    setAdvancedFilters({
      revenue: false,
      funding: false,
      growthRate: true,
      activelyHiring: true,
      techStack: true,
    });
    setCustomFilters(['SOC2 Certified']);
  };

  const handleRunSearch = () => {
    onExecuteSearch({
      aiPrompt: prompt,
      industries: selectedIndustries,
      locations: selectedLocations,
      companySize: selectedSize,
      keywords,
      advancedFilters,
      customFilters,
    });
  };

  // Dynamic estimated reach computation
  const estimatedReach = useMemo(() => {
    let base = 32;
    if (selectedIndustries.includes('All')) base = 32;
    else base = Math.max(6, selectedIndustries.length * 6);
    if (selectedSize === '1 - 50') base = 9;
    if (selectedSize === '51 - 200') base = 8;
    if (selectedSize === '201 - 500') base = 6;
    if (selectedSize === '500 - 1000') base = 7;
    if (selectedSize === '1,000+') base = 12;
    return base;
  }, [selectedIndustries, selectedSize]);

  return (
    <div id="discover-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Search Header Banner */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#A4F3CC] text-[#005138]">
            AI Prospecting Engine
          </span>
          <span className="text-xs text-[#8A8F98]">· Live Verified Registries & SEC Data</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1c1b] tracking-tight">
          Find & Qualify High-Fit Accounts
        </h2>
        <p className="text-xs text-[#3F4943] max-w-2xl">
          Discover enterprise leaders and breakout underdog tech companies with verified hiring velocity and executive trigger signals.
        </p>
      </div>

      {/* Main AI Natural Language Prompt Card */}
      <div
        id="natural-language-search-card"
        className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <label
            htmlFor="ai-search-prompt-input"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#005138]"
          >
            <Sparkles className="w-4 h-4 text-[#005138]" />
            <span>AI Search Assistant</span>
          </label>
          <span className="text-[11px] text-[#8A8F98]">LeadOS v3.7 NLP Parser</span>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <textarea
              id="ai-search-prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                  handleRunSearch();
                }
              }}
              rows={2}
              className="w-full p-4 pr-12 text-sm bg-[#F9F9F7] text-[#1a1c1b] border border-[#E5E5E1] rounded-xl focus:bg-white focus:border-[#005138] focus:ring-2 focus:ring-[#A4F3CC] transition-all outline-none resize-none font-medium leading-relaxed"
              placeholder="e.g., Breakout B2B SaaS underdog startups with <100 employees actively hiring..."
            />
            {prompt && (
              <button
                id="clear-search-prompt-btn"
                onClick={() => setPrompt('')}
                className="absolute top-4 right-4 p-1 rounded-md text-[#8A8F98] hover:text-[#1a1c1b] hover:bg-[#EEEEEC] transition-colors"
                title="Clear search prompt"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Unified Primary Search Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-[#F4F4F2]">
            <div className="text-[11px] text-[#8A8F98] flex items-center gap-1.5 self-start sm:self-center">
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#EEEEEC] border border-[#D6D6D0] rounded">
                ⌘ Enter
              </kbd>
              <span>or</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-[#EEEEEC] border border-[#D6D6D0] rounded">
                Ctrl Enter
              </kbd>
              <span>to launch discovery</span>
            </div>

            <button
              id="primary-find-leads-btn"
              onClick={handleRunSearch}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#005138] hover:bg-[#176B4D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Accounts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#A4F3CC]" />
                  <span>Find & Analyze Leads</span>
                  <ArrowRight className="w-4 h-4 text-[#A4F3CC]" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="space-y-2 pt-2 border-t border-[#E5E5E1]">
          <div className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider">
            Quick Prompts
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                id={`preset-prompt-${idx}`}
                onClick={() => setPrompt(p)}
                className="text-left px-3 py-1.5 rounded-lg bg-[#F4F4F2] hover:bg-[#EEEEEC] border border-[#E5E5E1] text-xs text-[#3F4943] hover:text-[#1a1c1b] transition-all truncate max-w-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-[#005138] shrink-0" />
                <span className="truncate">{p}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Bento Search Builder (Left) + Intelligence Overview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Bento Search Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#005138]" />
                <h3 className="text-sm font-bold text-[#1a1c1b] tracking-tight">
                  Structured ICP Parameters
                </h3>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#8A8F98] hover:text-[#005138] flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Parameters</span>
              </button>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Industry */}
              <div id="industry-selector-block" className="space-y-2.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1c1b]">
                  <Building2 className="w-3.5 h-3.5 text-[#005138]" />
                  <span>Target Industry</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {INDUSTRIES.map((ind) => {
                    const isSelected = selectedIndustries.includes(ind);
                    return (
                      <button
                        key={ind}
                        id={`industry-chip-${ind.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        onClick={() => toggleIndustry(ind)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#005138] text-white shadow-xs font-semibold'
                            : 'bg-[#F4F4F2] text-[#3F4943] hover:bg-[#EEEEEC] border border-[#E5E5E1]'
                        }`}
                      >
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Location */}
              <div id="location-selector-block" className="space-y-2.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1c1b]">
                  <MapPin className="w-3.5 h-3.5 text-[#005138]" />
                  <span>Geographic Focus</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {LOCATIONS.map((loc) => {
                    const isSelected = selectedLocations.includes(loc);
                    return (
                      <button
                        key={loc}
                        id={`location-chip-${loc.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        onClick={() => toggleLocation(loc)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#005138] text-white shadow-xs font-semibold'
                            : 'bg-[#F4F4F2] text-[#3F4943] hover:bg-[#EEEEEC] border border-[#E5E5E1]'
                        }`}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Company Size */}
              <div id="size-selector-block" className="space-y-2.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1c1b]">
                  <Users className="w-3.5 h-3.5 text-[#005138]" />
                  <span>Company Headcount</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SIZES.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        id={`size-chip-${sz.replace(/[^a-z0-9]/g, '-')}`}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#005138] text-white shadow-xs font-semibold'
                            : 'bg-[#F4F4F2] text-[#3F4943] hover:bg-[#EEEEEC] border border-[#E5E5E1]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Keywords & Tech Signals */}
              <div id="keywords-selector-block" className="space-y-2.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1c1b]">
                  <Tag className="w-3.5 h-3.5 text-[#005138]" />
                  <span>Keywords & Tech Stack</span>
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#F9F9F7] text-[#1a1c1b] border border-[#E5E5E1] rounded-lg focus:bg-white focus:border-[#005138] focus:ring-1 focus:ring-[#A4F3CC] outline-none font-medium"
                  placeholder="e.g. Salesforce, Cloud, SOC2, Modern GTM"
                />
              </div>
            </div>

            {/* Advanced Filters Expandable Section */}
            <div className="border-t border-[#E5E5E1] pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  id="toggle-advanced-filters-btn"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs font-bold text-[#005138] hover:text-[#176B4D] cursor-pointer"
                >
                  <span>Advanced Criteria Filters</span>
                  <span className="text-[10px] text-[#8A8F98]">
                    ({Object.values(advancedFilters).filter(Boolean).length} Active)
                  </span>
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap gap-2">
                    <button
                      id="filter-revenue"
                      onClick={() =>
                        setAdvancedFilters({ ...advancedFilters, revenue: !advancedFilters.revenue })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        advancedFilters.revenue
                          ? 'bg-[#A4F3CC] border-[#005138] text-[#005138] font-semibold'
                          : 'bg-white border-[#E5E5E1] text-[#3F4943]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${advancedFilters.revenue ? 'text-[#005138]' : 'text-[#8A8F98]'}`}
                      />
                      <span>Revenue &gt; $10M ARR</span>
                    </button>

                    <button
                      id="filter-funding"
                      onClick={() =>
                        setAdvancedFilters({ ...advancedFilters, funding: !advancedFilters.funding })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        advancedFilters.funding
                          ? 'bg-[#A4F3CC] border-[#005138] text-[#005138] font-semibold'
                          : 'bg-white border-[#E5E5E1] text-[#3F4943]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${advancedFilters.funding ? 'text-[#005138]' : 'text-[#8A8F98]'}`}
                      />
                      <span>Funding Series B+</span>
                    </button>

                    <button
                      id="filter-growth"
                      onClick={() =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          growthRate: !advancedFilters.growthRate,
                        })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        advancedFilters.growthRate
                          ? 'bg-[#A4F3CC] border-[#005138] text-[#005138] font-semibold'
                          : 'bg-white border-[#E5E5E1] text-[#3F4943]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${advancedFilters.growthRate ? 'text-[#005138]' : 'text-[#8A8F98]'}`}
                      />
                      <span>Growth &gt; 30% YoY</span>
                    </button>

                    <button
                      id="filter-hiring"
                      onClick={() =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          activelyHiring: !advancedFilters.activelyHiring,
                        })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        advancedFilters.activelyHiring
                          ? 'bg-[#A4F3CC] border-[#005138] text-[#005138] font-semibold'
                          : 'bg-white border-[#E5E5E1] text-[#3F4943]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${advancedFilters.activelyHiring ? 'text-[#005138]' : 'text-[#8A8F98]'}`}
                      />
                      <span>Actively Hiring Sales/Eng</span>
                    </button>

                    <button
                      id="filter-tech"
                      onClick={() =>
                        setAdvancedFilters({
                          ...advancedFilters,
                          techStack: !advancedFilters.techStack,
                        })
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        advancedFilters.techStack
                          ? 'bg-[#A4F3CC] border-[#005138] text-[#005138] font-semibold'
                          : 'bg-white border-[#E5E5E1] text-[#3F4943]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${advancedFilters.techStack ? 'text-[#005138]' : 'text-[#8A8F98]'}`}
                      />
                      <span>Enterprise CRM / Tech Stack</span>
                    </button>

                    {/* Custom filters */}
                    {customFilters.map((cf) => (
                      <span
                        key={cf}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F4F4F2] border border-[#005138] text-[#005138]"
                      >
                        <span>{cf}</span>
                        <button
                          onClick={() => removeCustomFilter(cf)}
                          className="hover:text-[#B42318] cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    {isAddingCustom ? (
                      <form onSubmit={handleAddCustomFilter} className="inline-flex items-center gap-1">
                        <input
                          type="text"
                          value={customFilterInput}
                          onChange={(e) => setCustomFilterInput(e.target.value)}
                          placeholder="e.g. AWS GovCloud"
                          autoFocus
                          className="px-2 py-1 text-xs rounded border border-[#005138] outline-none"
                        />
                        <button
                          type="submit"
                          className="px-2 py-1 text-xs rounded bg-[#005138] text-white font-medium cursor-pointer"
                        >
                          Add
                        </button>
                      </form>
                    ) : (
                      <button
                        id="add-custom-filter-btn"
                        onClick={() => setIsAddingCustom(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-dashed border-[#D6D6D0] text-[#3F4943] hover:border-[#005138] hover:text-[#005138] transition-colors cursor-pointer"
                      >
                        + Add Custom Filter
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Estimated Reach & Signal Monitor */}
        <div className="space-y-6">
          {/* Estimated Reach Card */}
          <div
            id="estimated-reach-card"
            className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1a1c1b]">
                Estimated Reach
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A4F3CC] text-[#005138]">
                LIVE INDEX
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-[#1a1c1b] tracking-tight">{estimatedReach}</span>
                <span className="text-xs font-medium text-[#237A52] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18 new this week</span>
                </span>
              </div>
              <p className="text-xs text-[#8A8F98]">Total ranked companies matching current criteria</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1]">
                  <p className="text-[11px] text-[#8A8F98]">High Priority</p>
                  <p className="text-lg font-bold text-[#005138]">{Math.max(4, Math.round(estimatedReach * 0.4))} Leads</p>
                  <p className="text-[10px] text-[#237A52]">Score &gt; 90</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1]">
                  <p className="text-[11px] text-[#8A8F98]">Strong Fit</p>
                  <p className="text-lg font-bold text-[#1a1c1b]">{Math.max(4, Math.round(estimatedReach * 0.5))} Leads</p>
                  <p className="text-[10px] text-[#3F4943]">Score 80-89</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E5E5E1]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#3F4943]">ICP Fit Quality</span>
                  <span className="font-bold text-[#005138]">94% Match</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EEEEEC] overflow-hidden">
                  <div className="h-full bg-[#005138] rounded-full transition-all duration-300" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Signals Feed */}
          <div
            id="live-signals-ticker-card"
            className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#A66A00]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a1c1b]">
                  Real-time Signals
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#237A52] animate-ping"></span>
                <span className="text-[10px] text-[#237A52] font-semibold">LIVE</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CompanyLogo company={{ name: 'Resend', domain: 'resend.com' }} size="xs" />
                    <span className="text-xs font-bold text-[#1a1c1b]">Resend</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#237A52] bg-[#A4F3CC]/50 px-1.5 py-0.5 rounded">12m ago</span>
                </div>
                <p className="text-xs text-[#3F4943]">
                  Hiring surge: 6 new Full-Stack & Developer Experience roles added to official careers portal.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                    VERIFIED CAREERS
                  </span>
                  <span className="text-[10px] text-[#8A8F98]">resend.com/careers</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CompanyLogo company={{ name: 'PostHog', domain: 'posthog.com' }} size="xs" />
                    <span className="text-xs font-bold text-[#1a1c1b]">PostHog</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#237A52] bg-[#A4F3CC]/50 px-1.5 py-0.5 rounded">45m ago</span>
                </div>
                <p className="text-xs text-[#3F4943]">
                  Reached $25M ARR milestone with 85 team members across US & Europe.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                    VERIFIED PRODUCT
                  </span>
                  <span className="text-[10px] text-[#8A8F98]">posthog.com/blog</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CompanyLogo company={{ name: 'Clay', domain: 'clay.com' }} size="xs" />
                    <span className="text-xs font-bold text-[#1a1c1b]">Clay</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#237A52] bg-[#A4F3CC]/50 px-1.5 py-0.5 rounded">2h ago</span>
                </div>
                <p className="text-xs text-[#3F4943]">
                  Raised $62M Series B from Meritech Capital and Sequoia; actively hiring 14 Enterprise SDRs in NYC.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                    VERIFIED SEC FORM D
                  </span>
                  <span className="text-[10px] text-[#8A8F98]">clay.com/careers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
