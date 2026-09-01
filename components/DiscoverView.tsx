'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { SearchFilterState } from '@/lib/types';
import CompanyLogo from './CompanyLogo';

interface DiscoverViewProps {
  onExecuteSearch: (filters: SearchFilterState) => void;
  isAnalyzing: boolean;
}

const POPULAR_PROMPTS = [
  'Mid-market SaaS companies in the US with 500-1000 employees actively hiring sales reps',
  'Series B+ FinTech startups in New York expanding transatlantic operations',
  'Enterprise AI & MLOps infrastructure companies with >100 headcount',
  'Supply chain and logistics firms undergoing cloud ERP modernization',
];

const INDUSTRIES = [
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
  'United States',
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Boston, MA',
  'Chicago, IL',
  'United Kingdom',
  'Western Europe',
];

const SIZES = ['1 - 50', '51 - 200', '201 - 500', '500 - 1000', '1,000+'];

export default function DiscoverView({ onExecuteSearch, isAnalyzing }: DiscoverViewProps) {
  const [prompt, setPrompt] = useState(
    'Mid-market B2B SaaS companies in the US with 500-1000 employees actively hiring sales reps'
  );
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['B2B SaaS']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['United States']);
  const [selectedSize, setSelectedSize] = useState<string>('500 - 1000');
  const [keywords, setKeywords] = useState('Salesforce, Cloud, Enterprise GTM, Expansion');
  const [showAdvanced, setShowAdvanced] = useState(true);

  const [advancedFilters, setAdvancedFilters] = useState({
    revenue: true, // >$10M ARR
    funding: true, // Series B+
    growthRate: true, // >30% YoY
    activelyHiring: true, // Active hiring
    techStack: true, // Enterprise CRM
  });

  const [customFilters, setCustomFilters] = useState<string[]>(['SOC2 Certified']);
  const [customFilterInput, setCustomFilterInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  const toggleIndustry = (ind: string) => {
    if (selectedIndustries.includes(ind)) {
      if (selectedIndustries.length > 1) {
        setSelectedIndustries(selectedIndustries.filter((i) => i !== ind));
      }
    } else {
      setSelectedIndustries([...selectedIndustries, ind]);
    }
  };

  const toggleLocation = (loc: string) => {
    if (selectedLocations.includes(loc)) {
      if (selectedLocations.length > 1) {
        setSelectedLocations(selectedLocations.filter((l) => l !== loc));
      }
    } else {
      setSelectedLocations([...selectedLocations, loc]);
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

  return (
    <div id="discover-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Search Header Banner */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#A4F3CC] text-[#005138]">
            AI Prospecting Engine
          </span>
          <span className="text-xs text-[#8A8F98]">· Updated 12 minutes ago</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1a1c1b] tracking-tight">
          Find & Qualify High-Fit Accounts
        </h2>
        <p className="text-xs text-[#3F4943] max-w-2xl">
          Search with natural language or refine your target ICP using multi-factor firmographics, live hiring velocity, and executive buying signals.
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
            placeholder="e.g., Mid-market SaaS companies in the US with 500-1000 employees actively hiring sales reps..."
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

        {/* Suggested Prompts */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-[#8A8F98] uppercase tracking-wider">
            Quick Prompts
          </div>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                id={`preset-prompt-${idx}`}
                onClick={() => setPrompt(p)}
                className="text-left px-3 py-1.5 rounded-lg bg-[#F4F4F2] hover:bg-[#EEEEEC] border border-[#E5E5E1] text-xs text-[#3F4943] hover:text-[#1a1c1b] transition-all truncate max-w-md flex items-center gap-1.5"
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
              <span className="text-xs text-[#8A8F98]">Lead Matrix Matrix v3.7</span>
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
                  className="w-full px-3 py-2 text-xs bg-[#F9F9F7] text-[#1a1c1b] border border-[#E5E5E1] rounded-lg focus:bg-white focus:border-[#005138] focus:ring-1 focus:ring-[#A4F3CC] outline-none"
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
                  className="flex items-center gap-2 text-xs font-bold text-[#005138] hover:text-[#176B4D]"
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        advancedFilters.techStack
                          ? 'bg-[#A4F3CC] border-[#005138] text-[#005138] font-semibold'
                          : 'bg-white border-[#E5E5E1] text-[#3F4943]'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${advancedFilters.techStack ? 'text-[#005138]' : 'text-[#8A8F98]'}`}
                      />
                      <span>Enterprise CRM Detected</span>
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
                          className="hover:text-[#B42318]"
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
                          className="px-2 py-1 text-xs rounded bg-[#005138] text-white font-medium"
                        >
                          Add
                        </button>
                      </form>
                    ) : (
                      <button
                        id="add-custom-filter-btn"
                        onClick={() => setIsAddingCustom(true)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-dashed border-[#D6D6D0] text-[#3F4943] hover:border-[#005138] hover:text-[#005138] transition-colors"
                      >
                        + Add Custom Filter
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prominent Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#005138] text-white shadow-md">
            <div>
              <h4 className="text-base font-bold tracking-tight">Ready to Run Intelligence Engine</h4>
              <p className="text-xs text-[#A4F3CC]">
                127 accounts ready for real-time signal cross-referencing and scoring.
              </p>
            </div>
            <button
              id="execute-find-leads-btn"
              onClick={handleRunSearch}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-[#F9F9F7] text-[#005138] font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#005138]" />
              <span>{isAnalyzing ? 'Analyzing Accounts...' : 'Find & Analyze Leads'}</span>
              <ArrowRight className="w-4 h-4 text-[#005138]" />
            </button>
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
                <span className="text-3xl font-extrabold text-[#1a1c1b] tracking-tight">127</span>
                <span className="text-xs font-medium text-[#237A52] flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18 new this week</span>
                </span>
              </div>
              <p className="text-xs text-[#8A8F98]">Total ranked companies matching current criteria</p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1]">
                  <p className="text-[11px] text-[#8A8F98]">High Priority</p>
                  <p className="text-lg font-bold text-[#005138]">32 Leads</p>
                  <p className="text-[10px] text-[#237A52]">Score &gt; 90</p>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1]">
                  <p className="text-[11px] text-[#8A8F98]">Strong Fit</p>
                  <p className="text-lg font-bold text-[#1a1c1b]">58 Leads</p>
                  <p className="text-[10px] text-[#3F4943]">Score 80-89</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E5E5E1]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#3F4943]">ICP Fit Quality</span>
                  <span className="font-bold text-[#005138]">89% Match</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EEEEEC] overflow-hidden">
                  <div className="h-full bg-[#005138] rounded-full" style={{ width: '89%' }}></div>
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
                    <CompanyLogo company={{ name: 'Cloudflare, Inc.', domain: 'cloudflare.com', badgeColor: '#F6821F' }} size="xs" />
                    <span className="text-xs font-bold text-[#1a1c1b]">Cloudflare, Inc.</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#237A52] bg-[#A4F3CC]/50 px-1.5 py-0.5 rounded">18m ago</span>
                </div>
                <p className="text-xs text-[#3F4943]">
                  SEC EDGAR filing and jobs API confirmed 42 new Enterprise SDR & Sales Engineering positions opened.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                    VERIFIED SEC.GOV
                  </span>
                  <span className="text-[10px] text-[#8A8F98]">SEC EDGAR #0001477333</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CompanyLogo company={{ name: 'Datadog, Inc.', domain: 'datadoghq.com', badgeColor: '#632CA6' }} size="xs" />
                    <span className="text-xs font-bold text-[#1a1c1b]">Datadog, Inc.</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#237A52] bg-[#A4F3CC]/50 px-1.5 py-0.5 rounded">1h ago</span>
                </div>
                <p className="text-xs text-[#3F4943]">
                  Actively recruiting 14+ Enterprise SDRs and RevOps managers across NYC and EMEA hubs.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                    VERIFIED PORTAL
                  </span>
                  <span className="text-[10px] text-[#8A8F98]">datadoghq.com/careers</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CompanyLogo company={{ name: 'Snowflake Inc.', domain: 'snowflake.com', badgeColor: '#29B5E8' }} size="xs" />
                    <span className="text-xs font-bold text-[#1a1c1b]">Snowflake Inc.</span>
                  </div>
                  <span className="text-[10px] font-medium text-[#237A52] bg-[#A4F3CC]/50 px-1.5 py-0.5 rounded">3h ago</span>
                </div>
                <p className="text-xs text-[#3F4943]">
                  Cortex AI enterprise engine adoption expanded across 1,800+ Fortune 500 accounts.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                    VERIFIED EDGAR
                  </span>
                  <span className="text-[10px] text-[#8A8F98]">SEC EDGAR #0001640147</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
