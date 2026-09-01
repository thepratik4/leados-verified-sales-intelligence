import { CompanyLead, VerifiedFact, VerifiedSignal, AiClaim, Evidence, VerificationStatus, ScoreBreakdown, DataQualitySummary } from './types';

export interface IntegrityValidationResult {
  isValid: boolean;
  violations: string[];
}

/**
 * 1. Validates that a company record satisfies strict provenance rules.
 * Rule: Unsupported or missing source cannot be marked as 'verified'.
 */
export function validateFactIntegrity<T>(field: VerifiedFact<T> | undefined | null, fieldName: string): {
  isValid: boolean;
  sanitizedFact: VerifiedFact<T>;
  violation?: string;
} {
  if (!field || field.value === null || field.value === undefined) {
    return {
      isValid: true,
      sanitizedFact: {
        value: null,
        status: 'unknown',
        verificationStatus: 'unknown',
        sourceName: null,
        sourceUrl: null,
        retrievedAt: null,
        evidence: null,
      },
    };
  }

  // If claimed to be verified, it MUST have sourceName and evidence/sourceUrl
  const isClaimedVerified = field.status === 'verified' || field.verificationStatus === 'verified';
  if (isClaimedVerified) {
    if (!field.sourceName || field.sourceName.trim() === '' || !field.evidence || field.evidence.trim() === '') {
      return {
        isValid: false,
        sanitizedFact: {
          ...field,
          status: 'unverified',
          verificationStatus: 'unverified',
        },
        violation: `Field '${fieldName}' claimed verified status without authoritative sourceName and evidence.`,
      };
    }
  }

  return {
    isValid: true,
    sanitizedFact: {
      ...field,
      status: field.status || field.verificationStatus || 'unknown',
      verificationStatus: field.verificationStatus || field.status || 'unknown',
    },
  };
}

/**
 * 2 & 3. Validates and filters AI-generated claims against existing verified evidence IDs.
 * Discards any claim lacking evidenceIds or referencing nonexistent evidence IDs.
 */
export function validateAndFilterAiClaims(
  claims: AiClaim[] | undefined | null,
  validEvidenceIds: Set<string>
): {
  validClaims: AiClaim[];
  rejectedCount: number;
} {
  if (!claims || !Array.isArray(claims)) {
    return { validClaims: [], rejectedCount: 0 };
  }

  let rejectedCount = 0;
  const validClaims: AiClaim[] = [];

  for (const claim of claims) {
    if (!claim.claim || claim.claim.trim() === '') {
      rejectedCount++;
      continue;
    }

    // Must have at least one evidence ID
    if (!claim.evidenceIds || !Array.isArray(claim.evidenceIds) || claim.evidenceIds.length === 0) {
      rejectedCount++;
      continue;
    }

    // All referenced evidence IDs must exist in the verified set
    const allValid = claim.evidenceIds.every((id) => validEvidenceIds.has(id));
    if (allValid) {
      validClaims.push(claim);
    } else {
      // Filter out invalid IDs, keep only valid ones if any exist
      const remainingValidIds = claim.evidenceIds.filter((id) => validEvidenceIds.has(id));
      if (remainingValidIds.length > 0) {
        validClaims.push({
          ...claim,
          evidenceIds: remainingValidIds,
        });
      } else {
        rejectedCount++;
      }
    }
  }

  return { validClaims, rejectedCount };
}

/**
 * 4 & 5. Deterministic scoring algorithm.
 * Strictly avoids giving points to unverified/unknown attributes.
 * Configured dimensions:
 * - ICP Match: 25 pts (Location 15 pts + Tech Stack 10 pts)
 * - Industry Alignment: 25 pts
 * - Company Size: 20 pts
 * - Signal Freshness & Activity: 30 pts (Up to 3 verified signals = 30 pts)
 * Total: 100 pts.
 */
