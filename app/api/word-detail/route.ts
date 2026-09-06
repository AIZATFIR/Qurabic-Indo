import { NextRequest, NextResponse } from 'next/server';
import { getCanonicalWordDetail } from '@/lib/morphology/canonical-service';
import { getWordStudy } from '@/lib/morphology/word-study-service';

export const dynamic = 'force-dynamic';

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

    const targetInput = word || location;
    if (!targetInput) {
      return NextResponse.json(
        { error: 'Parameter query diperlukan: word atau location' },
        { status: 400 }
      );
    }

    const isCoordinate = /^\d+:\d+(:\d+)?$/.test(targetInput);
    const hasArabic = /[\u0600-\u06FF]/.test(targetInput);
    const isRootCandidate = /^[a-zA-Z\-]{1,10}$/.test(targetInput);

    if (!isCoordinate && !hasArabic && !isRootCandidate) {
      return NextResponse.json(
        { error: 'Format kata atau koordinat tidak ditemukan dalam Al-Qur\'an' },
        { status: 404 }
      );
    }

    const context = {
      surahNumber: (surahNumber && surahNumber >= 1 && surahNumber <= 114) ? surahNumber : undefined,
      ayahNumber: (ayahNumber && ayahNumber >= 1) ? ayahNumber : undefined,
      wordIndex: (wordIndex && wordIndex >= 1) ? wordIndex : undefined,
    };

    const detail = getCanonicalWordDetail(targetInput, context);
    const study = getWordStudy(targetInput, context);

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
        study
      }
    });

    // Cache immutable Quranic linguistic data at the Edge / Browser level
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=43200'
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
