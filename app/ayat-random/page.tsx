'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, BookOpen, Volume2, Copy, Check, ArrowLeft, ArrowRight, Layers, Type } from 'lucide-react';
import Link from 'next/link';
import QuranWordInteractive from '@/components/QuranWordInteractive';
import { findBestMatchingRoot, extractArabicRootLetters, inferGrammarRole } from '@/lib/search/root-search';
import { getSurahByNumber, SURAH_LIST } from '@/lib/data/surah-list';
import { cleanGlossToIndonesian } from '@/lib/search/word-dictionary';
import { getAuthenticWordMeaning } from '@/lib/morphology/root-dictionary';

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
  const [activeTab, setActiveTab] = useState<'wbw' | 'mushaf' | 'both'>('wbw');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('sm');

  async function fetchRandomAyah() {
    setLoading(true);
    setCopied(false);
    setIsPlaying(false);
    try {
      // Pick a random surah (1..114) and a random ayah within that surah's total ayahs
      const randomSurahIdx = Math.floor(Math.random() * SURAH_LIST.length);
      const surahMeta = SURAH_LIST[randomSurahIdx] || SURAH_LIST[0];
      const randomAyahNum = Math.floor(Math.random() * surahMeta.ayahsCount) + 1;
      const targetVerseKey = `${surahMeta.number}:${randomAyahNum}`;

      // Fetch by key directly to guarantee 100% Indonesian words (avoids upstream /verses/random English bug)
      const res = await fetch(
        `https://api.quran.com/api/v4/verses/by_key/${targetVerseKey}?language=id&words=true&word_fields=text_uthmani,transliteration,translation,location&translations=33`
      );

      if (res.ok) {
        const json = await res.json();
        const v = json.verse;
        const surahNum = surahMeta.number;
        const ayahNum = randomAyahNum;

        const surahNameIndo = surahMeta.nameIndo || `Surah Ke-${surahNum}`;
        const surahNameArabic = surahMeta.nameArabic || '';

        // Sort words strictly by position to guarantee exact sequential Quranic text flow
        const rawWords = [...(v.words || [])].sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

        const parsedWords: RandomAyahWord[] = rawWords.map((w: any) => {
          const arabic = w.text_uthmani || w.text || '';
          const transliteration = w.transliteration?.text || '';
          const rawMeaning = w.translation?.text || '';
          const matchedRoot = findBestMatchingRoot(arabic);
          const grammar = inferGrammarRole(arabic);
          const fallbackMeaning = getAuthenticWordMeaning(arabic, matchedRoot?.id);
          const meaningIndo = cleanGlossToIndonesian(rawMeaning, fallbackMeaning);

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

  // Scaled continuous Arabic typography for proportional, anti-kegedean rendering
  const continuousArabicSize =
    fontSize === 'sm'
      ? 'text-xl sm:text-2xl lg:text-3xl leading-[2.1] sm:leading-[2.3]'
      : fontSize === 'md'
      ? 'text-2xl sm:text-3xl lg:text-4xl leading-[2.3] sm:leading-[2.5]'
      : 'text-3xl sm:text-4xl lg:text-5xl leading-[2.5] sm:leading-[2.7]';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 font-sans">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-1.5 text-xs text-ink-mute hover:text-primary transition-colors font-sans"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Header Banner - Compact & Clean */}
      <div className="p-4 sm:p-6 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-light text-ink-primary tracking-tight font-sans">
          Inspirasi Ayat <span className="font-semibold text-primary">Al-Qur&apos;an</span>
        </h1>

        <p className="text-xs sm:text-sm text-ink-secondary max-w-md mx-auto leading-relaxed font-sans">
          Pilihan ayat Al-Qur&apos;an acak untuk tadabbur harian dengan terjemahan resmi Kemenag RI, audio tilawah, dan bedah kata per kata.
        </p>

        {/* Action Controls */}
        <div className="pt-1.5 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={fetchRandomAyah}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-4 py-2 rounded-full font-semibold text-xs shadow-subtle transition-all disabled:opacity-50 font-sans"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Memilih...' : 'Pilih Ayat Acak Lain'}</span>
          </button>

          {ayah && (
            <Link
              href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
              className="inline-flex items-center space-x-1.5 bg-canvas-soft hover:bg-primary-subdued border border-hairline hover:border-primary/40 text-ink-primary hover:text-primary px-4 py-2 rounded-full font-semibold text-xs transition-all font-sans"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>Buka di Mushaf ({ayah.surahNumber}:{ayah.ayahNumber})</span>
            </Link>
          )}
        </div>
      </div>

      {/* Random Ayah Display Card */}
      {loading ? (
        <div className="p-12 text-center bg-canvas-surface border border-hairline rounded-2xl space-y-3 shadow-subtle">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-ink-mute font-sans">Memuat ayat pilihan...</p>
        </div>
      ) : ayah ? (
        <div className="p-4 sm:p-6 bg-canvas-surface border border-hairline rounded-2xl shadow-subtle space-y-4">
          
          {/* Ayah Surah Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-hairline pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-7 h-7 rounded-lg bg-primary-subdued text-primary font-bold text-xs font-sans flex items-center justify-center shadow-subtle">
                {ayah.surahNumber}
              </span>
              <div>
                <h2 className="font-bold text-ink-primary text-sm sm:text-base font-sans">
                  Surah {ayah.surahNameIndo} {ayah.surahNameArabic && `(${ayah.surahNameArabic})`}
                </h2>
                <span className="text-[11px] text-ink-mute font-sans">
                  Ayat Ke-{ayah.ayahNumber} • Q.S. [{ayah.surahNumber}:{ayah.ayahNumber}]
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center space-x-1.5">
              <Link
                href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-deep text-white shadow-subtle transition-all font-sans"
                title="Buka Ayat Ini Langsung di Mushaf"
              >
                <BookOpen className="w-3 h-3" />
                <span className="hidden sm:inline">Buka di Mushaf</span>
              </Link>

              <button
                onClick={handlePlayAudio}
                className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-sans ${
                  isPlaying ? 'bg-primary text-white shadow-subtle' : 'bg-canvas-soft text-ink-secondary hover:bg-primary-subdued'
                }`}
                title="Dengarkan Audio Tilawah"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isPlaying ? 'Memutar...' : 'Audio'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-canvas-soft text-ink-secondary hover:bg-primary-subdued transition-all font-sans"
                title="Salin Ayat & Terjemahan"
              >
                {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-ink-mute" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Display Mode Tabs & Font Sizing Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-hairline pb-2.5">
            {/* Tabs */}
            <div className="flex items-center space-x-1 p-0.5 bg-canvas-soft rounded-xl border border-hairline text-xs">
              <button
                onClick={() => setActiveTab('wbw')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all font-sans ${
                  activeTab === 'wbw'
                    ? 'bg-primary text-white shadow-subtle font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                Kata per Kata (WBW)
              </button>
              <button
                onClick={() => setActiveTab('mushaf')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all font-sans ${
                  activeTab === 'mushaf'
                    ? 'bg-primary text-white shadow-subtle font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                Teks Mushaf
              </button>
              <button
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all font-sans ${
                  activeTab === 'both'
                    ? 'bg-primary text-white shadow-subtle font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                Keduanya
              </button>
            </div>

            {/* Font Size Selector [SM | MD | LG] */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider flex items-center space-x-1 font-sans">
                <Type className="w-3 h-3 text-primary" />
                <span className="hidden sm:inline">Ukuran:</span>
              </span>
              <div className="flex items-center p-0.5 bg-canvas-soft rounded-lg border border-hairline text-xs">
                {(['sm', 'md', 'lg'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase transition-all font-sans ${
                      fontSize === sz
                        ? 'bg-primary text-white shadow-subtle'
                        : 'text-ink-secondary hover:text-ink-primary'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Authentic Continuous Mushaf Arabic Verse (Clean Natural RTL Flow) */}
          {(activeTab === 'mushaf' || activeTab === 'both') && (
            <div className="py-2.5 text-right" dir="rtl">
              <p
                dir="rtl"
                className={`font-arabic text-ink-primary tracking-normal ${continuousArabicSize}`}
              >
                {ayah.words.map((w, idx) => {
                  if (w.charType === 'end') {
                    return (
                      <span
                        key={idx}
                        className="text-primary font-bold text-xl sm:text-2xl px-1.5 font-arabic select-none inline-block align-middle"
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
                      fontSize={fontSize}
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
          )}

          {/* Word-by-Word Analysis (Kata per Kata) - Clean & Compact */}
          {(activeTab === 'wbw' || activeTab === 'both') && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between border-b border-hairline pb-1.5">
                <span className="text-xs font-semibold text-ink-primary uppercase tracking-wider flex items-center space-x-1.5 font-sans">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span>Bedah Kata per Kata:</span>
                </span>
                <span className="text-[11px] text-ink-mute font-sans">
                  Klik tiap kartu untuk Bedah Leksikal
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 items-stretch justify-start" dir="rtl">
                {ayah.words.filter(w => w.charType === 'word').map((w, idx) => (
                  <QuranWordInteractive
                    key={idx}
                    mode="stacked"
                    fontSize={fontSize}
                    showInlineMeaning={true}
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
          )}

          {/* Indonesian Kemenag Translation - Compact & Clean */}
          <div className="p-4 sm:p-4.5 bg-canvas-soft border border-hairline rounded-xl space-y-1">
            <span className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider block font-sans">
              Terjemahan Resmi Kemenag RI:
            </span>
            <p className="text-xs sm:text-sm translation-kemenag text-ink-secondary leading-relaxed font-sans">
              &ldquo;{ayah.verseIndo}&rdquo;
            </p>
          </div>

          {/* Direct Navigation Call-to-Action to Full Mushaf Reading Page */}
          <div className="p-4 rounded-xl bg-canvas-soft border border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold text-ink-primary flex items-center justify-center sm:justify-start space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Baca dalam Konteks Mushaf Lengkap</span>
              </span>
              <span className="text-[11px] text-ink-mute block">
                Buka Surah {ayah.surahNameIndo} langsung pada posisi Ayat {ayah.ayahNumber}.
              </span>
            </div>

            <Link
              href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all inline-flex items-center justify-center space-x-1.5 shrink-0 group"
            >
              <span>Buka di Halaman Baca</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      ) : null}
    </div>
  );
}
