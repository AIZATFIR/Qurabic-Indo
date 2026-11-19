import { NextRequest, NextResponse } from 'next/server';
import { getCanonicalWordDetail } from '@/lib/morphology/canonical-service';
import { getWordStudy } from '@/lib/morphology/word-study-service';
import { getLaneRootRecord } from '@/lib/lexicon/lane-loader';

export const dynamic = 'force-dynamic';

function getReadableLaneExcerpt(rootBw?: string) {
  if (!rootBw) return undefined;
  const root = getLaneRootRecord(rootBw);
  const match = root?.entries
    .flatMap((entry) => entry.senses.map((sense) => ({ entry, sense })))
    .find(({ sense }) => Boolean(sense.englishText || sense.text));
  const sourceText = match?.sense.englishText || match?.sense.text || '';
  if (!match || !sourceText) return undefined;
  return {
    text: sourceText.match(/\[\s*([^\]]{30,})\]/)?.[1]?.trim() || sourceText,
    volume: match.sense.citation?.volume || match.entry.volume,
    page: match.sense.citation?.page || match.entry.page,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawWord = searchParams.get('word') || searchParams.get('q') || '';
    const rawLocation = searchParams.get('location') || '';

    // Security check: Input length bounds (max 200 chars)
    if (rawWord.length > 200 || rawLocation.length > 50) {
      return NextResponse.json(
        { error: 'Panjang query melebihi batas aman (maksimum 200 karakter)' },
        { status: 400 }
      );
    }

    const word = rawWord.trim();
    const location = rawLocation.trim();
    const surahNumber = searchParams.get('surah') ? parseInt(searchParams.get('surah')!, 10) : undefined;
    const ayahNumber = searchParams.get('ayah') ? parseInt(searchParams.get('ayah')!, 10) : undefined;
    const wordIndex = searchParams.get('wordIndex') ? parseInt(searchParams.get('wordIndex')!, 10) : undefined;

    const targetInput = location || word;
    if (!targetInput) {
      return NextResponse.json(
        { error: 'Parameter query diperlukan: word atau location' },
        { status: 400 }
      );
    }

    const isCoordinate = /^\d+:\d+(:\d+)?(:\d+)?$/.test(targetInput);
    const hasArabic = /[\u0600-\u06FF]/.test(targetInput);
    const isRootCandidate = /^[a-zA-Z'\-`~><&}{*$^]{1,15}$/.test(targetInput);

    if (!isCoordinate && !hasArabic && !isRootCandidate) {
      return NextResponse.json(
        { error: 'Format kata atau koordinat tidak ditemukan dalam Al-Qur\'an' },
        { status: 404 }
      );
    }

    const rawMeaning = searchParams.get('meaning') || searchParams.get('meaningIndo') || '';
    const meaningIndo = rawMeaning.trim() ? rawMeaning.trim() : undefined;
    const surahNameIndo = searchParams.get('surahNameIndo')?.trim() || undefined;
    const ayahArabic = searchParams.get('ayahArabic')?.trim() || undefined;
    const ayahIndo = searchParams.get('ayahIndo')?.trim() || undefined;

    const context = {
      surahNumber: (surahNumber && surahNumber >= 1 && surahNumber <= 114) ? surahNumber : undefined,
      ayahNumber: (ayahNumber && ayahNumber >= 1) ? ayahNumber : undefined,
      wordIndex: (wordIndex && wordIndex >= 1) ? wordIndex : undefined,
      meaningIndo,
      surahNameIndo,
      ayahArabic,
      ayahIndo
    };

    const detail = getCanonicalWordDetail(targetInput, context);
    if (searchParams.get('excerpt') === 'lane-root-v1') {
      if (!detail) {
        return NextResponse.json({ error: 'Kata tidak ditemukan dalam indeks morfologi Al-Qur\'an' }, { status: 404 });
      }
      const response = NextResponse.json({
        success: true,
        data: { study: { lexical: { rootExcerpt: getReadableLaneExcerpt(detail.lexical.root) } } },
      });
      response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
      return response;
    }

    const study = getWordStudy(targetInput, context, detail || undefined);

    if (!detail && !study) {
      return NextResponse.json(
        { error: 'Kata tidak ditemukan dalam indeks morfologi Al-Qur\'an' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: {
        ...detail,
        translation: { primaryMeaning: study.primaryMeaning.text, meanings: [study.primaryMeaning.text], sourceCitation: study.primaryMeaning.source },
        study
      }
    });

    // Cache immutable Quranic linguistic data at the Edge / Browser level
    response.headers.set(
      'Cache-Control',
      'public, max-age=300, s-maxage=86400, stale-while-revalidate=43200'
    );

    return response;
  } catch (error) {
    console.error('API Error [/api/word-detail]:', error);
    return NextResponse.json(
      { error: 'Gagal memproses analisis kata. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
