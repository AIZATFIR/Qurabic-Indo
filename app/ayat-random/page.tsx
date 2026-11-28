'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { RefreshCw, BookOpen, Volume2, Pause, Loader2, Copy, Check, ArrowLeft, ArrowRight, Layers, Type } from 'lucide-react';
import Link from 'next/link';
import QuranWordInteractive from '@/components/QuranWordInteractive';
import { getSurahByNumber } from '@/lib/data/surah-list';
import { getAyahAudioUrl, getAudioCandidateUrls } from '@/lib/api/audio';
import { registerQuranAudio } from '@/lib/audio/active-audio-registry';

interface RandomAyahWord {
  id: number;
  position: number;
  arabic: string;
  transliteration: string;
  meaningIndo: string;
  meaningEnglish?: string;
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
  const { language, t } = useLanguage();
  const [ayah, setAyah] = useState<RandomAyah | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing'>('idle');
  const [activeTab, setActiveTab] = useState<'wbw' | 'mushaf' | 'both'>('wbw');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('sm');
  const [showTafsir, setShowTafsir] = useState(false);
  const [loadingTafsir, setLoadingTafsir] = useState(false);
  const [tafsirContent, setTafsirContent] = useState<string | null>(null);
  const tafsirRequestRef = useRef(0);
  const [tafsirSource, setTafsirSource] = useState('rioastamal/quran-json@73b1d52 · tafsir.id.kemenag');
  const [englishTranslation, setEnglishTranslation] = useState<{ verseKey: string; status: 'loading' | 'available' | 'unavailable'; text?: string } | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unregisterAudioRef = useRef<(() => void) | null>(null);
  const currentVerseKey = ayah ? `${ayah.surahNumber}:${ayah.ayahNumber}` : null;
  const currentEnglishTranslation = englishTranslation?.verseKey === currentVerseKey ? englishTranslation : null;
  const englishVerseText = currentEnglishTranslation?.status === 'available' ? currentEnglishTranslation.text : undefined;
  const englishTranslationStatus = currentEnglishTranslation?.status ?? (language === 'en' && ayah ? 'loading' : 'idle');
  const currentSurahMeta = ayah ? getSurahByNumber(ayah.surahNumber) : undefined;
  const displayedSurahName = language === 'en'
    ? currentSurahMeta?.transliteration || ayah?.surahNameIndo || ''
    : ayah?.surahNameIndo || '';

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      unregisterAudioRef.current?.();
      unregisterAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (language !== 'en' || !currentVerseKey) {
      setEnglishTranslation(null);
      return;
    }

