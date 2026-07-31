import { supabase } from '@/lib/supabase';

export interface MemoryContext {
  nickname?: string | null;
  study_goals?: string | null;
  favourite_subjects?: string | null;
  preferred_style?: string | null;
  preferred_language?: string | null;
  student_class?: string | null;
  stream?: string | null;
  board?: string | null;
  exam?: string | null;
  weak_subjects?: string | null;
  study_style?: string | null;
  daily_goals?: string | null;
}

export interface AIResponseContext {
  message: string;
  hasImage: boolean;
  style: string;
  language: string;
  mode: 'academic' | 'companion';
  history?: ChatTurn[];
  images?: string[] | null;
  fileContent?: string | null;
  memoryContext?: MemoryContext | null;
}

export interface ChatTurn {
  role: 'user' | 'model';
  content: string;
  image?: string;
}

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/avinex-ai`;

// ── Client-side in-memory cache (session-level) ──
interface CacheEntry {
  response: string;
  timestamp: number;
}
const clientCache = new Map<string, CacheEntry>();
const CACHE_TTL = 10 * 60 * 1000;

function getCacheKey(ctx: AIResponseContext): string | null {
  if (ctx.images?.length || ctx.fileContent || (ctx.history?.length ?? 0) > 0) return null;
  return `${ctx.message}|${ctx.style}|${ctx.language}|${ctx.mode}`;
}

// ── Request deduplication: prevent concurrent identical requests ──
const inFlightRequests = new Map<string, AbortController>();

const FRIENDLY_ERRORS: Record<number, string> = {
  400: 'Please ask a valid question.',
  429: 'You\'re asking questions too quickly. Please wait a few seconds and try again.',
  503: 'The AI service is temporarily unavailable. Please try again in a moment.',
  504: 'The AI is taking too long. Try asking a shorter or more specific question.',
};

export async function streamAIResponse(
  ctx: AIResponseContext,
  onChunk: (text: string) => void,
  onError: (error: string) => void,
  onComplete: (fullResponse: string) => void,
  signal?: AbortSignal,
  onStatus?: (status: string) => void
): Promise<void> {
  // Check client cache for cacheable requests
  const cKey = getCacheKey(ctx);
  if (cKey) {
    const cached = clientCache.get(cKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      const chunkSize = 300;
      for (let i = 0; i < cached.response.length; i += chunkSize) {
        onChunk(cached.response.slice(i, i + chunkSize));
        await new Promise((r) => setTimeout(r, 10));
      }
      onComplete(cached.response);
      return;
    }

    const existing = inFlightRequests.get(cKey);
    if (existing) {
      existing.abort();
      inFlightRequests.delete(cKey);
    }
  }

  const payload: Record<string, unknown> = {
    message: ctx.message,
    history: ctx.history || [],
    images: ctx.images || null,
    fileContent: ctx.fileContent || null,
    style: ctx.style,
    language: ctx.language,
    mode: ctx.mode,
    memoryContext: ctx.memoryContext || null,
  };

  const localController = new AbortController();
  const onAbort = () => localController.abort();
  if (signal) signal.addEventListener('abort', onAbort);

  if (cKey) inFlightRequests.set(cKey, localController);

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
      signal: localController.signal,
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const errMsg = (errBody as { error?: string })?.error;
      const friendly = FRIENDLY_ERRORS[response.status];
      onError(friendly || errMsg || 'The AI service is temporarily unavailable. Please try again in a moment.');
      return;
    }

    if (!response.body) {
      onError('The AI service is temporarily unavailable. Please try again in a moment.');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';
    let wasCached = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;

        try {
          const data = JSON.parse(jsonStr);
          if (data.error) {
            onError(data.error);
            return;
          }
          if (data.status) {
            onStatus?.(data.status);
            continue;
          }
          if (data.text) {
            fullResponse += data.text;
            onChunk(data.text);
          }
          if (data.done) {
            if (data.fullResponse) fullResponse = data.fullResponse;
            wasCached = !!data.cached;
            if (!wasCached && cKey && fullResponse.length > 50) {
              clientCache.set(cKey, { response: fullResponse, timestamp: Date.now() });
            }
            onComplete(fullResponse);
            return;
          }
        } catch {
          // Skip malformed chunks
        }
      }
    }

    if (cKey && fullResponse.length > 50) {
      clientCache.set(cKey, { response: fullResponse, timestamp: Date.now() });
    }
    onComplete(fullResponse);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      onComplete('');
      return;
    }
    if (err instanceof TypeError) {
      onError('Could not connect to the AI service. Please check your internet connection and try again.');
      return;
    }
    onError('The AI service is temporarily unavailable. Please try again in a moment.');
  } finally {
    if (signal) signal.removeEventListener('abort', onAbort);
    if (cKey) inFlightRequests.delete(cKey);
  }
}

export async function generateAIResponse(ctx: AIResponseContext): Promise<string> {
  return new Promise((resolve, reject) => {
    let full = '';
    streamAIResponse(
      ctx,
      (chunk) => { full += chunk; },
      (err) => reject(new Error(err)),
      (complete) => resolve(complete || full),
    );
  });
}

export function clearClientCache() {
  clientCache.clear();
}
