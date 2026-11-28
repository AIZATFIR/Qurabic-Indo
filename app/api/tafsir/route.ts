import { NextRequest, NextResponse } from 'next/server';
import { getAyahTafsir } from '@/lib/tafsir/tafsir-service';
import { SURAH_LIST } from '@/lib/data/surah-list';

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

    if (!/^\d+$/.test(surahStr) || !/^\d+$/.test(ayahStr)) {
      return NextResponse.json(
        { error: 'Nomor surah atau ayah harus berupa bilangan bulat' },
        { status: 400 }
      );
    }

    const surahNumber = Number(surahStr);
    const ayahNumber = Number(ayahStr);
    const surah = SURAH_LIST[surahNumber - 1];

    if (!Number.isSafeInteger(surahNumber) || !Number.isSafeInteger(ayahNumber) || !surah || surah.number !== surahNumber || ayahNumber < 1 || ayahNumber > surah.ayahsCount) {
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