    let active = true;
    const controller = new AbortController();
    const [surah, ayahNumber] = currentVerseKey.split(':');
    setEnglishTranslation({ verseKey: currentVerseKey, status: 'loading' });
    void fetch(`/api/verse-translation?surah=${surah}&ayah=${ayahNumber}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('English translation unavailable');
        const payload = await response.json();
        if (typeof payload.translation !== 'string' || !payload.translation.trim()) throw new Error('English translation unavailable');
        if (active) setEnglishTranslation({ verseKey: currentVerseKey, status: 'available', text: payload.translation.trim() });
      })
      .catch(() => {
        if (active && !controller.signal.aborted) setEnglishTranslation({ verseKey: currentVerseKey, status: 'unavailable' });
      });

    return () => { active = false; controller.abort(); };
  }, [language, currentVerseKey]);

  async function fetchRandomAyah() {
    // Stop any active audio playback immediately
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    unregisterAudioRef.current?.();
    unregisterAudioRef.current = null;
    setAudioStatus('idle');
    tafsirRequestRef.current += 1;
    setLoadingTafsir(false);
    setShowTafsir(false);
    setTafsirContent(null);
    setTafsirSource('rioastamal/quran-json@73b1d52 · tafsir.id.kemenag');
    setEnglishTranslation(null);
    setAyah(null);
    setLoadError(false);
    setLoading(true);
    setCopied(false);

    try {
      // Zero-latency internal DB fetch via SQLite + local WBW chunks
      const res = await fetch('/api/ayah-random');
      if (!res.ok) throw new Error('Random ayah unavailable');

      if (res.ok) {
        const data = await res.json();
        const surahNum = data.surahNumber;
        const ayahNum = data.ayahNumber;

        const parsedWords: RandomAyahWord[] = (data.words || []).map((w: any) => ({
          id: w.id || w.position,
          position: w.position || 1,
          arabic: w.arabic || '',
          transliteration: w.transliteration || '',
          meaningIndo: w.meaningIndo || t('Makna kata belum tersedia dari sumber kata-per-kata.', 'Word gloss unavailable from the word-by-word source.'),
          meaningEnglish: typeof w.meaningEnglish === 'string' && w.meaningEnglish.trim()
            ? w.meaningEnglish
            : t('Makna kata belum tersedia dari sumber kata-per-kata.', 'Word gloss unavailable from the word-by-word source.'),
          audioUrl: w.audioUrl,
          charType: (w.charType === 'end' ? 'end' : 'word') as 'word' | 'end',
          rootLetters: w.rootLetters,
          rootSlug: w.rootSlug,
          posTag: w.posTag,
          posDetail: w.posDetail,
        }));

        setAyah({
          surahNumber: surahNum,
          surahNameIndo: data.surahNameIndo,
          surahNameArabic: data.surahNameArabic,
          ayahNumber: ayahNum,
          verseArabic: data.verseArabic,
          verseIndo: data.verseIndo,
          audioUrl: getAyahAudioUrl(surahNum, ayahNum),
          words: parsedWords
        });
      }
    } catch (err) {
      console.error('Error fetching random ayah:', err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRandomAyah();
  }, []);

  const handleCopy = () => {
    if (!ayah) return;
    const translation = language === 'en' ? englishVerseText : ayah.verseIndo;
    const quote = translation ? `\n\n"${translation}"` : '';
    const reference = language === 'en'
      ? `(Qur'an ${displayedSurahName} ${ayah.ayahNumber})`
      : `(Q.S. ${ayah.surahNameIndo} ${ayah.surahNumber}:${ayah.ayahNumber})`;
    const textToCopy = `${ayah.verseArabic}${quote}\n\n${reference}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAudio = () => {
    if (!ayah) return;

    if (audioStatus === 'playing') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setAudioStatus('idle');
      return;
    }

    if (audioRef.current && audioRef.current.src) {
      setAudioStatus('loading');
      audioRef.current.play()
        .then(() => setAudioStatus('playing'))
        .catch(() => setAudioStatus('idle'));
      return;
    }

    const candidates = getAudioCandidateUrls(ayah.surahNumber, ayah.ayahNumber);
    if (candidates.length === 0) {
      setAudioStatus('idle');
      return;
    }

    let candidateIndex = 0;
    const failedCandidates = new Set<number>();
    const audio = new Audio();
    audioRef.current = audio;
    unregisterAudioRef.current = registerQuranAudio(audio);
    setAudioStatus('loading');

    const releaseAudio = () => {
      if (audioRef.current !== audio) return;
      audioRef.current = null;
      unregisterAudioRef.current?.();
      unregisterAudioRef.current = null;
    };

    const startCandidate = (index: number) => {
      candidateIndex = index;
      audio.src = candidates[index];
      audio.load();
      audio.play().catch((error: DOMException) => {
        if (error.name === 'NotAllowedError') {
          setAudioStatus('idle');
          return;
        }
        failCandidate(index);
      });
    };
    const failCandidate = (index: number) => {
      if (failedCandidates.has(index) || audioRef.current !== audio) return;
      failedCandidates.add(index);
      const nextIndex = index + 1;
      if (nextIndex < candidates.length) {
        startCandidate(nextIndex);
      } else {
        setAudioStatus('idle');
        releaseAudio();
      }
    };

    audio.onplaying = () => setAudioStatus('playing');
    audio.onpause = () => {
      if (audioRef.current === audio) {
        setAudioStatus('idle');
      }
    };
    audio.onended = () => {
      setAudioStatus('idle');
      releaseAudio();
    };
    audio.onerror = () => failCandidate(candidateIndex);
    startCandidate(0);
  };

  const handleToggleTafsir = async () => {
    if (!ayah) return;
    if (showTafsir) {
      setShowTafsir(false);
      return;
    }
    setShowTafsir(true);
    if (!tafsirContent) {
      const requestId = ++tafsirRequestRef.current;
      setLoadingTafsir(true);
      try {
        const res = await fetch(`/api/tafsir?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`);
        if (res.ok) {
          const json = await res.json();
          if (requestId === tafsirRequestRef.current && json?.data?.text) {
            setTafsirContent(json.data.text);
            setTafsirSource(json.data.sourceTitle || 'rioastamal/quran-json@73b1d52 · tafsir.id.kemenag');
          }
        }
      } catch (err) {
        console.warn('Failed to load random ayah tafsir:', err);
      } finally {
        if (requestId === tafsirRequestRef.current) setLoadingTafsir(false);
      }
    }
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
        <span>{t('Kembali ke Beranda', 'Back to home')}</span>
      </Link>

      {/* Header Banner - Compact & Clean */}
      <div className="p-4 sm:p-6 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-light text-ink-primary tracking-tight font-sans">
          {t('Inspirasi Ayat', 'Verse reflection')} <span className="font-semibold text-primary">Al-Qur&apos;an</span>
        </h1>

        <p className="text-xs sm:text-sm text-ink-secondary max-w-md mx-auto leading-relaxed font-sans">
          {t('Pilihan ayat Al-Qur’an acak untuk tadabbur harian dengan terjemahan Indonesia Kemenag RI, audio tilawah, dan bedah kata per kata.', 'A random Quran verse for reflection, with translations, recitation, and word-by-word study.')}
        </p>

        {/* Action Controls */}
        <div className="pt-1.5 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={fetchRandomAyah}
            disabled={loading}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-4 py-2 rounded-full font-semibold text-xs shadow-subtle transition-all disabled:opacity-50 font-sans"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? t('Memilih…', 'Choosing…') : t('Pilih Ayat Acak Lain', 'Choose another random verse')}</span>
          </button>

          {ayah && (
            <Link
              href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
              className="inline-flex items-center space-x-1.5 bg-canvas-soft hover:bg-primary-subdued border border-hairline hover:border-primary/40 text-ink-primary hover:text-primary px-4 py-2 rounded-full font-semibold text-xs transition-all font-sans"
            >
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>{t('Buka di Mushaf', 'Open in reader')} ({ayah.surahNumber}:{ayah.ayahNumber})</span>
            </Link>
          )}
        </div>
      </div>

      {/* Random Ayah Display Card */}
      {loading ? (
        <div className="p-12 text-center bg-canvas-surface border border-hairline rounded-2xl space-y-3 shadow-subtle">
          <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p role="status" className="text-sm text-ink-secondary font-sans">{t('Memuat ayat pilihan…', 'Loading a verse…')}</p>
        </div>
      ) : loadError ? (
        <div role="alert" className="space-y-3 border-y border-hairline py-8 text-center">
          <p className="text-base text-ink-secondary">{t('Ayat tidak dapat dimuat. Periksa koneksi lalu coba lagi.', 'The verse could not be loaded. Check your connection and try again.')}</p>
          <button type="button" onClick={fetchRandomAyah} className="min-h-11 px-4 font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{t('Coba lagi', 'Try again')}</button>
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
                  Surah {displayedSurahName} {ayah.surahNameArabic && `(${ayah.surahNameArabic})`}
                </h2>
                <span className="text-[11px] text-ink-mute font-sans">
                  {language === 'en' ? `Verse ${ayah.ayahNumber} · Quran ${ayah.surahNumber}:${ayah.ayahNumber}` : `Ayat ${ayah.ayahNumber} · Q.S. ${ayah.surahNumber}:${ayah.ayahNumber}`}
                </span>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center space-x-1.5">
              <Link
                href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-deep text-white shadow-subtle transition-all font-sans"
                title={t('Buka ayat ini langsung di mushaf', 'Open this verse in the reader')}
              >
                <BookOpen className="w-3 h-3" />
                <span className="hidden sm:inline">{t('Buka di Mushaf', 'Open in reader')}</span>
              </Link>

              <button
                onClick={handleToggleAudio}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-sans ${
                  audioStatus === 'playing'
                    ? 'bg-primary text-white shadow-subtle'
                    : 'bg-canvas-soft text-ink-secondary hover:bg-primary-subdued'
                }`}
                title={audioStatus === 'playing' ? t('Jeda tilawah', 'Pause recitation') : t('Dengarkan tilawah', 'Play recitation')}
              >
                {audioStatus === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                ) : audioStatus === 'playing' ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span>{audioStatus === 'loading' ? t('Memuat…', 'Loading…') : audioStatus === 'playing' ? t('Jeda', 'Pause') : t('Putar', 'Play')}</span>
              </button>

              <button
                onClick={handleToggleTafsir}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all font-sans border ${
                  showTafsir
                    ? 'bg-primary text-white border-primary shadow-subtle'
                    : 'bg-canvas-soft border-hairline text-ink-secondary hover:bg-primary-subdued'
                }`}
                title={t('Buka tafsir Indonesia · label Kemenag pada arsip', 'Open Indonesian tafsir · Kemenag archive label')}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('Tafsir', 'Tafsir · ID')}</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-canvas-soft text-ink-secondary hover:bg-primary-subdued transition-all font-sans"
                title={t('Salin ayat dan terjemahan', 'Copy verse and translation')}
              >
                {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3 text-ink-mute" />}
                <span>{copied ? t('Tersalin', 'Copied') : t('Salin', 'Copy')}</span>
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
                {t('Kata per Kata (WBW)', 'Word by word')}
              </button>
              <button
                onClick={() => setActiveTab('mushaf')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all font-sans ${
                  activeTab === 'mushaf'
                    ? 'bg-primary text-white shadow-subtle font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {t('Teks Mushaf', 'Mushaf text')}
              </button>
              <button
                onClick={() => setActiveTab('both')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all font-sans ${
                  activeTab === 'both'
                    ? 'bg-primary text-white shadow-subtle font-semibold'
                    : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {t('Keduanya', 'Both')}
              </button>
            </div>

            {/* Font Size Selector [SM | MD | LG] */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider flex items-center space-x-1 font-sans">
                <Type className="w-3 h-3 text-primary" />
                <span className="hidden sm:inline">{t('Ukuran:', 'Text size:')}</span>
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
                      meaningIndo={language === 'en' ? w.meaningEnglish : w.meaningIndo}
                      posTag={w.posTag}
                      posDetail={w.posDetail}
                      matchedRootSlug={w.rootSlug}
                      rootLetters={w.rootLetters}
                      audioUrl={w.audioUrl}
                      ayahArabic={ayah.verseArabic}
                      ayahIndo={language === 'en' ? englishVerseText : ayah.verseIndo}
                      surahNumber={ayah.surahNumber}
                      ayahNumber={ayah.ayahNumber}
                      wordIndex={w.position || (idx + 1)}
                      surahNameIndo={displayedSurahName}
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
                  <span>{t('Bedah Kata per Kata:', 'Word-by-word study')}</span>
                </span>
                <span className="text-[11px] text-ink-mute font-sans">
                  {t('Pilih kata untuk melihat sumber dan maknanya.', 'Select a word to view its sources and meanings.')}
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
                    meaningIndo={language === 'en' ? w.meaningEnglish : w.meaningIndo}
                    posTag={w.posTag}
                    posDetail={w.posDetail}
                    matchedRootSlug={w.rootSlug}
                    rootLetters={w.rootLetters}
                    audioUrl={w.audioUrl}
                    ayahArabic={ayah.verseArabic}
                    ayahIndo={language === 'en' ? englishVerseText : ayah.verseIndo}
                    surahNumber={ayah.surahNumber}
                    ayahNumber={ayah.ayahNumber}
                    wordIndex={w.position || (idx + 1)}
                    surahNameIndo={displayedSurahName}
                  />
                ))}
              </div>
            </div>
          )}

          {language === 'en' && (
            <div className="space-y-2 border-y border-hairline py-4">
              <p className="text-sm font-medium text-ink-secondary">Saheeh International · Quran.com</p>
              {englishTranslationStatus === 'loading' ? (
                <p role="status" className="text-base text-ink-secondary">{t('Memuat terjemahan Inggris…', 'Loading English translation…')}</p>
              ) : englishVerseText ? (
                <p lang="en" className="text-base leading-relaxed text-ink-primary">“{englishVerseText}”</p>
              ) : (
                <p role="note" className="text-sm text-ink-secondary">{t('Terjemahan Inggris belum tersedia. Teks Arab tetap dapat dibaca.', 'English translation is unavailable right now. The Arabic verse remains available.')}</p>
              )}
            </div>
          )}

          {/* Indonesian verse translation is kept labeled in both interface languages. */}
          <div className="space-y-1 border-y border-hairline py-4">
            <span className="text-xs font-medium text-ink-mute block font-sans">
              {t('Terjemahan Indonesia · Kemenag RI (resource 33):', 'Indonesian translation · Kemenag RI (resource 33):')}
            </span>
            <p className="text-xs sm:text-sm translation-kemenag text-ink-secondary leading-relaxed font-sans">
              &ldquo;{ayah.verseIndo}&rdquo;
            </p>
          </div>

          {/* Indonesian tafsir from the attributed archive; content stays in its source language. */}
          {showTafsir && (
            <div className="p-5 rounded-2xl bg-canvas-soft border border-primary/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium font-sans text-ink-primary">
                    {language === 'en' ? `Indonesian tafsir · ${displayedSurahName} ${ayah.ayahNumber}` : `Tafsir Indonesia · ${ayah.surahNameIndo} ${ayah.ayahNumber}`}
                  </span>
                </div>
                <button
                  onClick={() => setShowTafsir(false)}
                  className="text-xs text-ink-mute hover:text-ink-primary font-medium"
                >
                  {t('Tutup', 'Close')}
                </button>
              </div>

              {loadingTafsir ? (
                <div className="py-6 flex items-center justify-center space-x-2 text-ink-mute text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>{t('Memuat tafsir Indonesia…', 'Loading Indonesian tafsir…')}</span>
                </div>
              ) : tafsirContent ? (
                <div className="text-xs sm:text-sm font-sans leading-relaxed text-ink-secondary space-y-2 select-text">
                  <p className="whitespace-pre-line">{tafsirContent}</p>
                  <p className="text-[11px] text-ink-mute pt-2 border-t border-hairline">
                    {t('Arsip sumber:', 'Archive source:')} {tafsirSource}
                  </p>
                  <p className="text-sm leading-relaxed text-ink-secondary">
                    {t('Arsip ini memberi label “Kemenag” pada teks tafsir; asal-usul teks di salinan ini belum diverifikasi secara independen.', 'The archive labels this as “Kemenag” tafsir; the provenance of the text in this mirror has not been independently verified.')}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-ink-secondary">{t('Tafsir Indonesia belum tersedia untuk ayat ini.', 'Indonesian tafsir is unavailable for this verse.')}</p>
              )}
            </div>
          )}

          {/* Direct Navigation Call-to-Action to Full Mushaf Reading Page */}
          <div className="p-4 rounded-xl bg-canvas-soft border border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold text-ink-primary flex items-center justify-center sm:justify-start space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>{t('Baca dalam Konteks Mushaf', 'Read in the Quran reader')}</span>
              </span>
              <span className="text-[11px] text-ink-mute block">
                {t(`Buka Surah ${ayah.surahNameIndo} pada ayat ${ayah.ayahNumber}.`, `Open Surah ${displayedSurahName} at verse ${ayah.ayahNumber}.`)}
              </span>
            </div>

            <Link
              href={`/baca?surah=${ayah.surahNumber}&ayah=${ayah.ayahNumber}`}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all inline-flex items-center justify-center space-x-1.5 shrink-0 group"
            >
              <span>{t('Buka di Halaman Baca', 'Open in reader')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      ) : null}
    </div>
  );
}
