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
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

interface GenerateOptions {
  contents: string | any;
  config?: GenerateContentConfig;
  preferredModel?: string;
  maxRetriesPerModel?: number;
  timeoutMs?: number;
}

/**
 * Executes a Gemini generateContent request with automatic retry, timeout protection,
 * and fallback to secondary models.
 */
export async function generateContentWithFallback(
  options: GenerateOptions
): Promise<{ text: string; modelUsed: string } | null> {
  const ai = getGenAIClient();
  if (!ai) {
    return null;
  }

  const modelsToTry = options.preferredModel
    ? [options.preferredModel, ...FALLBACK_MODELS.filter((m) => m !== options.preferredModel)]
    : FALLBACK_MODELS;

  const timeoutMs = options.timeoutMs ?? 3500;

  for (const model of modelsToTry) {
    try {
      // Use Promise.race to guarantee sub-3.5s response
      const generatePromise = ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
      );

      const response: any = await Promise.race([generatePromise, timeoutPromise]);
      const text = response?.text;
      if (text !== undefined && text !== null) {
        return { text, modelUsed: model };
      }
    } catch (err: any) {
      // Model failed or timed out, gracefully continue to next or fallback
      continue;
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
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const jsonSubstring = rawText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonSubstring) as T;
      } catch {
        return fallback;
      }
    }
    return fallback;
  }
}
