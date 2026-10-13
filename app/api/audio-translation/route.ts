import { NextRequest, NextResponse } from 'next/server';
import { cleanTranslationForSpeech } from '@/lib/audio/speech-translation';
import { fetchSurahWithWBW } from '@/lib/api/quran-corpus-api';

export const runtime = 'nodejs';

/**
 * Splits text into chunks <= 160 chars respecting sentence and word boundaries
 */
function splitIntoTtsChunks(text: string, maxLen = 160): string[] {
  if (text.length <= maxLen) return [text];

  const words = text.split(' ');
  const chunks: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxLen) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) chunks.push(current);
      current = word;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

// In-memory cache for ultra-fast subsequent lookups
const ttsBufferCache = new Map<string, Buffer>();
const MAX_CACHE_ENTRIES = 300;

function setTtsCache(key: string, buffer: Buffer) {
  if (ttsBufferCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = ttsBufferCache.keys().next().value;
    if (oldestKey) ttsBufferCache.delete(oldestKey);
  }
  ttsBufferCache.set(key, buffer);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let text = searchParams.get('text');
  const surahStr = searchParams.get('surah');
  const ayahStr = searchParams.get('ayah');

  // If text not provided directly, resolve via surah & ayah from corpus dataset
  if (!text && surahStr && ayahStr) {
    const surahNum = parseInt(surahStr, 10);
    const ayahNum = parseInt(ayahStr, 10);
    if (!isNaN(surahNum) && !isNaN(ayahNum)) {
      try {
        const ayahs = await fetchSurahWithWBW(surahNum);
        const match = ayahs.find((a) => a.ayahNumber === ayahNum);
        if (match?.textIndo) {
          text = match.textIndo;
        }
      } catch (err) {
        console.warn('[AudioTranslation] Failed to lookup translation for', surahNum, ayahNum, err);
      }
    }
  }

  if (!text || !text.trim()) {
    return new NextResponse('Missing text query parameter', { status: 400 });
  }

  const cleaned = cleanTranslationForSpeech(text);
  if (!cleaned) {
    return new NextResponse('Empty text after normalization', { status: 400 });
  }

  // Check in-memory cache for instant < 1ms response
  const cacheKey = cleaned.toLowerCase();
  if (ttsBufferCache.has(cacheKey)) {
    const cached = ttsBufferCache.get(cacheKey)!;
    return new NextResponse(new Uint8Array(cached), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(cached.length),
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
        'Accept-Ranges': 'bytes',
        'X-Cache': 'HIT',
      },
    });
  }

  try {
    const chunks = splitIntoTtsChunks(cleaned, 160);

    // Parallel synthesis across all chunks
    const fetchPromises = chunks.map(async (chunk) => {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 604800 },
      });

      if (!res.ok) {
        throw new Error(`Google TTS returned HTTP ${res.status}`);
      }

      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    });

    const buffers = await Promise.all(fetchPromises);
    const combined = Buffer.concat(buffers);

    setTtsCache(cacheKey, combined);

    return new NextResponse(new Uint8Array(combined), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(combined.length),
        'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
        'Accept-Ranges': 'bytes',
        'X-Cache': 'MISS',
      },
    });
  } catch (error: any) {
    console.error('[AudioTranslation] Error generating TTS:', error);
    return new NextResponse('Failed to synthesize speech', { status: 502 });
  }
}