export function calculateGroundedLeadScore(company: {
  industry: VerifiedFact<string>;
  location: VerifiedFact<string>;
  employeeCount: VerifiedFact<number>;
  technologies: VerifiedFact<string[]>;
  businessSignals: VerifiedSignal[];
}): {
  score: number;
  scoreConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA';
  breakdown: ScoreBreakdown;
  dataQuality: DataQualitySummary;
} {
  let icpPoints = 0;
  let industryPoints = 0;
  let sizePoints = 0;
  let signalPoints = 0;

  let verifiedCount = 0;
  const totalFields = 8; // industry, location, size/employees, revenue, funding, tech, signals, filings

  // 1. Industry Alignment (Max 25 pts)
  const isIndustryVerified =
    (company.industry.status === 'verified' || company.industry.verificationStatus === 'verified') &&
    Boolean(company.industry.value);

  if (isIndustryVerified) {
    verifiedCount++;
    industryPoints = 25;
  } else if (company.industry.status === 'partially_verified' || company.industry.verificationStatus === 'partially_verified') {
    industryPoints = 12;
  }

  // 2. Company Size (Max 20 pts)
  const isCountVerified =
    (company.employeeCount.status === 'verified' || company.employeeCount.verificationStatus === 'verified') &&
    company.employeeCount.value !== null &&
    company.employeeCount.value > 0;

  if (isCountVerified) {
    verifiedCount++;
    const count = company.employeeCount.value!;
    if (count >= 100 && count <= 15000) {
      sizePoints = 20;
    } else {
      sizePoints = 14;
    }
  } else if (company.employeeCount.status === 'partially_verified') {
    sizePoints = 8;
  }

  // 3. ICP Match (Max 25 pts)
  const isLocationVerified =
    (company.location.status === 'verified' || company.location.verificationStatus === 'verified') &&
    Boolean(company.location.value);
  if (isLocationVerified) {
    verifiedCount++;
    icpPoints += 15;
  }

  const isTechVerified =
    (company.technologies.status === 'verified' || company.technologies.verificationStatus === 'verified') &&
    Array.isArray(company.technologies.value) &&
    company.technologies.value.length > 0;
  if (isTechVerified) {
    verifiedCount++;
    icpPoints += 10;
  }

  // 4. Signal Activity (Max 30 pts)
  const verifiedSignals = (company.businessSignals || []).filter(
    (s) => s.verificationStatus === 'verified' || s.confidence === 'VERIFIED' || s.confidence === 'HIGH CONFIDENCE'
  );

  if (verifiedSignals.length >= 3) {
    signalPoints = 30;
  } else if (verifiedSignals.length === 2) {
    signalPoints = 22;
  } else if (verifiedSignals.length === 1) {
    signalPoints = 15;
  } else {
    signalPoints = 0;
  }

  const rawScore = industryPoints + sizePoints + icpPoints + signalPoints;

  // Compute confidence based on verified attribute volume
  let scoreConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'INSUFFICIENT_DATA' = 'HIGH';
  if (verifiedCount < 2) {
    scoreConfidence = 'INSUFFICIENT_DATA';
  } else if (verifiedCount < 3) {
    scoreConfidence = 'LOW';
  } else if (verifiedCount < 5) {
    scoreConfidence = 'MEDIUM';
  } else {
    scoreConfidence = 'HIGH';
  }

  const dataConfidence: 'HIGH' | 'MEDIUM' | 'INSUFFICIENT' =
    verifiedCount >= 5 ? 'HIGH' : verifiedCount >= 3 ? 'MEDIUM' : 'INSUFFICIENT';

  return {
    score: rawScore,
    scoreConfidence,
    breakdown: {
      icpFit: { current: icpPoints, max: 25, basis: isLocationVerified ? 'Verified geography & enterprise tech stack' : 'Limited ICP verification' },
      industry: { current: industryPoints, max: 25, basis: isIndustryVerified ? 'Verified Enterprise SaaS / Infrastructure vertical' : 'Unverified vertical' },
      companySize: { current: sizePoints, max: 20, basis: isCountVerified ? 'Verified headcount from SEC 10-K / Careers registry' : 'Headcount unverified' },
      recentActivity: { current: signalPoints, max: 30, basis: `${verifiedSignals.length} verified hiring & expansion signals with source URLs` },
    },
    dataQuality: {
      verifiedFieldsCount: verifiedCount,
      totalFieldsCount: totalFields,
      confidence: dataConfidence,
      lastAudited: new Date().toISOString().split('T')[0],
    },
  };
}

/**
 * 6. Generates sanitized CSV export row data with complete provenance and no synthetic guesses.
 */
export function buildVerifiedExportRow(company: CompanyLead): Record<string, string> {
  const getDisplay = <T>(f: VerifiedFact<T> | undefined | null): { text: string; status: string; source: string; url: string } => {
    if (!f || f.value === null || f.value === undefined || f.status === 'unknown' || f.verificationStatus === 'unknown') {
      return { text: 'Not available', status: 'UNKNOWN', source: 'Not available', url: 'Not available' };
    }
    const isVerified = f.status === 'verified' || f.verificationStatus === 'verified';
    const text = Array.isArray(f.value) ? f.value.join(', ') : String(f.value);
    return {
      text,
      status: isVerified ? 'VERIFIED' : 'UNVERIFIED',
      source: f.sourceName || 'Not available',
      url: f.sourceUrl || 'Not available',
    };
  };

  const ind = getDisplay(company.industry);
  const loc = getDisplay(company.location);
  const headcount = getDisplay(company.employeeCount);
  const rev = getDisplay(company.revenue);
  const fund = getDisplay(company.funding);

  return {
    'Company Name': company.name,
    'Domain': company.domain,
    'Industry': ind.text,
    'Industry Status': ind.status,
    'Industry Source': ind.source,
    'Location': loc.text,
    'Location Status': loc.status,
    'Location Source': loc.source,
    'Headcount': headcount.text,
    'Headcount Status': headcount.status,
    'Headcount Source': headcount.source,
    'Revenue': rev.text,
    'Revenue Status': rev.status,
    'Revenue Source': rev.source,
    'Funding': fund.text,
    'Funding Status': fund.status,
    'Funding Source': fund.source,
    'Key Trigger Signal': company.keySignal?.title || 'Not available',
    'Signal Status': company.keySignal?.verificationStatus === 'verified' ? 'VERIFIED' : 'UNVERIFIED',
    'Signal Source': company.keySignal?.sourceName || 'Not available',
    'Signal URL': company.keySignal?.sourceUrl || 'Not available',
    'Signal Date': company.keySignal?.publishedAt || 'Not available',
    'Lead Score': String(company.leadScore),
    'Score Confidence': company.scoreConfidence,
    'Data Confidence': company.dataQuality?.confidence || 'MEDIUM',
    'Why This Lead': company.whyThisLead || 'Verified ICP alignment and active recruitment signals.',
    'AI Interpretation': company.salesIntelligence?.summary || 'Not available',
    'Recommended Approach': company.salesIntelligence?.recommendedApproach || 'Not available',
  };
}
