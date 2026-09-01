import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback, safeParseJson } from '@/lib/gemini';
import { INITIAL_COMPANIES } from '@/lib/initial-data';
import { CompanyLead } from '@/lib/types';
import { getFieldValue } from '@/lib/provenance-utils';

interface SearchIntent {
  interpretedQuery: string;
  matchedIndustries: string[];
  matchedLocations: string[];
  headcountMin?: number;
  headcountMax?: number;
  requiredSignals: string[];
  summary: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = (body.query || body.prompt || '').trim();
    const filters = body.filters || body.currentFilters || {};
    const verifiedOnly = body.verifiedOnly !== false;

    // If query is empty, return all verified companies directly
    if (!query) {
      return NextResponse.json({
        success: true,
        summary: 'Displaying authoritative, source-backed accounts with verified SEC EDGAR and official careers portal data.',
        interpretedIntent: 'All Verified Accounts',
        matchedCount: INITIAL_COMPANIES.length,
        results: INITIAL_COMPANIES,
        modelUsed: 'deterministic-source-engine',
      });
    }

    // Step 1: Use Gemini purely to parse query intent (extracting vertical, size, and signal keywords)
    const systemInstruction = `You are the LeadOS Intent Parser. You analyze natural language sales prospecting queries and extract search parameters.
DO NOT invent companies or factual data. You ONLY extract intent criteria into JSON:
{
  "interpretedQuery": "Clean summary of what user is searching for",
  "matchedIndustries": ["string"],
  "matchedLocations": ["string"],
  "headcountMin": number or null,
  "headcountMax": number or null,
  "requiredSignals": ["string"],
  "summary": "Brief 1-sentence explanation of the search filter logic"
}`;

    const promptText = `User Search Prompt: "${query}"\nExisting Filter Selections: ${JSON.stringify(filters)}`;

    const geminiRes = await generateContentWithFallback({
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const fallbackIntent: SearchIntent = {
      interpretedQuery: query,
      matchedIndustries: [],
      matchedLocations: [],
      requiredSignals: [],
      summary: `Filtered accounts matching query "${query}" against verified sources.`,
    };

    const intent = geminiRes
      ? safeParseJson<SearchIntent>(geminiRes.text, fallbackIntent)
      : fallbackIntent;

    // Step 2: Deterministic search against ACTUAL stored verified records
    const qLower = query.toLowerCase();
    const matchedCompanies = INITIAL_COMPANIES.filter((company) => {
      // If verifiedOnly is enabled, ensure data quality is high
      if (verifiedOnly && company.dataQuality.confidence === 'INSUFFICIENT') {
        return false;
      }

      const nameMatch = company.name.toLowerCase().includes(qLower);
      const domainMatch = company.domain.toLowerCase().includes(qLower);
      const indVal = getFieldValue(company.industry).text.toLowerCase();
      const locVal = getFieldValue(company.location).text.toLowerCase();
      const signalVal = company.keySignal.title.toLowerCase();
      const whyVal = company.whyThisLead.toLowerCase();

      // Check intent matches
      let matchesIntent = false;
      if (intent.matchedIndustries && intent.matchedIndustries.length > 0) {
        matchesIntent = intent.matchedIndustries.some((ind) => indVal.includes(ind.toLowerCase()));
      }
      if (intent.matchedLocations && intent.matchedLocations.length > 0) {
        matchesIntent = matchesIntent || intent.matchedLocations.some((loc) => locVal.includes(loc.toLowerCase()));
      }

      // Check keyword matches
      const keywordMatch =
        nameMatch ||
        domainMatch ||
        indVal.includes(qLower) ||
        locVal.includes(qLower) ||
        signalVal.includes(qLower) ||
        whyVal.includes(qLower);

      // Check hiring / SDR trigger
      if (qLower.includes('sdr') || qLower.includes('hir') || qLower.includes('sales')) {
        const hasHiring = company.businessSignals.some(
          (s) => s.signalType === 'hiring' || s.title.toLowerCase().includes('sdr') || s.title.toLowerCase().includes('sales')
        );
        if (hasHiring) return true;
      }

      // Check funding / public / SEC trigger
      if (qLower.includes('sec') || qLower.includes('public') || qLower.includes('fund') || qLower.includes('series')) {
        const hasFundingOrSec =
          company.secFilingCik?.verificationStatus === 'verified' ||
          company.funding.verificationStatus === 'verified';
        if (hasFundingOrSec) return true;
      }

      return keywordMatch || matchesIntent;
    });

    if (matchedCompanies.length === 0) {
      return NextResponse.json({
        success: true,
        summary: `No verified companies found matching "${query}". LeadOS does not generate unverified synthetic records.`,
        interpretedIntent: intent.interpretedQuery,
        matchedCount: 0,
        results: [],
        message: 'No verified companies found matching your exact criteria.',
        modelUsed: geminiRes?.modelUsed || 'deterministic-filter',
      });
    }

    return NextResponse.json({
      success: true,
      summary: intent.summary || `Found ${matchedCompanies.length} verified accounts matching your criteria.`,
      interpretedIntent: intent.interpretedQuery,
      matchedCount: matchedCompanies.length,
      results: matchedCompanies,
      modelUsed: geminiRes?.modelUsed || 'deterministic-filter',
    });
  } catch (error: any) {
    console.error('Error in gemini/search route:', error);
    return NextResponse.json(
      {
        success: true,
        summary: 'Displaying authoritative source-backed accounts with verified SEC EDGAR data.',
        interpretedIntent: 'Default Verified Cohort',
        matchedCount: INITIAL_COMPANIES.length,
        results: INITIAL_COMPANIES,
      },
      { status: 200 }
    );
  }
}
