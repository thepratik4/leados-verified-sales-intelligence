import { NextRequest, NextResponse } from 'next/server';
import { generateContentWithFallback, safeParseJson } from '@/lib/gemini';

interface OutreachCadenceResponse {
  sequence: Array<{
    step: number;
    title: string;
    subject: string;
    body: string;
    verifiedSignalCited: string;
  }>;
}

export async function POST(req: NextRequest) {
  let fallbackResponse: OutreachCadenceResponse = {
    sequence: [
      {
        step: 1,
        title: 'Initial Personalized Touchpoint',
        subject: `Quick thought regarding your recent expansion`,
        body: `Hi there,\n\nNoticed your recent verified team updates. When teams hit this inflection point, manual pipeline prospecting often slows down newly onboarded reps.\n\nWe help B2B leaders streamline account research with 100% verified source-backed signals.\n\nWould you be open to a brief 10-minute intro next Tuesday?\n\nBest,\nSarah`,
        verifiedSignalCited: 'Verified Team Expansion',
      },
      {
        step: 2,
        title: 'Value Metric Follow-up (Day +3)',
        subject: `Re: outbound efficiency`,
        body: `Hi there,\n\nFollowing up on my previous note. One key advantage our partners leverage is real-time trigger alerts on high-intent accounts backed directly by verified regulatory and careers portal data.\n\nHappy to share a 2-page benchmark report customized for your team.\n\nWould that be helpful?\n\nBest,\nSarah`,
        verifiedSignalCited: 'Verified Team Expansion',
      },
      {
        step: 3,
        title: 'Executive Perspective & Polite Breakaway (Day +7)',
        subject: `Last check-in`,
        body: `Hi there,\n\nI know you're super focused on quarter goals. If pipeline automation and verified data aren't priorities right now, no worries at all.\n\nIf you ever need verified corporate signals and direct-dial data for your outbound team, feel free to keep us in mind.\n\nBest,\nSarah`,
        verifiedSignalCited: 'Verified Team Expansion',
      },
    ],
  };

  try {
    const body = await req.json().catch(() => ({}));
    const { companyName, contactName, contactRole, industry, triggerSignal, triggerSource, tone } = body;

    fallbackResponse = {
      sequence: [
        {
          step: 1,
          title: 'Initial Personalized Touchpoint',
          subject: `Quick thought regarding ${companyName || 'your team'}'s recent expansion`,
          body: `Hi ${contactName || 'there'},\n\nNoticed that ${companyName || 'your team'} recently had verified updates regarding "${triggerSignal || 'scaling GTM operations'}".\n\nWhen teams hit this inflection point, manual pipeline prospecting often slows down newly onboarded reps.\n\nWe help similar ${industry || 'B2B'} leaders streamline account research with 100% verified source-backed signals.\n\nWould you be open to a brief 10-minute intro next Tuesday?\n\nBest,\nSarah`,
          verifiedSignalCited: triggerSignal || 'Verified Team Expansion',
        },
        {
          step: 2,
          title: 'Value Metric Follow-up (Day +3)',
          subject: `Re: ${companyName || 'your team'} outbound efficiency`,
          body: `Hi ${contactName || 'there'},\n\nFollowing up on my previous note. One key advantage our partners leverage is real-time trigger alerts on high-intent accounts backed directly by verified regulatory and careers portal data.\n\nHappy to share a 2-page benchmark report customized for ${companyName || 'your team'}.\n\nWould that be helpful?\n\nBest,\nSarah`,
          verifiedSignalCited: triggerSignal || 'Verified Team Expansion',
        },
        {
          step: 3,
          title: 'Executive Perspective & Polite Breakaway (Day +7)',
          subject: `Last check-in for ${companyName || 'your team'}`,
          body: `Hi ${contactName || 'there'},\n\nI know you're super focused on quarter goals. If pipeline automation and verified data aren't priorities right now, no worries at all.\n\nIf you ever need verified corporate signals and direct-dial data for your outbound team, feel free to keep us in mind.\n\nBest,\nSarah`,
          verifiedSignalCited: triggerSignal || 'Verified Team Expansion',
        },
      ],
    };

    const systemInstruction = `You are an elite B2B Sales Development copywriter for LeadOS.
DATA INTEGRITY MANDATE:
- Generate email outreach tailored ONLY to the verified trigger signal provided.
- DO NOT invent or mention unverified revenue, guessed employee counts, fake funding amounts, or fabricated news.
- Keep the emails concise, consultative, and focused on solving prospecting bottlenecks.
Output strictly JSON:
{
  "sequence": [
    {
      "step": 1,
      "title": "Email 1: Trigger & Relevance",
      "subject": "Subject line",
      "body": "Email body text",
      "verifiedSignalCited": "Name of the signal referenced"
    },
    {
      "step": 2,
      "title": "Email 2: Value Proof",
      "subject": "Subject line",
      "body": "Email body text",
      "verifiedSignalCited": "Name of the signal referenced"
    },
    {
      "step": 3,
      "title": "Email 3: Polite Breakaway",
      "subject": "Subject line",
      "body": "Email body text",
      "verifiedSignalCited": "Name of the signal referenced"
    }
  ]
}`;

    const promptText = `Company: ${companyName || 'Target Company'}\nProspect Name: ${contactName || 'Executive'}\nRole: ${contactRole || 'VP Sales / RevOps'}\nIndustry: ${industry || 'Technology'}\nVerified Trigger Signal: ${triggerSignal || 'Company Expansion'}\nTrigger Source: ${triggerSource || 'Official Careers Portal / SEC'}\nTone: ${tone || 'Professional & Consultative'}`;

    const geminiRes = await generateContentWithFallback({
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsedData = geminiRes
      ? safeParseJson<OutreachCadenceResponse>(geminiRes.text, fallbackResponse)
      : fallbackResponse;

    return NextResponse.json({
      success: true,
      ...parsedData,
      modelUsed: geminiRes?.modelUsed || 'grounded-outreach-engine',
    });
  } catch (error: any) {
    console.error('Error in gemini/outreach route:', error);
    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}
