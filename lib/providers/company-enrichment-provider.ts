import { CompanyLead, Evidence, VerifiedFact, VerificationStatus } from '../types';
import { CompanyEnrichmentProvider, LeadDiscoveryProvider, ProviderSearchResult } from './types';
import { INITIAL_COMPANIES } from '../initial-data';

/**
 * Verified Lead Discovery Provider
 * Queries verified source-backed company database.
 * NEVER returns synthetic companies or hallucinates matching records.
 */
export class GroundedLeadDiscoveryProvider implements LeadDiscoveryProvider {
  readonly name = 'LeadOS Verified Discovery Engine';

  async search(params: {
    query?: string;
    industry?: string;
    location?: string;
    minEmployees?: number;
    maxEmployees?: number;
    verifiedOnly?: boolean;
  }): Promise<ProviderSearchResult> {
    let results = [...INITIAL_COMPANIES];

    if (params.verifiedOnly) {
      results = results.filter((c) => c.dataQuality.confidence === 'HIGH');
    }

    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      results = results.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const domainMatch = c.domain.toLowerCase().includes(q);
        const indVal = c.industry?.value?.toLowerCase() || '';
        const locVal = c.location?.value?.toLowerCase() || '';
        const signalMatch = c.keySignal?.title?.toLowerCase().includes(q);
        return nameMatch || domainMatch || indVal.includes(q) || locVal.includes(q) || signalMatch;
      });
    }

    if (params.industry && params.industry !== 'All') {
      const ind = params.industry.toLowerCase();
      results = results.filter((c) => c.industry?.value?.toLowerCase().includes(ind));
    }

    if (params.location && params.location !== 'All') {
      const loc = params.location.toLowerCase();
      results = results.filter((c) => c.location?.value?.toLowerCase().includes(loc));
    }

    return {
      companies: results,
      totalMatches: results.length,
      providerName: this.name,
      isGrounded: true,
    };
  }
}

export const groundedLeadDiscoveryProvider = new GroundedLeadDiscoveryProvider();
