import { NextRequest, NextResponse } from 'next/server';
import { getQuranFoundationAyahAudio, isQuranFoundationAudioApiConfigured, listQuranFoundationRecitations } from '@/lib/quran-foundation/recitations';
import { isVercelWafRateLimitEnabled } from '@/lib/api/vercel-waf-rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function isRateLimited(request: NextRequest): boolean {
  const now = Date.now();
  const key = request.headers.get('x-real-ip') || 'unknown-client';
  const current = requestWindows.get(key);
  if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
    requestWindows.set(key, { startedAt: now, count: 1 });
    if (requestWindows.size > 2_000) {
      for (const [ip, window] of requestWindows) if (now - window.startedAt >= RATE_WINDOW_MS) requestWindows.delete(ip);
    }
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
}

export async function GET(request: NextRequest) {
  if (!isVercelWafRateLimitEnabled()) {
    return json({ error: 'Quran Foundation audio is unavailable until edge rate limiting is configured.', code: 'EDGE_RATE_LIMIT_REQUIRED' }, 503);
  }
  if (isRateLimited(request)) return json({ error: 'Too many audio requests.' }, 429);
  if (!isQuranFoundationAudioApiConfigured()) {
    return json({ error: 'Quran Foundation audio scope is not configured.', code: 'QF_AUDIO_NOT_CONFIGURED' }, 503);
  }
  const language = request.nextUrl.searchParams.get('language') === 'id' ? 'id' : 'en';
  const recitationId = request.nextUrl.searchParams.get('recitation');
  const surahNumber = request.nextUrl.searchParams.get('surah');
  try {
    if (recitationId !== null || surahNumber !== null) {
      if (!recitationId || !surahNumber) return json({ error: 'Both recitation and surah are required.' }, 400);
      const id = Number(recitationId);
      const surah = Number(surahNumber);
      const files = await getQuranFoundationAyahAudio(id, surah);
      return json({ files, recitation: id, surah });
    }
    const recitations = await listQuranFoundationRecitations(language);
    return json({ recitations, language });
  } catch {
    return json({ error: 'Quran Foundation audio is temporarily unavailable.' }, 502);
  }
}
