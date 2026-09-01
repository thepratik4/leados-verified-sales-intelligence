import { VerifiedFact, Evidence, VerifiedSignal, CompanyLead, VerificationStatus } from '../types';

export interface ProviderSearchResult {
  companies: CompanyLead[];
  totalMatches: number;
  providerName: string;
  isGrounded: boolean;
}

export interface LeadDiscoveryProvider {
  name: string;
  search(params: {
    query?: string;
    industry?: string;
    location?: string;
    minEmployees?: number;
    maxEmployees?: number;
    verifiedOnly?: boolean;
  }): Promise<ProviderSearchResult>;
}

export interface CompanyEnrichmentProvider {
  name: string;
  enrichByDomain(domain: string): Promise<{
    facts: Partial<Record<keyof CompanyLead, VerifiedFact<any>>>;
    evidence: Evidence[];
  }>;
}

export interface SignalProvider {
  name: string;
  getSignalsForCompany(companyId: string, domain: string): Promise<VerifiedSignal[]>;
}

export interface SecEdgarFilingResult {
  cik: string;
  companyName: string;
  fiscalYear: number;
  revenueFact: VerifiedFact<string>;
  headcountFact: VerifiedFact<number>;
  filingEvidence: Evidence;
}

export interface CareersPortalResult {
  domain: string;
  totalOpenRoles: number;
  openRolesSummary: string;
  evidence: Evidence;
  signal: VerifiedSignal;
}
