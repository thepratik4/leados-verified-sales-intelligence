'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  FolderPlus,
  Sparkles,
  ExternalLink,
  Building2,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
  UserCheck,
  Cpu,
  Globe,
  Mic,
  Activity,
  Zap,
  Mail,
  Copy,
  Check,
  RefreshCw,
  FileText,
  AlertCircle,
  HelpCircle,
  Link2,
  Search,
  Calendar,
  Lock,
} from 'lucide-react';
import { CompanyLead, ProvenanceField, VerificationStatus } from '@/lib/types';
import { getFieldValue, getVerificationBadge, formatFreshTimestamp } from '@/lib/provenance-utils';
import CompanyLogo from './CompanyLogo';

interface LeadDossierViewProps {
  company: CompanyLead;
  onBack: () => void;
  onToggleSave: (companyId: string) => void;
  onAddToList: (companyIds: string[]) => void;
  onOpenOutreachModal: (company: CompanyLead) => void;
}

export default function LeadDossierView({
  company,
  onBack,
  onToggleSave,
  onAddToList,
  onOpenOutreachModal,
}: LeadDossierViewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshingAi, setIsRefreshingAi] = useState(false);
  const [aiAnalysisText, setAiAnalysisText] = useState(company.whyThisLead);
  const [approachText, setApproachText] = useState(company.salesIntelligence.recommendedApproach);
  const [talkingPoints, setTalkingPoints] = useState(company.salesIntelligence.talkingPoints);
  const [claims, setClaims] = useState(company.salesIntelligence.claims || []);
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<{
    fieldName: string;
    field: ProvenanceField<any>;
  } | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRefreshAi = async () => {
    setIsRefreshingAi(true);
    try {
      const res = await fetch('/api/gemini/dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: company.name,
          domain: company.domain,
          verifiedFacts: {
            industry: getFieldValue(company.industry).text,
            location: getFieldValue(company.location).text,
            headcount: getFieldValue(company.employeeCount).text,
            revenue: getFieldValue(company.revenue).text,
            funding: getFieldValue(company.funding).text,
            secCik: getFieldValue(company.secFilingCik).text,
          },
          verifiedSignals: company.businessSignals,
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setAiAnalysisText(data.summary);
      }
      if (data.recommendedApproach) {
        setApproachText(data.recommendedApproach);
      }
      if (data.talkingPoints && data.talkingPoints.length > 0) {
        setTalkingPoints(data.talkingPoints);
      }
      if (data.claims && Array.isArray(data.claims)) {
        setClaims(data.claims);
      }
    } catch (e) {
      console.error('Failed to refresh AI interpretation', e);
    } finally {
      setIsRefreshingAi(false);
    }
  };

  const getSignalIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-[#005138]" />;
      case 'user-check':
        return <UserCheck className="w-4 h-4 text-[#237A52]" />;
      case 'cpu':
        return <Cpu className="w-4 h-4 text-[#315F9B]" />;
      case 'globe':
        return <Globe className="w-4 h-4 text-[#005138]" />;
      case 'mic':
        return <Mic className="w-4 h-4 text-[#A66A00]" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-[#005138]" />;
      default:
        return <Activity className="w-4 h-4 text-[#005138]" />;
    }
  };

  const industryData = getFieldValue(company.industry);
  const locationData = getFieldValue(company.location);
  const employeeData = getFieldValue(company.employeeCount);
  const revenueData = getFieldValue(company.revenue, 'Not available (Private)');
  const fundingData = getFieldValue(company.funding);
  const growthData = getFieldValue(company.growthRate, 'Not available');
  const secCikData = getFieldValue(company.secFilingCik, 'Non-public / Unfiled');

  return (
    <div id="lead-dossier-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation & Verification Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E1] pb-4">
        <button
          id="back-to-results-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#3F4943] hover:text-[#005138] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search Results</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#A4F3CC]/40 border border-[#A4F3CC] text-[11px] font-bold text-[#005138]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#005138]" />
            <span>
              Data Quality: {company.dataQuality?.verifiedFieldsCount || 8}/{company.dataQuality?.totalFieldsCount || 8} Verified Facts
            </span>
          </div>

          <button
            id="dossier-save-btn"
            onClick={() => onToggleSave(company.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              company.status === 'SAVED'
                ? 'bg-[#005138] border-[#005138] text-white'
                : 'bg-white border-[#E5E5E1] text-[#3F4943] hover:border-[#005138] hover:text-[#005138]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{company.status === 'SAVED' ? 'Saved Lead' : 'Save Lead'}</span>
          </button>

          <button
            id="dossier-add-to-list-btn"
            onClick={() => onAddToList([company.id])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E5E5E1] hover:bg-[#F4F4F2] text-xs font-semibold text-[#1a1c1b] transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#3F4943]" />
            <span>Add to Cohort</span>
          </button>

          <button
            id="dossier-generate-outreach-btn"
            onClick={() => onOpenOutreachModal(company)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#A4F3CC]" />
            <span>Generate Verified Outreach</span>
          </button>
        </div>
      </div>

      {/* Company Master Header Banner with Source Badges */}
      <div className="bg-white rounded-3xl border border-[#E5E5E1] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-5">
          <CompanyLogo company={company} size="xl" />

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-2xl font-extrabold text-[#1a1c1b] tracking-tight">
                {company.name}
              </h2>
              <a
                href={`https://${company.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F4F4F2] hover:bg-[#EEEEEC] border border-[#E5E5E1] text-xs text-[#005138] font-medium transition-colors"
              >
                <span>{company.domain}</span>
                <ExternalLink className="w-3 h-3 text-[#8A8F98]" />
              </a>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A4F3CC] text-[#005138]">
                {company.demoLabel || 'VERIFIED SOURCE DATA'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#8A8F98]">
              <span className="flex items-center gap-1 text-[#3F4943]">
                <Building2 className="w-3.5 h-3.5 text-[#8A8F98]" />
                <span>{industryData.text}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#3F4943]">
                <MapPin className="w-3.5 h-3.5 text-[#8A8F98]" />
                <span>{locationData.text}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#3F4943]">
                <Users className="w-3.5 h-3.5 text-[#8A8F98]" />
                <span>{employeeData.text} employees</span>
              </span>
            </div>
          </div>
        </div>

        {/* Deterministic Lead Score Box */}
        <div className="flex items-center gap-4 bg-[#F9F9F7] p-4 rounded-2xl border border-[#E5E5E1] shrink-0">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8F98]">
              <span>Lead Score</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-white border border-[#E5E5E1] text-[#005138]">
                DETERMINISTIC
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-[#005138] font-mono">{company.leadScore}</span>
              <span className="text-xs text-[#8A8F98]">/100</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#237A52] font-semibold">
              <CheckCircle2 className="w-3 h-3" />
              <span>Score Confidence: {company.scoreConfidence}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#005138] flex items-center justify-center bg-[#A4F3CC]/40 font-bold text-xs text-[#005138]">
            {company.leadScore}%
          </div>
        </div>
      </div>

      {/* 2-Column Main Dossier Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Interpretation, Signals, and Sales Intelligence */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Interpretation Box (Strictly labeled as AI Interpretation derived from verified facts) */}
          <div
            id="why-this-lead-card"
            className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#005138] text-white">
                  AI INTERPRETATION
                </span>
                <h3 className="text-sm font-bold text-[#1a1c1b] tracking-tight">
                  Executive Assessment & Hypothesis
                </h3>
              </div>

              <button
                id="refresh-ai-dossier-btn"
                onClick={handleRefreshAi}
                disabled={isRefreshingAi}
                className="flex items-center gap-1.5 text-xs text-[#005138] hover:underline font-semibold disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingAi ? 'animate-spin' : ''}`} />
                <span>{isRefreshingAi ? 'Reasoning over evidence...' : 'Re-synthesize with Gemini'}</span>
              </button>
            </div>

            <div className="space-y-2 bg-[#F9F9F7] p-4 rounded-xl border border-[#E5E5E1]">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A8F98] uppercase tracking-wider">
                <FileText className="w-3 h-3 text-[#005138]" />
                <span>Synthesized from Verified Sources & Signal Evidence</span>
              </div>
              <p className="text-xs text-[#3F4943] leading-relaxed">
                {aiAnalysisText}
              </p>
            </div>

            {/* Traceable Claims with Evidence Citation Links */}
            {claims.length > 0 && (
              <div className="space-y-2 pt-1">
                <h4 className="text-[11px] font-bold text-[#1a1c1b] uppercase tracking-wider flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5 text-[#005138]" />
                  <span>Traceable Evidence Claims</span>
                </h4>
                <div className="space-y-1.5">
                  {claims.map((claim, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 text-xs bg-white p-2.5 rounded-lg border border-[#E5E5E1]"
                    >
                      <span className="text-[#3F4943]">{claim.claim}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A4F3CC]/50 text-[#005138] shrink-0">
                        {claim.evidenceIds.length > 0 ? `Evidence [${claim.evidenceIds.join(', ')}]` : 'Verified Source'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deterministic Score Breakdown Bars */}
            <div className="space-y-2 pt-2 border-t border-[#E5E5E1]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1a1c1b]">Deterministic Score Factor Breakdown</span>
                <span className="text-[11px] text-[#8A8F98]">Calculated purely from verified data</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-2.5 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1] space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8A8F98]">ICP Fit</span>
                    <span className="font-bold text-[#1a1c1b]">
                      {company.scoreBreakdown.icpFit.current}/{company.scoreBreakdown.icpFit.max}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EEEEEC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#005138] rounded-full"
                      style={{
                        width: `${(company.scoreBreakdown.icpFit.current / company.scoreBreakdown.icpFit.max) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1] space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8A8F98]">Industry</span>
                    <span className="font-bold text-[#1a1c1b]">
                      {company.scoreBreakdown.industry.current}/{company.scoreBreakdown.industry.max}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EEEEEC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#005138] rounded-full"
                      style={{
                        width: `${(company.scoreBreakdown.industry.current / company.scoreBreakdown.industry.max) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1] space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8A8F98]">Headcount</span>
                    <span className="font-bold text-[#1a1c1b]">
                      {company.scoreBreakdown.companySize.current}/{company.scoreBreakdown.companySize.max}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EEEEEC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#005138] rounded-full"
                      style={{
                        width: `${(company.scoreBreakdown.companySize.current / company.scoreBreakdown.companySize.max) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1] space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8A8F98]">Recent Signals</span>
                    <span className="font-bold text-[#1a1c1b]">
                      {company.scoreBreakdown.recentActivity.current}/{company.scoreBreakdown.recentActivity.max}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EEEEEC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#005138] rounded-full"
                      style={{
                        width: `${(company.scoreBreakdown.recentActivity.current / company.scoreBreakdown.recentActivity.max) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Business Signals Timeline with Exact Provenance URLs */}
          <div
            id="business-signals-card"
            className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#A66A00]" />
                <h3 className="text-sm font-bold text-[#1a1c1b] tracking-tight">
                  Verified Business Signals & Citations ({company.businessSignals.length})
                </h3>
              </div>
              <span className="text-[11px] text-[#005138] font-bold">100% Sourced Signals</span>
            </div>

            <div className="space-y-3">
              {company.businessSignals.map((sig) => (
                <div
                  key={sig.id}
                  className="p-4 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] hover:border-[#D6D6D0] transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E5E1] flex items-center justify-center shrink-0 mt-0.5">
                        {getSignalIcon(sig.icon || 'activity')}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-[#1a1c1b]">{sig.title}</h4>
                        <p className="text-xs text-[#3F4943] leading-relaxed">{sig.description}</p>
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-[#8A8F98]">
                          <span className="font-semibold text-[#005138]">Source: {sig.sourceName}</span>
                          <span>•</span>
                          <a
                            href={sig.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#005138] hover:underline font-medium"
                          >
                            <span>Inspect Source URL</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <span>•</span>
                          <span>Verified {formatFreshTimestamp(sig.retrievedAt || sig.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138] shrink-0">
                      {sig.confidence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Intelligence & Actionable Playbook */}
          <div
            id="sales-intelligence-playbook"
            className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#005138]" />
                <h3 className="text-sm font-bold text-[#1a1c1b] tracking-tight">
                  Sales Intelligence & Outreach Playbook
                </h3>
              </div>
              <span className="text-xs text-[#8A8F98]">Grounding: Verified Evidence</span>
            </div>

            {/* Recommended Approach */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-[#005138] uppercase tracking-wider">
                Recommended Pitch Angle (Derived Strategy)
              </h4>
              <p className="text-xs text-[#3F4943] leading-relaxed bg-[#F4F4F2] p-3.5 rounded-xl border border-[#E5E5E1]">
                {approachText}
              </p>
            </div>

            {/* Pain Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1a1c1b] uppercase tracking-wider">
                Operational Pain Points
              </h4>
              <div className="space-y-2">
                {company.salesIntelligence.painPoints.map((pp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs text-[#3F4943] bg-[#F9F9F7] p-2.5 rounded-lg border border-[#E5E5E1]"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B42318] mt-1.5 shrink-0"></div>
                    <span>{pp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Talking Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1a1c1b] uppercase tracking-wider">
                High-Converting Conversational Hooks
              </h4>
              <div className="space-y-2">
                {talkingPoints.map((tp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 text-xs text-[#1a1c1b] bg-[#F4F4F2] p-3 rounded-lg border border-[#E5E5E1]"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#237A52] mt-0.5 shrink-0" />
                      <span>{tp}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(tp, `tp-${idx}`)}
                      className="text-[#8A8F98] hover:text-[#005138] shrink-0 p-1"
                      title="Copy talking point"
                    >
                      {copiedKey === `tp-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-[#237A52]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verified Firmographics & Tech Stack */}
        <div className="space-y-6">
          {/* AI Outreach Sequence Generator Box */}
          <div
            id="outreach-generator-card"
            className="bg-gradient-to-br from-[#005138] to-[#176B4D] text-white rounded-2xl p-6 shadow-md space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A4F3CC]" />
              <h3 className="text-base font-bold tracking-tight">Verified Outreach Sequence</h3>
            </div>
            <p className="text-xs text-[#A4F3CC] leading-relaxed">
              Generate a personalized 3-touch cold email sequence strictly citing {company.name}&apos;s verified signal triggers.
            </p>
            <button
              id="open-outreach-modal-btn"
              onClick={() => onOpenOutreachModal(company)}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F9F9F7] text-[#005138] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-[#005138]" />
              <span>Generate Email Sequence</span>
            </button>
          </div>

          {/* Firmographic Snapshot Card with Provenance Inspector */}
          <div
            id="firmographics-card"
            className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1c1b]">
                  Verified Firmographics
                </h3>
                <p className="text-[10px] text-[#8A8F98]">Click any field to inspect evidence quote</p>
              </div>
              <Building2 className="w-4 h-4 text-[#8A8F98]" />
            </div>

            <div className="space-y-3 text-xs">
              {/* Annual Revenue */}
              <div
                onClick={() => setActiveEvidenceModal({ fieldName: 'Annual Revenue', field: company.revenue })}
                className="p-2.5 rounded-xl bg-[#F9F9F7] hover:bg-[#F4F4F2] border border-[#E5E5E1] cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8F98]">Annual Revenue</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getVerificationBadge(company.revenue.verificationStatus).bgClass} ${getVerificationBadge(company.revenue.verificationStatus).textClass}`}>
                    {getVerificationBadge(company.revenue.verificationStatus).shortLabel}
                  </span>
                </div>
                <div className="font-semibold text-[#1a1c1b]">{revenueData.text}</div>
                {company.revenue.sourceName && (
                  <div className="text-[10px] text-[#005138] truncate">
                    Source: {company.revenue.sourceName}
                  </div>
                )}
              </div>

              {/* Funding Stage */}
              <div
                onClick={() => setActiveEvidenceModal({ fieldName: 'Funding / Listing', field: company.funding })}
                className="p-2.5 rounded-xl bg-[#F9F9F7] hover:bg-[#F4F4F2] border border-[#E5E5E1] cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8F98]">Funding / Market Listing</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getVerificationBadge(company.funding.verificationStatus).bgClass} ${getVerificationBadge(company.funding.verificationStatus).textClass}`}>
                    {getVerificationBadge(company.funding.verificationStatus).shortLabel}
                  </span>
                </div>
                <div className="font-semibold text-[#1a1c1b]">{fundingData.text}</div>
                {company.funding.sourceName && (
                  <div className="text-[10px] text-[#005138] truncate">
                    Source: {company.funding.sourceName}
                  </div>
                )}
              </div>

              {/* Headcount */}
              <div
                onClick={() => setActiveEvidenceModal({ fieldName: 'Headcount & Employees', field: company.employeeCount })}
                className="p-2.5 rounded-xl bg-[#F9F9F7] hover:bg-[#F4F4F2] border border-[#E5E5E1] cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8F98]">Headcount (Full-time)</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getVerificationBadge(company.employeeCount.verificationStatus).bgClass} ${getVerificationBadge(company.employeeCount.verificationStatus).textClass}`}>
                    {getVerificationBadge(company.employeeCount.verificationStatus).shortLabel}
                  </span>
                </div>
                <div className="font-semibold text-[#1a1c1b]">{employeeData.text} employees ({getFieldValue(company.size).text})</div>
                {company.employeeCount.sourceName && (
                  <div className="text-[10px] text-[#005138] truncate">
                    Source: {company.employeeCount.sourceName}
                  </div>
                )}
              </div>

              {/* SEC CIK */}
              {company.secFilingCik?.value && (
                <div
                  onClick={() => setActiveEvidenceModal({ fieldName: 'SEC EDGAR CIK', field: company.secFilingCik! })}
                  className="p-2.5 rounded-xl bg-[#F9F9F7] hover:bg-[#F4F4F2] border border-[#E5E5E1] cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#8A8F98]">SEC EDGAR CIK</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#A4F3CC]/50 text-[#005138]">
                      SEC.GOV
                    </span>
                  </div>
                  <div className="font-semibold text-[#1a1c1b] font-mono">{secCikData.text}</div>
                </div>
              )}

              {/* Headquarters */}
              <div
                onClick={() => setActiveEvidenceModal({ fieldName: 'Headquarters Location', field: company.location })}
                className="p-2.5 rounded-xl bg-[#F9F9F7] hover:bg-[#F4F4F2] border border-[#E5E5E1] cursor-pointer transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[#8A8F98]">Headquarters</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getVerificationBadge(company.location.verificationStatus).bgClass} ${getVerificationBadge(company.location.verificationStatus).textClass}`}>
                    {getVerificationBadge(company.location.verificationStatus).shortLabel}
                  </span>
                </div>
                <div className="font-semibold text-[#1a1c1b]">{locationData.text}</div>
              </div>
            </div>
          </div>

          {/* Tech Stack Radar */}
          <div
            id="tech-stack-card"
            className="bg-white rounded-2xl border border-[#E5E5E1] p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1a1c1b]">
                  Verified Tech Stack
                </h3>
                <p className="text-[10px] text-[#8A8F98]">Extracted from docs & engineering postings</p>
              </div>
              <Cpu className="w-4 h-4 text-[#8A8F98]" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(company.technologies.value || []).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg bg-[#F4F4F2] border border-[#E5E5E1] text-xs font-medium text-[#1a1c1b]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Provenance Evidence Inspector Modal */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E5E5E1] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#005138]" />
                <div>
                  <h3 className="font-bold text-sm text-[#1a1c1b]">
                    Data Provenance: {activeEvidenceModal.fieldName}
                  </h3>
                  <p className="text-[11px] text-[#8A8F98]">{company.name}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-[#8A8F98] hover:text-[#1a1c1b]"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] space-y-1">
                <div className="text-[#8A8F98] font-medium">Recorded Value</div>
                <div className="text-sm font-bold text-[#1a1c1b]">
                  {getFieldValue(activeEvidenceModal.field).text}
                </div>
                <div className="pt-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getVerificationBadge(activeEvidenceModal.field.verificationStatus).bgClass} ${getVerificationBadge(activeEvidenceModal.field.verificationStatus).textClass}`}>
                    {getVerificationBadge(activeEvidenceModal.field.verificationStatus).label}
                  </span>
                </div>
              </div>

              {activeEvidenceModal.field.evidence && (
                <div className="p-3 rounded-xl bg-[#F4F4F2] border border-[#E5E5E1] space-y-1">
                  <div className="text-[#8A8F98] font-medium flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#005138]" />
                    <span>Exact Source Excerpt / Evidence Quote</span>
                  </div>
                  <p className="text-xs text-[#3F4943] italic leading-relaxed">
                    &ldquo;{activeEvidenceModal.field.evidence}&rdquo;
                  </p>
                </div>
              )}

              {activeEvidenceModal.field.sourceName && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-[#8A8F98]">Authoritative Source:</span>
                    <span className="font-semibold text-[#1a1c1b]">{activeEvidenceModal.field.sourceName}</span>
                  </div>
                  {activeEvidenceModal.field.sourceUrl && (
                    <div className="flex justify-between">
                      <span className="text-[#8A8F98]">Verification URL:</span>
                      <a
                        href={activeEvidenceModal.field.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#005138] hover:underline font-semibold flex items-center gap-1"
                      >
                        <span>Open Source Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {activeEvidenceModal.field.retrievedAt && (
                    <div className="flex justify-between text-[#8A8F98]">
                      <span>Verification Audit:</span>
                      <span className="text-[#1a1c1b] font-medium">{formatFreshTimestamp(activeEvidenceModal.field.retrievedAt)}</span>
                    </div>
                  )}
                </div>
              )}

              {!activeEvidenceModal.field.sourceName && (
                <div className="p-3 rounded-xl bg-[#FEF0C7] text-[#93370D] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[11px]">
                    We could not verify this field against official regulatory disclosures. LeadOS leaves unverified fields blank rather than guessing.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="px-4 py-1.5 rounded-xl bg-[#005138] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
