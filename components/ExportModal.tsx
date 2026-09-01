'use client';

import React, { useState } from 'react';
import { Download, X, CheckCircle2, ShieldCheck, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { CompanyLead } from '@/lib/types';
import { getFieldValue } from '@/lib/provenance-utils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: CompanyLead[];
  selectedCount?: number;
  onConfirmExport?: () => void;
}

export default function ExportModal({
  isOpen,
  onClose,
  companies,
  selectedCount = 0,
  onConfirmExport,
}: ExportModalProps) {
  const [includeProvenance, setIncludeProvenance] = useState(true);
  const [includeSignals, setIncludeSignals] = useState(true);
  const [includeAiInterpretation, setIncludeAiInterpretation] = useState(true);
  const [exportScope, setExportScope] = useState<'all' | 'selected'>(
    selectedCount > 0 ? 'selected' : 'all'
  );

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    const targetList = exportScope === 'selected' && selectedCount > 0
      ? companies.slice(0, selectedCount)
      : companies;

    // Build headers
    const headers = [
      'Company Name',
      'Domain',
      'Deterministic Lead Score',
      'Score Confidence',
      'Data Quality (Verified/Total)',
      'Industry',
      'Industry Source',
      'Location',
      'Location Source',
      'Employee Count',
      'Employee Count Source',
      'Employee Source Date',
      'Revenue',
      'Revenue Source',
      'SEC EDGAR CIK',
      'Funding Stage',
      'Key Trigger Signal',
      'Signal Source Name',
      'Signal Source URL',
      'Signal Verified Date',
    ];

    if (includeAiInterpretation) {
      headers.push('AI Interpretation (Hypothesis)');
      headers.push('Recommended Sales Angle');
    }

    const rows = targetList.map((c) => {
      const row = [
        `"${c.name}"`,
        `"${c.domain}"`,
        c.leadScore,
        `"${c.scoreConfidence}"`,
        `"${c.dataQuality.verifiedFieldsCount}/${c.dataQuality.totalFieldsCount} (${c.dataQuality.confidence})"`,
        `"${getFieldValue(c.industry).text}"`,
        `"${c.industry.sourceName || 'N/A'}"`,
        `"${getFieldValue(c.location).text}"`,
        `"${c.location.sourceName || 'N/A'}"`,
        `"${getFieldValue(c.employeeCount).text}"`,
        `"${c.employeeCount.sourceName || 'N/A'}"`,
        `"${c.employeeCount.retrievedAt ? new Date(c.employeeCount.retrievedAt).toLocaleDateString() : 'N/A'}"`,
        `"${getFieldValue(c.revenue).text}"`,
        `"${c.revenue.sourceName || 'N/A'}"`,
        `"${c.secFilingCik?.value || 'N/A'}"`,
        `"${getFieldValue(c.funding).text}"`,
        `"${c.keySignal.title}"`,
        `"${c.keySignal.sourceName}"`,
        `"${c.keySignal.sourceUrl}"`,
        `"${new Date(c.keySignal.retrievedAt).toLocaleDateString()}"`,
      ];

      if (includeAiInterpretation) {
        row.push(`"${(c.whyThisLead || '').replace(/"/g, '""')}"`);
        row.push(`"${(c.salesIntelligence.recommendedApproach || '').replace(/"/g, '""')}"`);
      }

      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `LeadOS_Verified_Pipeline_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E5E5E1] shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A4F3CC]/50 flex items-center justify-center text-[#005138]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1a1c1b]">Export Verified Pipeline</h3>
              <p className="text-xs text-[#8A8F98]">CSV with complete regulatory source provenance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8A8F98] hover:text-[#1a1c1b] hover:bg-[#F4F4F2]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Scope Selector */}
          <div className="space-y-2">
            <label className="font-bold text-[#1a1c1b]">Export Scope</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportScope('all')}
                className={`p-3 rounded-xl border text-left space-y-1 transition-all ${
                  exportScope === 'all'
                    ? 'border-[#005138] bg-[#A4F3CC]/20 text-[#005138]'
                    : 'border-[#E5E5E1] bg-white text-[#3F4943]'
                }`}
              >
                <div className="font-bold">All Accounts</div>
                <div className="text-[11px] text-[#8A8F98]">{companies.length} verified records</div>
              </button>

              <button
                type="button"
                onClick={() => setExportScope('selected')}
                disabled={selectedCount === 0}
                className={`p-3 rounded-xl border text-left space-y-1 transition-all disabled:opacity-40 ${
                  exportScope === 'selected'
                    ? 'border-[#005138] bg-[#A4F3CC]/20 text-[#005138]'
                    : 'border-[#E5E5E1] bg-white text-[#3F4943]'
                }`}
              >
                <div className="font-bold">Selected Only</div>
                <div className="text-[11px] text-[#8A8F98]">{selectedCount} records selected</div>
              </button>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3 pt-2 border-t border-[#E5E5E1]">
            <label className="font-bold text-[#1a1c1b]">Data Integrity & Provenance Fields</label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] cursor-pointer">
              <input
                type="checkbox"
                checked={includeProvenance}
                onChange={(e) => setIncludeProvenance(e.target.checked)}
                className="w-4 h-4 rounded text-[#005138] focus:ring-[#005138]"
              />
              <div>
                <div className="font-semibold text-[#1a1c1b] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#005138]" />
                  <span>Include Source Names, URLs & Retrieval Timestamps</span>
                </div>
                <div className="text-[11px] text-[#8A8F98]">
                  Export SEC EDGAR CIK, official careers URLs, and verification status per field.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F9F9F7] border border-[#E5E5E1] cursor-pointer">
              <input
                type="checkbox"
                checked={includeAiInterpretation}
                onChange={(e) => setIncludeAiInterpretation(e.target.checked)}
                className="w-4 h-4 rounded text-[#005138] focus:ring-[#005138]"
              />
              <div>
                <div className="font-semibold text-[#1a1c1b]">Include AI Interpretation & Sales Angle</div>
                <div className="text-[11px] text-[#8A8F98]">
                  Exports the executive summary and recommended outbound angle.
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E1]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#3F4943] hover:bg-[#F4F4F2]"
          >
            Cancel
          </button>
          <button
            id="confirm-download-csv-btn"
            onClick={handleDownloadCsv}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#005138] hover:bg-[#176B4D] text-white text-xs font-bold shadow-xs transition-transform active:scale-[0.98]"
          >
            <Download className="w-4 h-4 text-[#A4F3CC]" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}
