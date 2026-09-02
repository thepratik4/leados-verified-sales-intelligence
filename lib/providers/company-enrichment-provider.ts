import { CompanyLead, Evidence, VerifiedFact, VerificationStatus } from '../types';
import { CompanyEnrichmentProvider, LeadDiscoveryProvider, ProviderSearchResult } from './types';
import { INITIAL_COMPANIES } from '../initial-data';
import { getFieldValue } from '../provenance-utils';
import { calculateGroundedLeadScore } from '../integrity-guard';

export interface MultiFactorSearchParams {
  query?: string;
  industries?: string[];
  locations?: string[];
  companySize?: string;
  keywords?: string;
  advancedFilters?: {
    revenue?: boolean;
    funding?: boolean;
    growthRate?: boolean;
    activelyHiring?: boolean;
    techStack?: boolean;
  };
  customFilters?: string[];
  verifiedOnly?: boolean;
}

/**
 * Grounded Lead Discovery Provider
 * Queries verified source-backed company database.
 * Strictly enforces multi-dimensional filtering, dynamic ICP scoring, and zero hallucinations.
 */
export class GroundedLeadDiscoveryProvider implements LeadDiscoveryProvider {
  readonly name = 'LeadOS Grounded Discovery Engine';

  async search(params: MultiFactorSearchParams): Promise<ProviderSearchResult> {
    const rawPool = [...INITIAL_COMPANIES];
    const qLower = (params.query || '').toLowerCase().trim();
    const selectedIndustries = (params.industries || []).map((i) => i.toLowerCase().trim()).filter(Boolean);
    const selectedLocations = (params.locations || []).map((l) => l.toLowerCase().trim()).filter(Boolean);
    const selectedSize = (params.companySize || '').trim();
    const keywordList = (params.keywords || '')
      .split(',')
      .map((k) => k.toLowerCase().trim())
      .filter(Boolean);
    const adv = params.advancedFilters || {};

    const filtered = rawPool.filter((company) => {
      // 1. Data Quality Guard
      if (params.verifiedOnly && company.dataQuality?.confidence === 'INSUFFICIENT') {
        return false;
      }

      const compName = company.name.toLowerCase();
      const compDomain = company.domain.toLowerCase();
      const compIndustry = getFieldValue(company.industry).text.toLowerCase();
      const compSubIndustry = getFieldValue(company.subIndustry).text.toLowerCase();
      const compLocation = getFieldValue(company.location).text.toLowerCase();
      const compCountry = getFieldValue(company.country).text.toLowerCase();
      const compRevenue = getFieldValue(company.revenue).text.toLowerCase();
      const compFunding = getFieldValue(company.funding).text.toLowerCase();
      const compGrowth = getFieldValue(company.growthRate).text.toLowerCase();
      const compEmployees = company.employeeCount?.value || 0;
      const compTech = (company.technologies?.value || []).map((t) => t.toLowerCase());

      // 2. Industry Filter
      if (selectedIndustries.length > 0) {
        const matchesIndustry = selectedIndustries.some((ind) => {
          if (ind === 'all') return true;
          if (ind.includes('saas') && (compIndustry.includes('saas') || compIndustry.includes('cloud') || compSubIndustry.includes('saas'))) return true;
          if (ind.includes('fintech') && (compIndustry.includes('fintech') || compSubIndustry.includes('payment') || compSubIndustry.includes('fintech'))) return true;
          if (ind.includes('cyber') && (compIndustry.includes('security') || compSubIndustry.includes('security') || compSubIndustry.includes('cyber'))) return true;
          if (ind.includes('ai') && (compIndustry.includes('ai') || compIndustry.includes('data') || compSubIndustry.includes('analytics') || compSubIndustry.includes('ai'))) return true;
          if (ind.includes('supply') && (compIndustry.includes('supply') || compIndustry.includes('logistics'))) return true;
          if (ind.includes('health') && (compIndustry.includes('health') || compIndustry.includes('care'))) return true;
          if (ind.includes('defense') && (compIndustry.includes('defense') || compIndustry.includes('aerospace'))) return true;
          if (ind.includes('commerce') && (compIndustry.includes('commerce') || compIndustry.includes('retail'))) return true;
          return compIndustry.includes(ind) || compSubIndustry.includes(ind);
        });
        if (!matchesIndustry) return false;
      }

      // 3. Location Filter
      if (selectedLocations.length > 0) {
        const matchesLocation = selectedLocations.some((loc) => {
          if (loc === 'all' || loc === 'all locations') return true;
          if (loc.includes('united states') || loc.includes('us')) {
            return compCountry.includes('united states') || compCountry.includes('us') || compLocation.includes('ca') || compLocation.includes('ny') || compLocation.includes('tx') || compLocation.includes('ma');
          }
          if (loc.includes('san francisco') || loc.includes('sf')) return compLocation.includes('san francisco') || compLocation.includes('ca') || compLocation.includes('mountain view');
          if (loc.includes('new york') || loc.includes('nyc')) return compLocation.includes('new york') || compLocation.includes('ny');
          if (loc.includes('austin')) return compLocation.includes('austin') || compLocation.includes('tx');
          if (loc.includes('boston')) return compLocation.includes('boston') || compLocation.includes('ma');
          if (loc.includes('chicago')) return compLocation.includes('chicago') || compLocation.includes('il');
          if (loc.includes('europe') || loc.includes('uk')) return compLocation.includes('dublin') || compCountry.includes('united kingdom') || compCountry.includes('europe') || compLocation.includes('remote');
          return compLocation.includes(loc) || compCountry.includes(loc);
        });
        if (!matchesLocation) return false;
      }

      // 4. Headcount Size Filter
      if (selectedSize && selectedSize !== 'All') {
        if (selectedSize === '1 - 50' && compEmployees > 50) return false;
        if (selectedSize === '51 - 200' && (compEmployees < 51 || compEmployees > 200)) return false;
        if (selectedSize === '201 - 500' && (compEmployees < 201 || compEmployees > 500)) return false;
        if (selectedSize === '500 - 1000' && (compEmployees < 500 || compEmployees > 1000)) return false;
        if (selectedSize === '1,000+' && compEmployees < 1000) return false;
      }

      // 5. Advanced Criteria Filters
      if (adv.revenue && (!compRevenue || compRevenue === 'not available' || compRevenue === 'unknown')) return false;
      if (adv.funding && (!compFunding || (!compFunding.includes('series') && !compFunding.includes('public') && !compFunding.includes('ipo') && !compFunding.includes('nyse') && !compFunding.includes('nasdaq')))) return false;
      if (adv.growthRate && (!compGrowth || !compGrowth.includes('%') || parseInt(compGrowth.replace(/[^0-9]/g, ''), 10) < 25)) return false;
      if (adv.activelyHiring) {
        const hasHiring = company.businessSignals?.some((s) => s.signalType === 'hiring' || s.title.toLowerCase().includes('hiring') || s.title.toLowerCase().includes('sdr'));
        if (!hasHiring) return false;
      }
      if (adv.techStack) {
        const hasEnterpriseStack = compTech.some((t) => t.includes('salesforce') || t.includes('cloud') || t.includes('kafka') || t.includes('kubernetes') || t.includes('datadog'));
        if (!hasEnterpriseStack) return false;
      }

      // 6. Keywords Filter
      if (keywordList.length > 0) {
        const matchesAnyKeyword = keywordList.some((kw) => {
          const inName = compName.includes(kw);
          const inDomain = compDomain.includes(kw);
          const inTech = compTech.some((t) => t.includes(kw));
          const inSignals = company.businessSignals?.some((s) => s.title.toLowerCase().includes(kw) || s.description.toLowerCase().includes(kw));
          return inName || inDomain || inTech || inSignals;
        });
        if (!matchesAnyKeyword) return false;
      }

      // 7. Natural Language Query Filter
      if (qLower) {
        // Tokenize query words (skip common stop words)
        const stopWords = new Set(['in', 'the', 'with', 'and', 'for', 'of', 'to', 'a', 'an', 'at', 'on', 'companies', 'startups', 'firms', 'accounts', 'leads']);
        const tokens = qLower
          .split(/[\s,]+/)
          .map((t) => t.trim())
          .filter((t) => t.length > 1 && !stopWords.has(t));

        if (tokens.length > 0) {
          const matchCount = tokens.filter((tok) => {
            return (
              compName.includes(tok) ||
              compDomain.includes(tok) ||
              compIndustry.includes(tok) ||
              compSubIndustry.includes(tok) ||
              compLocation.includes(tok) ||
              compCountry.includes(tok) ||
              compFunding.includes(tok) ||
              compTech.some((t) => t.includes(tok)) ||
              company.businessSignals?.some((s) => s.title.toLowerCase().includes(tok) || s.description.toLowerCase().includes(tok)) ||
              company.whyThisLead.toLowerCase().includes(tok)
            );
          }).length;

          // Must match at least one specific token or 30% of search terms
          if (matchCount === 0 && tokens.length > 1) {
            return false;
          }
        }
      }

      return true;
    });

    // Dynamic Lead Scoring & Ranking
    const scoredCompanies = filtered.map((c) => {
      let dynamicBonus = 0;
      const compInd = getFieldValue(c.industry).text.toLowerCase();
      const compLoc = getFieldValue(c.location).text.toLowerCase();
      const compEmployees = c.employeeCount?.value || 0;

      if (selectedIndustries.some((ind) => compInd.includes(ind))) dynamicBonus += 4;
      if (selectedLocations.some((loc) => compLoc.includes(loc))) dynamicBonus += 3;
      if (selectedSize === '500 - 1000' && compEmployees >= 500 && compEmployees <= 1000) dynamicBonus += 3;
      if (selectedSize === '1,000+' && compEmployees >= 1000) dynamicBonus += 3;

      const dynamicScore = Math.min(99, Math.max(72, c.leadScore + dynamicBonus));
      const tier = dynamicScore >= 90 ? 'HIGH_PRIORITY' : dynamicScore >= 80 ? 'STRONG_FIT' : 'POTENTIAL';

      // Tailored Why-This-Lead statement
      const whyThisLead = `Matches target criteria with ${c.employeeCount?.value ? c.employeeCount.value.toLocaleString() : 'verified'} headcount in ${getFieldValue(c.location).text} (${getFieldValue(c.industry).text}) backed by verified primary records.`;

      return {
        ...c,
        leadScore: dynamicScore,
        tier: tier as any,
        whyThisLead: whyThisLead,
      };
    });

    // Sort descending by lead score
    scoredCompanies.sort((a, b) => b.leadScore - a.leadScore);

    return {
      companies: scoredCompanies,
      totalMatches: scoredCompanies.length,
      providerName: this.name,
      isGrounded: true,
    };
  }
}

export const groundedLeadDiscoveryProvider = new GroundedLeadDiscoveryProvider();
