'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, BookOpen, Volume2, Copy, Check, ArrowLeft, Layers, Compass } from 'lucide-react';
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
      // 1. Fetch Random Verse with Word-by-Word data from Quran.com API v4
      const res = await fetch(
        'https://api.quran.com/api/v4/verses/random?language=id&words=true&word_fields=text_uthmani,transliteration,translation,location&translations=33'
      );

      if (res.ok) {
        const json = await res.json();
        const v = json.verse;
        const verseKeyParts = (v.verse_key || '1:1').split(':');
        const surahNum = Number(verseKeyParts[0]);
        const ayahNum = Number(verseKeyParts[1]);

        // Get surah metadata
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
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePlayAudio = () => {
    if (!ayah || !ayah.audioUrl) return;
    setIsPlaying(true);
    const audio = new Audio(ayah.audioUrl);
    audio.play().catch((err) => console.warn(err));
    audio.onended = () => setIsPlaying(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-primary transition-colors mb-2 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-hairline dark:border-slate-800 shadow-soft gradient-mesh text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Ayat Acak &amp; Tadabbur Harian</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-light text-ink-primary dark:text-white tracking-tight font-sans">
          Inspirasi Ayat Al-Qur&apos;an
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Temukan pesan dan hikmah dari 6.236 Ayat Al-Qur&apos;an secara acak. Klik pada kata manapun untuk membedah akar kata, audio pelafalan, dan definisinya.
        </p>

        {/* Acak Button */}
        <div className="pt-2">
          <button
            onClick={fetchRandomAyah}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-6 py-3 rounded-full font-semibold text-sm shadow-soft hover:shadow-hover transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Mengacak Ayat...' : 'Acak Ayat Lain'}</span>
          </button>
        </div>
      </div>

      {/* Random Ayah Display Card */}
      {loading ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 border border-hairline dark:border-slate-800 rounded-3xl space-y-4 shadow-soft">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400">Memilih Ayat Acak dari Al-Qur&apos;an...</p>
        </div>
      ) : ayah ? (
        <div className="p-8 sm:p-12 bg-white dark:bg-slate-900 border border-hairline dark:border-slate-800 rounded-3xl shadow-hover space-y-8">
          
          {/* Ayah Surah Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-9 h-9 rounded-full bg-primary-subdued text-primary-deep font-bold font-mono text-sm flex items-center justify-center border border-primary/20">
                {ayah.surahNumber}
              </span>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg font-sans">
                  Surah {ayah.surahNameIndo} {ayah.surahNameArabic && `(${ayah.surahNameArabic})`}
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Ayat Ke-{ayah.ayahNumber}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayAudio}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isPlaying ? 'bg-primary text-white scale-105 shadow-md animate-pulse' : 'bg-canvas-soft dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-hairline dark:border-slate-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlaying ? 'Memutar...' : 'Dengar Audio'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-canvas-soft dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-hairline dark:border-slate-700 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Tersalin!' : 'Salin Ayat'}</span>
              </button>
            </div>
          </div>

          {/* Arabic Text with Interactive Clickable Words */}
          <div className="py-4 text-right dir-rtl">
            <div className="font-arabic-lg text-4xl sm:text-5xl text-ink-primary dark:text-white leading-loose tracking-wide dir-rtl">
              {ayah.words.map((w, idx) => {
                if (w.charType === 'end') {
                  return (
                    <span key={idx} className="text-primary font-bold text-2xl px-2">
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
          <div className="p-6 bg-canvas-soft dark:bg-slate-800/80 border border-hairline dark:border-slate-800 rounded-2xl space-y-2">
            <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Terjemahan Kemenag RI:
            </span>
            <p className="text-base sm:text-lg translation-kemenag text-slate-800 dark:text-slate-200 leading-relaxed">
              &ldquo;{ayah.verseIndo}&rdquo;
            </p>
          </div>

        </div>
      ) : null}
    </div>
  );
}
