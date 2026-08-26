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
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-stone-900 border border-hairline dark:border-hairline-dark shadow-subtle text-center space-y-3">
        <span className="inline-block px-3 py-0.5 rounded-md bg-primary-subdued dark:bg-primary/20 text-primary dark:text-primary-light text-xs font-semibold uppercase tracking-wider font-sans">
          Ayat Acak &amp; Tadabbur
        </span>

        <h1 className="text-2xl sm:text-3xl font-light text-ink-primary dark:text-white tracking-tight font-sans">
          Inspirasi Ayat Al-Qur&apos;an
        </h1>

        {/* Acak Button */}
        <div>
          <button
            onClick={fetchRandomAyah}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-5 py-2 rounded-full font-medium text-xs shadow-subtle transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Memilih...' : 'Pilih Ayat Lain'}</span>
          </button>
        </div>
      </div>

      {/* Random Ayah Display Card */}
      {loading ? (
        <div className="p-14 text-center bg-white dark:bg-stone-900 border border-hairline dark:border-hairline-dark rounded-2xl space-y-3 shadow-subtle">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-mute dark:text-stone-400 font-sans">Memilih Ayat Acak...</p>
        </div>
      ) : ayah ? (
        <div className="p-6 sm:p-8 bg-white dark:bg-stone-900 border border-hairline dark:border-hairline-dark rounded-2xl shadow-subtle space-y-6">
          
          {/* Ayah Surah Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline dark:border-hairline-dark pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-full bg-primary-subdued dark:bg-primary/20 text-primary dark:text-primary-light font-bold text-xs font-sans flex items-center justify-center">
                {ayah.surahNumber}
              </span>
              <div>
                <h3 className="font-bold text-ink-primary dark:text-white text-base font-sans">
                  Surah {ayah.surahNameIndo} {ayah.surahNameArabic && `(${ayah.surahNameArabic})`}
                </h3>
                <span className="text-xs text-ink-mute dark:text-stone-400 font-sans">
                  Ayat Ke-{ayah.ayahNumber}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayAudio}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-sans ${
                  isPlaying ? 'bg-primary text-white shadow-subtle' : 'bg-stone-100 dark:bg-stone-800 text-ink-secondary dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlaying ? 'Memutar...' : 'Audio'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-ink-secondary dark:text-stone-300 hover:bg-stone-200 transition-all font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Arabic Text with Interactive Clickable Words */}
          <div className="py-3 text-right dir-rtl">
            <div className="font-arabic-lg text-3xl sm:text-4xl text-ink-primary dark:text-white leading-loose tracking-wide dir-rtl">
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
          <div className="p-5 bg-stone-50 dark:bg-stone-800/60 border border-hairline dark:border-hairline-dark rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-ink-mute dark:text-stone-400 uppercase tracking-wider block font-sans">
              Terjemahan Kemenag RI:
            </span>
            <p className="text-sm sm:text-base translation-kemenag text-ink-secondary dark:text-stone-200 leading-relaxed font-sans">
              &ldquo;{ayah.verseIndo}&rdquo;
            </p>
          </div>

        </div>
      ) : null}
    </div>
  );
}
