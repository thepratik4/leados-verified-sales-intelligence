'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, CheckCircle2, Loader2, ShieldCheck, Zap } from 'lucide-react';

interface AnalyzingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  querySummary?: string;
  isLoading?: boolean;
}

export default function AnalyzingModal({
  isOpen,
  onComplete,
  querySummary,
  isLoading = false,
}: AnalyzingModalProps) {
  const [progress, setProgress] = useState(15);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Whenever modal opens, reset progress to starting state and animate smoothly
  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      return;
    }

    setProgress(15);

    // Fast, responsive lead synthesis animation (~1.2s total)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + 15;
        if (prev < 75) return prev + 12;
        if (prev < 90) return prev + 6;
        // Hold at 92% only if actual API fetch is taking longer
        if (isLoading && prev >= 90) return 92;
        if (!isLoading && prev >= 90) return 100;
        return prev;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isOpen, isLoading]);

  // When loading finishes and progress reaches completion, transition out smoothly
  useEffect(() => {
    if (!isOpen) return;

    if (!isLoading && progress >= 90) {
      setProgress(100);
      const timer = setTimeout(() => {
        onCompleteRef.current();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isLoading, progress]);

  if (!isOpen) return null;

  return (
    <div
      id="analyzing-progress-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        id="analyzing-modal-card"
        className="w-full max-w-lg bg-white rounded-3xl border border-[#E5E5E1] shadow-2xl p-8 space-y-6 text-center relative overflow-hidden"
      >
        {/* Decorative ambient background */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#A4F3CC]/30 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#005138]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Central Sonar Ring Graphic */}
        <div className="relative flex items-center justify-center pt-2">
          <div className="absolute w-28 h-28 rounded-full border border-[#A4F3CC] animate-ping opacity-30"></div>
          <div className="absolute w-20 h-20 rounded-full bg-[#A4F3CC]/40 animate-pulse"></div>
          <div className="relative w-14 h-14 rounded-2xl bg-[#005138] text-white flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-[#A4F3CC] animate-bounce" />
          </div>
        </div>

        {/* Text Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest text-[#005138] uppercase px-2.5 py-0.5 rounded-full bg-[#A4F3CC]">
            Gemini 3.7 Intelligence
          </span>
          <h3 className="text-xl font-bold text-[#1a1c1b] tracking-tight">
            Analyzing High-Fit Accounts
          </h3>
          <p className="text-xs text-[#3F4943] max-w-sm mx-auto">
            {querySummary ||
              'Cross-referencing 4,800+ real-time signals, SEC filings, and job postings...'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#3F4943]">Lead Synthesis Progress</span>
            <span className="text-[#005138] font-mono">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#EEEEEC] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#176B4D] to-[#005138] rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Checklist Steps */}
        <div className="bg-[#F9F9F7] rounded-2xl border border-[#E5E5E1] p-4 text-left space-y-3">
          <div className="flex items-center gap-3 text-xs">
            {progress >= 30 ? (
              <CheckCircle2 className="w-4 h-4 text-[#237A52] shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 text-[#005138] animate-spin shrink-0" />
            )}
            <span className={progress >= 30 ? 'text-[#1a1c1b] font-medium' : 'text-[#8A8F98]'}>
              Scanning 4,800+ live business signals & job posts
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {progress >= 65 ? (
              <CheckCircle2 className="w-4 h-4 text-[#237A52] shrink-0" />
            ) : progress >= 30 ? (
              <Loader2 className="w-4 h-4 text-[#005138] animate-spin shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-[#D6D6D0] shrink-0"></div>
            )}
            <span className={progress >= 65 ? 'text-[#1a1c1b] font-medium' : 'text-[#8A8F98]'}>
              Evaluating headcount velocity & tech stack fit
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {progress >= 85 ? (
              <CheckCircle2 className="w-4 h-4 text-[#237A52] shrink-0" />
            ) : progress >= 65 ? (
              <Loader2 className="w-4 h-4 text-[#005138] animate-spin shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-[#D6D6D0] shrink-0"></div>
            )}
            <span className={progress >= 85 ? 'text-[#1a1c1b] font-medium' : 'text-[#8A8F98]'}>
              Computing Multi-Factor Lead Scores (0-100)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {progress >= 100 ? (
              <CheckCircle2 className="w-4 h-4 text-[#237A52] shrink-0" />
            ) : progress >= 85 ? (
              <Loader2 className="w-4 h-4 text-[#005138] animate-spin shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-[#D6D6D0] shrink-0"></div>
            )}
            <span className={progress >= 100 ? 'text-[#1a1c1b] font-medium' : 'text-[#8A8F98]'}>
              Generating ranked lead cohort & intelligence dossiers
            </span>
          </div>
        </div>

        {/* Security / Quality Seal */}
        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#8A8F98]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#005138]" />
          <span>SOC2 Type II Compliant & Verified Corporate Registries</span>
        </div>
      </div>
    </div>
  );
}
