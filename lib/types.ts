export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified' | 'unknown';

export type EvidenceSourceType =
  | 'official_company'
  | 'official_careers'
  | 'official_press_release'
  | 'sec_filing'
  | 'government'
  | 'reputable_public_source'
  | 'engineering_blog';

export interface Evidence {
  id: string;
  companyId: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: EvidenceSourceType;
  title: string;
  publishedAt?: string;
  retrievedAt: string;
  excerpt: string;
  claim: string;
  verificationStatus: VerificationStatus;
}

export interface VerifiedFact<T> {
  value: T | null;
  status?: VerificationStatus;
  verificationStatus?: VerificationStatus; // Alias for backward compatibility
  sourceName: string | null;
  sourceUrl: string | null;
  sourceType?: EvidenceSourceType | null;
  publishedAt?: string | null;
  retrievedAt: string | null;
  evidence: string | null;
  evidenceId?: string | null;
}

// Backward compatible alias
export type ProvenanceField<T> = VerifiedFact<T>;

export type SignalType =
  | 'Hiring'
  | 'Expansion'
  | 'Funding'
  | 'Product Launch'
  | 'Leadership'
  | 'Growth'
  | 'Technology'
  | 'Partnership'
  | 'Other'
  | 'hiring'
  | 'exec'
  | 'expansion'
  | 'funding'
  | 'product'
  | 'earnings'
  | 'tech'
  | 'filing';

export interface VerifiedSignal {
  id: string;
  companyId?: string;
  type?: SignalType;
  signalType: SignalType; // for compatibility
  title: string;
  description: string;
  sourceUrl: string;
  sourceName: string; // e.g. "SEC Form 10-K", "Cloudflare Official Careers Portal"
  sourceType?: EvidenceSourceType;
  sourceEvidenceId?: string;
  publishedAt: string;
  retrievedAt: string;
  verificationStatus: VerificationStatus;
  confidence: 'HIGH CONFIDENCE' | 'MED CONFIDENCE' | 'VERIFIED' | 'high' | 'medium' | 'low';
  icon?: string;
}

export type Signal = VerifiedSignal;

export interface AiClaim {
  claim: string;
  evidenceIds: string[]; // references verified signal IDs or fact keys
  confidenceRating?: 'high' | 'medium' | 'low';
}

export interface SalesIntelligence {
  summary: string;
  recommendedApproach: string;
  painPoints: string[];
  talkingPoints: string[];
  claims: AiClaim[];
  modelUsed?: string;
  lastSynthesized?: string;
}

export interface ScoreBreakdown {
  icpFit: { current: number; max: number; basis?: string };
  industry: { current: number; max: number; basis?: string };
  companySize: { current: number; max: number; basis?: string };
  recentActivity: { current: number; max: number; basis?: string };
}

export interface DataQualitySummary {
  verifiedFieldsCount: number;
  totalFieldsCount: number;
  confidence: 'HIGH' | 'MEDIUM' | 'INSUFFICIENT';
  lastAudited: string;
}

export interface CompanyLead {
  id: string;
  name: string;
  domain: string;
  isDemoOnly?: boolean;
  demoLabel?: string; // e.g. "VERIFIED SOURCE DATA" or "DEMO DATA — NOT VERIFIED"
  
  // Provenance-backed factual fields (VerifiedFact<T>)
  industry: VerifiedFact<string>;
  subIndustry?: VerifiedFact<string>;
  location: VerifiedFact<string>;
  country: VerifiedFact<string>;
  size: VerifiedFact<string>; // bracket, e.g. "1000-5000"
  employeeCount: VerifiedFact<number>;
  revenue: VerifiedFact<string>;
  funding: VerifiedFact<string>;
  growthRate: VerifiedFact<string>;
  foundedYear?: VerifiedFact<number>;
  secFilingCik?: VerifiedFact<string>;
  technologies: VerifiedFact<string[]>;

  // Complete Evidence store for this company
  evidenceList?: Evidence[];
  
  // Deterministic lead score
  leadScore: number; // 0 - 100
  scoreConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA';
  tier: 'HIGH_PRIORITY' | 'STRONG_FIT' | 'POTENTIAL' | 'UNVERIFIED';
  status: 'NEW' | 'ENGAGED' | 'SAVED' | 'ARCHIVED';
  initial: string;
  badgeColor?: string;
  logoUrl?: string;
  
  // Detected signals & evidence
  keySignal: VerifiedSignal;
  businessSignals: VerifiedSignal[];
  
  // AI Interpretation layer (traceable to evidence)
  whyThisLead: string;
  salesIntelligence: SalesIntelligence;
  scoreBreakdown: ScoreBreakdown;
  dataQuality: DataQualitySummary;
  
  // Local state / metadata
  lastViewed?: string;
  savedInListIds?: string[];
  notes?: string;
}

export interface LeadCohortList {
  id: string;
  name: string;
  description?: string;
  leadCount: number;
  lastUpdated: string;
  colorType?: 'primary' | 'warning' | 'info' | 'success' | 'dim';
  icon?: string;
  companyIds: string[];
}

export interface ActivityEvent {
  id: string;
  time: string;
  dateGroup: 'TODAY' | 'YESTERDAY' | 'EARLIER';
  dateLabel?: string;
  type: 'export' | 'list_created' | 'search' | 'lead_analyzed' | 'outreach' | 'lead_saved' | 'bookmark' | 'audit';
  title: string;
  description: string;
  highlightText?: string;
  isAiAnalysis?: boolean;
  actionLabel?: string;
  actionTarget?: {
    tab: string;
    entityId?: string;
  };
}

export interface SearchFilterState {
  aiPrompt: string;
  industries: string[];
  locations: string[];
  companySize: string;
  keywords: string;
  verifiedOnly?: boolean;
  advancedFilters: {
    revenue: boolean;
    funding: boolean;
    growthRate: boolean;
    activelyHiring: boolean;
    techStack: boolean;
  };
  customFilters: string[];
}
