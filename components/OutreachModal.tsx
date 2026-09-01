'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Mail,
  Copy,
  Check,
  Send,
  Loader2,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { CompanyLead } from '@/lib/types';
import { getFieldValue } from '@/lib/provenance-utils';

interface OutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyLead | null;
}

interface EmailStep {
  step: number;
  title: string;
  subject: string;
  body: string;
}

export default function OutreachModal({ isOpen, onClose, company }: OutreachModalProps) {
  const [tone, setTone] = useState<'Executive & Consultative' | 'Direct & High Velocity' | 'Casual'>(
    'Executive & Consultative'
  );
  const [role, setRole] = useState('VP of Sales Operations / RevOps');
  const [contactName, setContactName] = useState('Sarah');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sequence, setSequence] = useState<EmailStep[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate sequence on demand
  const handleGenerateSequence = async () => {
    if (!company) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: company.name,
          contactName,
          contactRole: role,
          industry: getFieldValue(company.industry).text,
          triggerSignal: company.keySignal.title,
          triggerSource: company.keySignal.sourceName,
          tone,
        }),
      });
      const data = await res.json();
      if (data.sequence && Array.isArray(data.sequence) && data.sequence.length > 0) {
        setSequence(data.sequence);
      } else {
        // Fallback
        setSequence([
          {
            step: 1,
            title: 'Touchpoint 1: Trigger & Relevance',
            subject: `Quick question regarding ${company.name}'s recent expansion`,
            body: `Hi ${contactName},\n\nNoticed that ${company.name} recently had signals around "${company.keySignal.title}". As you scale outbound velocity, manual account prospecting often creates a major pipeline bottleneck.\n\nWe helped similar ${getFieldValue(company.industry).text} leaders automate account triage and accelerate qualification by 3x.\n\nOpen to a brief 10-minute intro next Tuesday?\n\nBest,\nSarah`,
          },
          {
            step: 2,
            title: 'Touchpoint 2: Benchmark Value Metric (Day +3)',
            subject: `Re: ${company.name} pipeline velocity`,
            body: `Hi ${contactName},\n\nFollowing up on my previous note. One key differentiator our partners at similar growth stages leverage is real-time trigger alerts on high-intent accounts before they launch public RFPs.\n\nHappy to send over a 2-page benchmark report customized for ${company.name}.\n\nWould that be helpful?\n\nBest,\nSarah`,
          },
          {
            step: 3,
            title: 'Touchpoint 3: Polite Executive Breakaway (Day +7)',
            subject: `Last check-in for ${company.name}`,
            body: `Hi ${contactName},\n\nI know you're super focused on quarter goals. If pipeline automation isn't top of mind right now, no worries at all.\n\nIf you ever need verified corporate signals and direct-dial data for your team, feel free to keep us in mind.\n\nCheers,\nSarah`,
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen || !company) return null;

  const currentSequence =
    sequence.length > 0
      ? sequence
      : [
          {
            step: 1,
            title: 'Touchpoint 1: Trigger & Relevance',
            subject: `Quick question regarding ${company.name}'s recent expansion`,
            body: `Hi ${contactName},\n\nNoticed that ${company.name} recently had signals around "${company.keySignal.title}". As you scale outbound velocity, manual account prospecting often creates a major pipeline bottleneck.\n\nWe helped similar ${company.industry} leaders automate account triage and accelerate qualification by 3x.\n\nOpen to a brief 10-minute intro next Tuesday?\n\nBest,\nSarah`,
          },
          {
            step: 2,
            title: 'Touchpoint 2: Benchmark Value Metric (Day +3)',
            subject: `Re: ${company.name} pipeline velocity`,
            body: `Hi ${contactName},\n\nFollowing up on my previous note. One key differentiator our partners at similar growth stages leverage is real-time trigger alerts on high-intent accounts before they launch public RFPs.\n\nHappy to send over a 2-page benchmark report customized for ${company.name}.\n\nWould that be helpful?\n\nBest,\nSarah`,
          },
          {
            step: 3,
            title: 'Touchpoint 3: Polite Executive Breakaway (Day +7)',
            subject: `Last check-in for ${company.name}`,
            body: `Hi ${contactName},\n\nI know you're super focused on quarter goals. If pipeline automation isn't top of mind right now, no worries at all.\n\nIf you ever need verified corporate signals and direct-dial data for your team, feel free to keep us in mind.\n\nCheers,\nSarah`,
          },
        ];

  const currentEmail = currentSequence.find((s) => s.step === activeStep) || currentSequence[0];

  return (
    <div
      id="outreach-modal-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
    >
      <div
        id="outreach-modal-card"
        className="w-full max-w-3xl bg-white rounded-3xl border border-[#E5E5E1] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E5E5E1] flex items-center justify-between bg-[#F9F9F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#005138] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#A4F3CC]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#1a1c1b]">AI Outreach Cadence</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138]">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-[#8A8F98]">
                Personalized 3-step sequence for <span className="font-semibold text-[#1a1c1b]">{company.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8A8F98] hover:text-[#1a1c1b] hover:bg-[#EEEEEC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Controls Bar */}
        <div className="p-4 border-b border-[#E5E5E1] bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[#8A8F98] font-medium">Recipient Role:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-[#E5E5E1] bg-[#F9F9F7] text-[#1a1c1b] outline-none cursor-pointer"
              >
                <option value="VP of Sales Operations / RevOps">VP of Sales Operations / RevOps</option>
                <option value="Head of Sales Development">Head of Sales Development</option>
                <option value="Chief Growth Officer">Chief Growth Officer</option>
                <option value="Chief Information Officer">Chief Information Officer</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#8A8F98] font-medium">Tone:</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="px-2.5 py-1 rounded-lg border border-[#E5E5E1] bg-[#F9F9F7] text-[#1a1c1b] outline-none cursor-pointer"
              >
                <option value="Executive & Consultative">Executive & Consultative</option>
                <option value="Direct & High Velocity">Direct & High Velocity</option>
                <option value="Casual">Casual & Relational</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateSequence}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#005138] text-white font-semibold hover:bg-[#176B4D] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Step Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E5E5E1] pb-3">
            {[1, 2, 3].map((stepNum) => (
              <button
                key={stepNum}
                onClick={() => setActiveStep(stepNum)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeStep === stepNum
                    ? 'bg-[#005138] text-white shadow-xs'
                    : 'bg-[#F4F4F2] text-[#3F4943] hover:bg-[#EEEEEC]'
                }`}
              >
                <span>Email {stepNum}</span>
                <span className="text-[10px] opacity-75">
                  {stepNum === 1 ? '(Day 1)' : stepNum === 2 ? '(Day 4)' : '(Day 8)'}
                </span>
              </button>
            ))}
          </div>

          {/* Email Preview Card */}
          {isGenerating ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#8A8F98]">
              <Loader2 className="w-8 h-8 text-[#005138] animate-spin" />
              <p className="text-xs font-medium">Crafting hyper-personalized email sequence with Gemini...</p>
            </div>
          ) : currentEmail ? (
            <div className="bg-[#F9F9F7] rounded-2xl border border-[#E5E5E1] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-[#8A8F98] uppercase">Subject Line</span>
                  <p className="text-xs font-bold text-[#1a1c1b]">{currentEmail.subject}</p>
                </div>
                <button
                  onClick={() => handleCopy(currentEmail.subject, 'subj')}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#005138] hover:underline"
                >
                  {copiedKey === 'subj' ? <Check className="w-3.5 h-3.5 text-[#237A52]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Subject</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#8A8F98] uppercase">Email Body</span>
                  <button
                    onClick={() =>
                      handleCopy(`Subject: ${currentEmail.subject}\n\n${currentEmail.body}`, 'body')
                    }
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#005138] hover:underline"
                  >
                    {copiedKey === 'body' ? <Check className="w-3.5 h-3.5 text-[#237A52]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Full Email</span>
                  </button>
                </div>
                <div className="p-4 bg-white rounded-xl border border-[#E5E5E1] text-xs text-[#1a1c1b] whitespace-pre-wrap font-mono leading-relaxed">
                  {currentEmail.body}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#E5E5E1] bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#8A8F98]">
            <ShieldCheck className="w-4 h-4 text-[#237A52]" />
            <span>Spam-score optimized & GDPR compliant phrasing</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const fullText = sequence
                  .map((s) => `--- EMAIL ${s.step}: ${s.title} ---\nSubject: ${s.subject}\n\n${s.body}\n`)
                  .join('\n\n');
                handleCopy(fullText, 'all');
              }}
              className="px-4 py-2 rounded-xl bg-white border border-[#E5E5E1] hover:bg-[#F4F4F2] text-xs font-bold text-[#1a1c1b]"
            >
              {copiedKey === 'all' ? 'Copied Entire Cadence!' : 'Copy All 3 Steps'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-bold shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
