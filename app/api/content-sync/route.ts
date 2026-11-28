import { NextRequest, NextResponse } from 'next/server';
import { ContentSyncError, requestQuranContentSync } from '@/lib/quran-foundation/content-sync';
import { isVercelWafRateLimitEnabled } from '@/lib/api/vercel-waf-rate-limit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 60;
// Best-effort per-instance guard; production also needs a distributed edge limit.
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function isRateLimited(request: NextRequest): boolean {
  const now = Date.now();
  const key = request.headers.get('x-real-ip') || 'unknown-client';
  const current = requestWindows.get(key);

  if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
    requestWindows.set(key, { startedAt: now, count: 1 });
    if (requestWindows.size > 2_000) {
      for (const [ip, window] of requestWindows) {
        if (now - window.startedAt >= RATE_WINDOW_MS) requestWindows.delete(ip);
      }
      while (requestWindows.size > 1_800) {
        const oldest = requestWindows.keys().next().value;
        if (oldest === undefined) break;
        requestWindows.delete(oldest);
      }
    }
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'private, no-store, max-age=0' },
  });
}

function stream(response: Response) {
  return new NextResponse(response.body, {
    status: 200,
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'Content-Type': response.headers.get('content-type') || 'application/json; charset=utf-8',
    },
  });
}

export async function POST(request: NextRequest) {
  if (!isVercelWafRateLimitEnabled()) {
    return json({ error: 'Sinkronisasi belum diaktifkan karena pembatas laju edge belum disetel.', code: 'EDGE_RATE_LIMIT_REQUIRED' }, 503);
  }
  if (isRateLimited(request)) {
    return json({ error: 'Terlalu banyak permintaan sinkronisasi. Coba lagi sebentar.' }, 429);
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > 8_192) return json({ error: 'Permintaan sinkronisasi terlalu besar.' }, 413);

    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'Permintaan sinkronisasi tidak valid.' }, 400);
    const decoder = new TextDecoder();
    let bodyText = '';
    let bodyBytes = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bodyBytes += chunk.value.byteLength;
      if (bodyBytes > 8_192) {
        await reader.cancel();
        return json({ error: 'Permintaan sinkronisasi terlalu besar.' }, 413);
      }
      bodyText += decoder.decode(chunk.value, { stream: true });
    }
    bodyText += decoder.decode();

    let body: unknown;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return json({ error: 'Permintaan sinkronisasi tidak valid.' }, 400);
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json({ error: 'Permintaan sinkronisasi tidak valid.' }, 400);
    }
    const fields = body as Record<string, unknown>;
    const params = new URLSearchParams();
    for (const key of ['cursor', 'sync_token', 'snapshot_path'] as const) {
      if (typeof fields[key] === 'string') params.set(key, fields[key] as string);
    }

    const response = await requestQuranContentSync(typeof fields.operation === 'string' ? fields.operation : '', params);
    return stream(response);
  } catch (error) {
    if (error instanceof ContentSyncError) {
      return json({ error: error.message, code: error.code }, error.status);
    }
    return json({ error: 'Sinkronisasi konten Al-Qur’an belum tersedia.' }, 503);
  }
}
