import { GoogleGenAI, GenerateContentConfig } from '@google/genai';

let genAIInstance: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  if (!genAIInstance) {
    genAIInstance = new GoogleGenAI({
      apiKey,
    });
  }
  return genAIInstance;
}

const FALLBACK_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

interface GenerateOptions {
  contents: string | any;
  config?: GenerateContentConfig;
  preferredModel?: string;
  maxRetriesPerModel?: number;
}

/**
 * Helper to pause execution for a given number of milliseconds.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes a Gemini generateContent request with automatic retry and fallback to secondary models
 * if a model returns 503 (high demand), 429 (rate limit), or temporary unavailable status.
 */
export async function generateContentWithFallback(
  options: GenerateOptions
): Promise<{ text: string; modelUsed: string } | null> {
  const ai = getGenAIClient();
  if (!ai) {
    console.warn('Gemini API key not configured or client initialization failed.');
    return null;
  }

  const modelsToTry = options.preferredModel
    ? [options.preferredModel, ...FALLBACK_MODELS.filter((m) => m !== options.preferredModel)]
    : FALLBACK_MODELS;

  const maxRetries = options.maxRetriesPerModel ?? 1;
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });

        const text = response.text;
        if (text !== undefined && text !== null) {
          return { text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code || '';
        const errorMessage = err?.message || String(err);
        const isTransient =
          status === 503 ||
          status === 429 ||
          status === 'UNAVAILABLE' ||
          errorMessage.includes('high demand') ||
          errorMessage.includes('quota') ||
          errorMessage.includes('rate limit');

        if (attempt < maxRetries && isTransient) {
          // Brief exponential backoff before retrying same model
          await sleep(500 * (attempt + 1));
          continue;
        } else {
          // Model failed or attempts exhausted, try next fallback model
          break;
        }
      }
    }
  }

  return null;
}

/**
 * Helper to safely extract and parse JSON from a model response string.
 */
export function safeParseJson<T>(rawText: string | null | undefined, fallback: T): T {
  if (!rawText) return fallback;

  try {
    let clean = rawText.trim();
    // Remove markdown code blocks if present
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    return JSON.parse(clean) as T;
  } catch (err) {
    console.warn('Failed to parse JSON from model output:', err);
    return fallback;
  }
}
