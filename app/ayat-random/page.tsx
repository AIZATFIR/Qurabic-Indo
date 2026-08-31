'use client';

import { useState, useEffect } from 'react';
import { Shuffle, RefreshCw, BookOpen, Volume2, Copy, Check, ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';
import QuranWordInteractive from '@/components/QuranWordInteractive';
import { findBestMatchingRoot, extractArabicRootLetters, inferGrammarRole } from '@/lib/search/root-search';

interface RandomAyahWord {
  id: number;
  arabic: string;
  transliteration: string;
  meaningIndo: string;
  audioUrl?: string;
  charType: 'word' | 'end';
  rootLetters?: string;
  rootSlug?: string;
  posTag?: string;
  posDetail?: string;
}

interface RandomAyah {
  surahNumber: number;
  surahNameIndo: string;
  surahNameArabic: string;
  ayahNumber: number;
  verseArabic: string;
  verseIndo: string;
  audioUrl?: string;
  words: RandomAyahWord[];
}

export default function RandomAyahPage() {
  const [ayah, setAyah] = useState<RandomAyah | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  async function fetchRandomAyah() {
    setLoading(true);
    setCopied(false);
    setIsPlaying(false);
    try {
      const res = await fetch(
        'https://api.quran.com/api/v4/verses/random?language=id&words=true&word_fields=text_uthmani,transliteration,translation,location&translations=33'
      );

      if (res.ok) {
        const json = await res.json();
        const v = json.verse;
        const verseKeyParts = (v.verse_key || '1:1').split(':');
        const surahNum = Number(verseKeyParts[0]);
        const ayahNum = Number(verseKeyParts[1]);

        let surahNameIndo = `Surah Ke-${surahNum}`;
        let surahNameArabic = '';
        try {
          const surahMetaRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}`);
          if (surahMetaRes.ok) {
            const sm = await surahMetaRes.json();
            surahNameIndo = sm.data?.englishName || surahNameIndo;
            surahNameArabic = sm.data?.name || '';
          }
        } catch (e) {}

        const parsedWords: RandomAyahWord[] = (v.words || []).map((w: any) => {
          const arabic = w.text_uthmani || w.text || '';
          const transliteration = w.transliteration?.text || '';
          const meaningIndo = w.translation?.text || '';
          const matchedRoot = findBestMatchingRoot(arabic, meaningIndo);
          const grammar = inferGrammarRole(arabic, meaningIndo);

          let audioUrl: string | undefined;
          if (w.audio_url) {
            audioUrl = w.audio_url.startsWith('http') ? w.audio_url : `https://audio.qurancdn.com/${w.audio_url}`;
          }

          return {
            id: w.id || w.position,
            arabic,
            transliteration,
            meaningIndo,
            audioUrl,
            charType: (w.char_type_name === 'end' ? 'end' : 'word') as 'word' | 'end',
            rootLetters: matchedRoot ? matchedRoot.rootArabic : extractArabicRootLetters(arabic),
            rootSlug: matchedRoot?.id,
            posTag: grammar.posCategory,
            posDetail: grammar.posDetail
          };
        });

        const translationIndo = v.translations?.[0]?.text?.replace(/<sup.*?<\/sup>/g, '') || '';
        const arabicFull = v.text_uthmani || parsedWords.filter(w => w.charType === 'word').map(w => w.arabic).join(' ');

        setAyah({
          surahNumber: surahNum,
          surahNameIndo,
          surahNameArabic,
          ayahNumber: ayahNum,
          verseArabic: arabicFull,
          verseIndo: translationIndo,
          audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${v.id || 1}.mp3`,
          words: parsedWords
        });
      }
    } catch (err) {
      console.error('Error fetching random ayah:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRandomAyah();
  }, []);

  const handleCopy = () => {
    if (!ayah) return;
    const textToCopy = `${ayah.verseArabic}\n\n"${ayah.verseIndo}"\n\n(Q.S. ${ayah.surahNameIndo} [${ayah.surahNumber}]: ${ayah.ayahNumber})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayAudio = () => {
    if (!ayah || !ayah.audioUrl) return;
    setIsPlaying(true);
    const audio = new Audio(ayah.audioUrl);
    audio.play().catch((err) => console.warn(err));
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-xs text-ink-mute hover:text-primary transition-colors font-sans"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
          Inspirasi Ayat <span className="font-semibold text-primary">Al-Qur&apos;an</span>
        </h1>

        <p className="text-xs sm:text-sm text-ink-secondary max-w-md mx-auto leading-relaxed font-sans">
          Pilihan ayat Al-Qur&apos;an lengkap dengan audio pelafalan dan analisis per kata untuk tadabbur harian.
        </p>

        {/* Acak Button */}
        <div className="pt-1">
          <button
            onClick={fetchRandomAyah}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-4 py-2 rounded-xl font-medium text-xs shadow-subtle transition-all disabled:opacity-50 font-sans"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Memilih...' : 'Pilih Ayat Lain'}</span>
          </button>
        </div>
      </div>

      {/* Random Ayah Display Card */}
      {loading ? (
        <div className="p-14 text-center bg-canvas-surface border border-hairline rounded-2xl space-y-3 shadow-subtle">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-mute font-sans">Memilih Ayat Acak...</p>
        </div>
      ) : ayah ? (
        <div className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-2xl shadow-subtle space-y-6">
          
          {/* Ayah Surah Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-full bg-primary-subdued text-primary font-bold text-xs font-sans flex items-center justify-center">
                {ayah.surahNumber}
              </span>
              <div>
                <h3 className="font-bold text-ink-primary text-base font-sans">
                  Surah {ayah.surahNameIndo} {ayah.surahNameArabic && `(${ayah.surahNameArabic})`}
                </h3>
                <span className="text-xs text-ink-mute font-sans">
                  Ayat Ke-{ayah.ayahNumber}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayAudio}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-sans ${
                  isPlaying ? 'bg-primary text-white shadow-subtle' : 'bg-canvas-soft text-ink-secondary hover:bg-primary-fixed'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlaying ? 'Memutar...' : 'Audio'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-canvas-soft text-ink-secondary hover:bg-primary-fixed transition-all font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-ink-mute" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Arabic Text with Interactive Clickable Words */}
          <div className="py-3 text-right" dir="rtl">
            <div
              dir="rtl"
              className="font-arabic-lg text-3xl sm:text-4xl text-ink-primary leading-loose tracking-wide flex flex-wrap items-center justify-start gap-x-2 gap-y-3"
            >
              {ayah.words.map((w, idx) => {
                if (w.charType === 'end') {
                  return (
                    <span key={idx} className="text-primary font-bold text-xl px-2 font-arabic">
                      {w.arabic || `﴿${ayah.ayahNumber}﴾`}
                    </span>
                  );
                }

                return (
                  <QuranWordInteractive
                    key={idx}
                    wordArabic={w.arabic}
                    transliteration={w.transliteration}
                    meaningIndo={w.meaningIndo}
                    posTag={w.posTag}
                    posDetail={w.posDetail}
                    matchedRootSlug={w.rootSlug}
                    rootLetters={w.rootLetters}
                    audioUrl={w.audioUrl}
                    ayahArabic={ayah.verseArabic}
                    ayahIndo={ayah.verseIndo}
                    surahNumber={ayah.surahNumber}
                    ayahNumber={ayah.ayahNumber}
                    surahNameIndo={ayah.surahNameIndo}
                  />
                );
              })}
            </div>
          </div>

          {/* Indonesian Kemenag Translation */}
          <div className="p-5 bg-canvas-soft border border-hairline rounded-2xl space-y-1">
            <span className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider block font-sans">
              Terjemahan Resmi Kemenag RI:
            </span>
            <p className="text-sm sm:text-base translation-kemenag text-ink-secondary leading-relaxed font-sans">
              &ldquo;{ayah.verseIndo}&rdquo;
            </p>
          </div>

          {/* Subtle Source Attribution */}
          <div className="flex justify-end pt-1">
            <span className="text-[10px] text-ink-mute font-sans">
              Sumber: Mushaf Standar Indonesia (Kemenag RI) &amp; Quran.com API
            </span>
          </div>

        </div>
      ) : null}
    </div>
  );
}
