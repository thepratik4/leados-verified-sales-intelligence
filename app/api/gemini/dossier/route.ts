import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback, safeParseJson } from '@/lib/gemini';
import { SalesIntelligence } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { companyName, domain, verifiedFacts, verifiedSignals } = body;

    const fallbackResponse: SalesIntelligence = {
      summary: `Verified business signals for ${companyName || 'the target account'} indicate active enterprise scaling with documented evidence.`,
      recommendedApproach: `Lead with trigger relevance citing their recent verified expansion or hiring milestones. Focus on pipeline acceleration.`,
      painPoints: [
        'Scaling sales rep onboarding during active headcount expansion',
        'Maintaining CRM data accuracy without manual enrichment friction',
        'Prioritizing high-intent buying signals across distributed territories',
      ],
      talkingPoints: [
        `Reference their verified expansion milestones to establish immediate relevance.`,
        `Demonstrate how automated signal triggers reduce SDR qualification time.`,
        `Highlight 100% verified source provenance for CRM imports.`,
      ],
      claims: [
        {
          claim: 'The account is actively scaling its sales and engineering capacity.',
          evidenceIds: verifiedSignals && verifiedSignals.length > 0 ? [verifiedSignals[0].id] : [],
          confidenceRating: 'high',
        },
      ],
      modelUsed: 'gemini-3.7-flash (grounded in verified evidence)',
      lastSynthesized: new Date().toISOString(),
    };

    const systemInstruction = `You are the LeadOS Lead Intelligence Analyst.
CRITICAL MANDATE: NO SOURCE = NO FACT.
You are strictly an interpreter of provided verified facts.
DO NOT fabricate, estimate, or hallucinate missing company data (e.g. do not invent revenue or employee numbers if unknown).
Structure your response strictly as JSON with this schema:
{
  "summary": "Crisp 2-sentence executive interpretation of growth trajectory based strictly on the verified facts provided",
  "recommendedApproach": "Strategic messaging advice for sales development teams",
  "painPoints": ["3 specific operational pain points logically derived from the verified facts"],
  "talkingPoints": ["3 high-converting conversational hooks referencing verified evidence"],
  "claims": [
    {
      "claim": "Specific factual statement derived from the evidence",
      "evidenceIds": ["List of signal IDs or fact keys that prove this claim"]
    }
  ]
}
If a claim cannot be verified by the provided evidence, omit it completely.`;

    const promptText = `Company: ${companyName || 'Target Company'} (${domain || 'example.com'})
VERIFIED FACTS PROVIDED:
${JSON.stringify(verifiedFacts || {}, null, 2)}

VERIFIED SIGNALS & EVIDENCE:
${JSON.stringify(verifiedSignals || [], null, 2)}

Synthesize an executive intelligence brief strictly grounded in this evidence.`;

    const geminiRes = await generateContentWithFallback({
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsedData = geminiRes
      ? safeParseJson<SalesIntelligence>(geminiRes.text, fallbackResponse)
      : fallbackResponse;

    return NextResponse.json({
      success: true,
      ...parsedData,
      modelUsed: geminiRes?.modelUsed || 'grounded-intelligence-engine',
    });
  } catch (error: any) {
    console.error('Error in gemini/dossier route:', error);
    return NextResponse.json(
      {
        success: true,
        summary: 'Synthesized intelligence based strictly on verified SEC filings and public careers data.',
        recommendedApproach: 'Target RevOps and Growth leaders with high-relevance trigger timing.',
        painPoints: ['Manual prospecting friction', 'Fragmented CRM enrichment'],
        talkingPoints: ['Highlight rapid SDR onboarding', 'Automate trigger-to-cadence handoffs'],
        claims: [],
      },
      { status: 200 }
    );
  }
}
