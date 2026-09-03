'use client';

import { useState, useEffect } from 'react';
import { Shuffle, RefreshCw, BookOpen, Volume2, Copy, Check, ArrowLeft, ArrowRight, Layers, Sparkles } from 'lucide-react';
import Link from 'next/link';
import QuranWordInteractive from '@/components/QuranWordInteractive';
import { findBestMatchingRoot, extractArabicRootLetters, inferGrammarRole } from '@/lib/search/root-search';
import { getSurahByNumber } from '@/lib/data/surah-list';

interface RandomAyahWord {
  id: number;
  position: number;
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
  const [activeTab, setActiveTab] = useState<'mushaf' | 'wbw'>('mushaf');

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

        const surahMeta = getSurahByNumber(surahNum);
        const surahNameIndo = surahMeta?.nameIndo || `Surah Ke-${surahNum}`;
        const surahNameArabic = surahMeta?.nameArabic || '';

        // Sort words strictly by position to guarantee exact sequential Quranic text flow
        const rawWords = [...(v.words || [])].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

        const parsedWords: RandomAyahWord[] = rawWords.map((w: any) => {
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
            position: w.position || 1,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-xs text-ink-mute hover:text-primary transition-colors font-sans"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
          Inspirasi Ayat <span className="font-semibold text-primary">Al-Qur&apos;an</span>
        </h1>

        <p className="text-xs sm:text-sm text-ink-secondary max-w-md mx-auto leading-relaxed font-sans">
          Pilihan ayat Al-Qur&apos;an acak untuk tadabbur harian dengan teks Mushaf Standar Indonesia, audio pelafalan, dan eksplorasi makna kata.
        </p>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={fetchRandomAyah}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-5 py-2.5 rounded-full font-semibold text-xs shadow-subtle transition-all disabled:opacity-50 font-sans"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Memilih...' : 'Pilih Ayat Acak Lain'}</span>
          </button>

          {ayah && (
            <Link
              href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
              className="inline-flex items-center space-x-2 bg-canvas-soft hover:bg-primary-subdued border border-hairline hover:border-primary/40 text-ink-primary hover:text-primary px-5 py-2.5 rounded-full font-semibold text-xs transition-all font-sans"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>Buka di Mushaf ({ayah.surahNumber}:{ayah.ayahNumber})</span>
            </Link>
          )}
        </div>
      </div>

      {/* Random Ayah Display Card */}
      {loading ? (
        <div className="p-16 text-center bg-canvas-surface border border-hairline rounded-3xl space-y-3 shadow-subtle">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-mute font-sans">Memuat ayat pilihan...</p>
        </div>
      ) : ayah ? (
        <div className="p-6 sm:p-8 md:p-10 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-6">
          
          {/* Ayah Surah Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-primary-subdued text-primary font-bold text-xs font-sans flex items-center justify-center shadow-subtle">
                {ayah.surahNumber}
              </span>
              <div>
                <h2 className="font-bold text-ink-primary text-base sm:text-lg font-sans">
                  Surah {ayah.surahNameIndo} {ayah.surahNameArabic && `(${ayah.surahNameArabic})`}
                </h2>
                <span className="text-xs text-ink-mute font-sans">
                  Ayat Ke-{ayah.ayahNumber} • Q.S. [{ayah.surahNumber}:{ayah.ayahNumber}]
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center space-x-2">
              <Link
                href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary-deep text-white shadow-subtle transition-all font-sans"
                title="Buka Ayat Ini Langsung di Mushaf"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Buka di Mushaf</span>
              </Link>

              <button
                onClick={handlePlayAudio}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all font-sans ${
                  isPlaying ? 'bg-primary text-white shadow-subtle' : 'bg-canvas-soft text-ink-secondary hover:bg-primary-subdued'
                }`}
                title="Dengarkan Audio Tilawah"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlaying ? 'Memutar...' : 'Audio'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-canvas-soft text-ink-secondary hover:bg-primary-subdued transition-all font-sans"
                title="Salin Ayat & Terjemahan"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5 text-ink-mute" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Authentic Continuous Mushaf Arabic Verse (Clean Natural RTL Flow) */}
          <div className="py-4 text-right" dir="rtl">
            <p
              dir="rtl"
              className="font-arabic text-3xl sm:text-4xl lg:text-5xl text-ink-primary leading-[2.6] sm:leading-[2.8] tracking-wide"
            >
              {ayah.words.map((w, idx) => {
                if (w.charType === 'end') {
                  return (
                    <span
                      key={idx}
                      className="text-primary font-bold text-2xl sm:text-3xl px-2 font-arabic select-none inline-block align-middle"
                      dir="rtl"
                    >
                      {w.arabic || `﴿${ayah.ayahNumber}﴾`}
                    </span>
                  );
                }

                return (
                  <QuranWordInteractive
                    key={idx}
                    mode="inline"
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
                    wordIndex={w.position || (idx + 1)}
                    surahNameIndo={ayah.surahNameIndo}
                  />
                );
              })}
            </p>
          </div>

          {/* Indonesian Kemenag Translation */}
          <div className="p-5 sm:p-6 bg-canvas-soft border border-hairline rounded-2xl space-y-1.5">
            <span className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider block font-sans">
              Terjemahan Resmi Kemenag RI:
            </span>
            <p className="text-sm sm:text-base translation-kemenag text-ink-secondary leading-relaxed font-sans">
              &ldquo;{ayah.verseIndo}&rdquo;
            </p>
          </div>

          {/* Word-by-Word Analysis (Kata per Kata) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="text-xs font-semibold text-ink-primary uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Analisis Kata per Kata (Klik untuk Bedah Leksikal):</span>
              </span>
              <span className="text-xs text-ink-mute">
                {ayah.words.filter(w => w.charType === 'word').length} Kata
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1" dir="rtl">
              {ayah.words.filter(w => w.charType === 'word').map((w, idx) => (
                <QuranWordInteractive
                  key={idx}
                  mode="stacked"
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
                  wordIndex={w.position || (idx + 1)}
                  surahNameIndo={ayah.surahNameIndo}
                />
              ))}
            </div>
          </div>

          {/* Direct Navigation Call-to-Action to Full Mushaf Reading Page */}
          <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-sm font-bold text-ink-primary block flex items-center justify-center sm:justify-start space-x-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Baca dalam Konteks Mushaf Lengkap</span>
              </span>
              <span className="text-xs text-ink-mute block">
                Buka Surah {ayah.surahNameIndo} langsung pada posisi Ayat {ayah.ayahNumber} dengan navigasi per-ayat.
              </span>
            </div>

            <Link
              href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary hover:bg-primary-deep text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all inline-flex items-center justify-center space-x-2 shrink-0 group"
            >
              <span>Buka di Halaman Baca</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      ) : null}
    </div>
  );
}
