'use client';

import React, { useState } from 'react';
import {
  Clock,
  Download,
  FolderPlus,
  Search,
  Sparkles,
  Bookmark,
  Mail,
  Filter,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ActivityEvent } from '@/lib/types';

interface ActivityLogViewProps {
  activities: ActivityEvent[];
  onNavigateAction: (target: { tab: string; entityId?: string }) => void;
  onExportLog: () => void;
}

export default function ActivityLogView({
  activities,
  onNavigateAction,
  onExportLog,
}: ActivityLogViewProps) {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = activities.filter((act) => {
    if (filterType === 'AI_ONLY') return act.isAiAnalysis;
    if (filterType === 'EXPORTS') return act.type === 'export';
    if (filterType === 'SEARCHES') return act.type === 'search';
    if (filterType === 'LISTS') return act.type === 'list_created';
    return true;
  });

  const todayEvents = filtered.filter((a) => a.dateGroup === 'TODAY');
  const yesterdayEvents = filtered.filter((a) => a.dateGroup === 'YESTERDAY');
  const earlierEvents = filtered.filter((a) => a.dateGroup === 'EARLIER');

  const getEventIcon = (type: string, isAi?: boolean) => {
    if (isAi) {
      return (
        <div className="w-8 h-8 rounded-lg bg-[#005138] text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-4 h-4 text-[#A4F3CC]" />
        </div>
      );
    }

    switch (type) {
      case 'export':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#315F9B]/10 text-[#315F9B] flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
        );
      case 'list_created':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#A66A00]/10 text-[#A66A00] flex items-center justify-center">
            <FolderPlus className="w-4 h-4" />
          </div>
        );
      case 'search':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#005138]/10 text-[#005138] flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
        );
      case 'outreach':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#005138] text-white flex items-center justify-center shadow-xs">
            <Mail className="w-4 h-4 text-[#A4F3CC]" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#237A52]/10 text-[#237A52] flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </div>
        );
    }
  };

  const renderGroup = (label: string, events: ActivityEvent[]) => {
    if (events.length === 0) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#8A8F98]" />
          <span className="text-xs font-bold text-[#8A8F98] uppercase tracking-wider">{label}</span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E5E1] shadow-xs divide-y divide-[#E5E5E1]">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9F9F7] transition-colors"
            >
              <div className="flex items-start gap-3.5">
                {getEventIcon(ev.type, ev.isAiAnalysis)}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs text-[#1a1c1b]">{ev.title}</span>
                    {ev.isAiAnalysis && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#005138] text-white">
                        AI ANALYSIS
                      </span>
                    )}
                    <span className="text-[11px] text-[#8A8F98]">{ev.time}</span>
                  </div>
                  <p className="text-xs text-[#3F4943] leading-relaxed">{ev.description}</p>
                </div>
              </div>

              {ev.actionTarget && (
                <button
                  onClick={() => onNavigateAction(ev.actionTarget!)}
                  className="self-start sm:self-center shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#F4F4F2] hover:bg-[#EEEEEC] border border-[#E5E5E1] text-xs font-semibold text-[#005138] transition-colors"
                >
                  <span>{ev.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div id="activity-log-view" className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#A4F3CC] text-[#005138] uppercase tracking-wider">
              Audit Stream
            </span>
            <span className="text-xs text-[#8A8F98]">· Immutable Prospecting History</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1a1c1b] tracking-tight">Activity Log</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-activity-log-btn"
            onClick={onExportLog}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#E5E5E1] hover:bg-[#F4F4F2] text-xs font-semibold text-[#1a1c1b] shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#3F4943]" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E5E1] pb-3">
        <button
          onClick={() => setFilterType('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === 'ALL'
              ? 'bg-[#005138] text-white font-semibold'
              : 'bg-white text-[#3F4943] hover:bg-[#F4F4F2] border border-[#E5E5E1]'
          }`}
        >
          All Activity ({activities.length})
        </button>

        <button
          onClick={() => setFilterType('AI_ONLY')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === 'AI_ONLY'
              ? 'bg-[#005138] text-white font-semibold'
              : 'bg-white text-[#005138] hover:bg-[#F4F4F2] border border-[#A4F3CC]'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>AI Intelligence Events</span>
        </button>

        <button
          onClick={() => setFilterType('EXPORTS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === 'EXPORTS'
              ? 'bg-[#005138] text-white font-semibold'
              : 'bg-white text-[#3F4943] hover:bg-[#F4F4F2] border border-[#E5E5E1]'
          }`}
        >
          Exports
        </button>

        <button
          onClick={() => setFilterType('SEARCHES')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            filterType === 'SEARCHES'
              ? 'bg-[#005138] text-white font-semibold'
              : 'bg-white text-[#3F4943] hover:bg-[#F4F4F2] border border-[#E5E5E1]'
          }`}
        >
          Searches
        </button>
      </div>

      {/* Grouped Chronological Stream */}
      <div className="space-y-6">
        {renderGroup('Today · Oct 24, 2026', todayEvents)}
        {renderGroup('Yesterday · Oct 23, 2026', yesterdayEvents)}
        {renderGroup('Earlier this week', earlierEvents)}
      </div>
    </div>
  );
}
