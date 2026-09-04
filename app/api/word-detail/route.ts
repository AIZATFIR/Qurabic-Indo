import { NextRequest, NextResponse } from 'next/server';
import { getCanonicalWordDetail } from '@/lib/morphology/canonical-service';
import { getWordStudy } from '@/lib/morphology/word-study-service';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word') || '';
  const location = searchParams.get('location') || '';
  const surahNumber = searchParams.get('surah') ? parseInt(searchParams.get('surah')!, 10) : undefined;
  const ayahNumber = searchParams.get('ayah') ? parseInt(searchParams.get('ayah')!, 10) : undefined;
  const wordIndex = searchParams.get('wordIndex') ? parseInt(searchParams.get('wordIndex')!, 10) : undefined;

  const targetInput = word || location;
  if (!targetInput) {
    return NextResponse.json({ error: 'Missing word or location parameter' }, { status: 400 });
  }

  const context = {
    surahNumber,
    ayahNumber,
    wordIndex
  };

  const detail = getCanonicalWordDetail(targetInput, context);
  const study = getWordStudy(targetInput, context);

  return NextResponse.json({
    ...detail,
    study
  });
}
