import { NextRequest, NextResponse } from 'next/server';
import { getAyahTafsir } from '@/lib/tafsir/tafsir-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surahStr = searchParams.get('surah');
    const ayahStr = searchParams.get('ayah');

    if (!surahStr || !ayahStr) {
      return NextResponse.json(
        { error: 'Parameter surah dan ayah diperlukan (contoh: /api/tafsir?surah=17&ayah=64)' },
        { status: 400 }
      );
    }

    const surahNumber = parseInt(surahStr, 10);
    const ayahNumber = parseInt(ayahStr, 10);

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114 || isNaN(ayahNumber) || ayahNumber < 1) {
      return NextResponse.json(
        { error: 'Nomor surah (1-114) atau nomor ayah tidak valid' },
        { status: 400 }
      );
    }

    const tafsir = await getAyahTafsir(surahNumber, ayahNumber);

    if (!tafsir) {
      return NextResponse.json(
        { error: 'Tafsir untuk ayat ini belum tersedia' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      data: tafsir
    });

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=604800, stale-while-revalidate=86400'
    );

    return response;
  } catch (error) {
    console.error('API Error [/api/tafsir]:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data tafsir' },
      { status: 500 }
    );
  }
}
