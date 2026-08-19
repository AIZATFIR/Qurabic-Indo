'use client';

import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, BookOpen, Volume2, Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import QuranWordInteractive from '@/components/QuranWordInteractive';

interface RandomAyah {
  surahNumber: number;
  surahNameIndo: string;
  surahNameArabic: string;
  ayahNumber: number;
  verseArabic: string;
  verseIndo: string;
  audioUrl?: string;
  words: string[];
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
      // 6236 total verses in the Quran
      const randomAyahNumber = Math.floor(Math.random() * 6236) + 1;

      const [arRes, idRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}`),
        fetch(`https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/id.indonesian`)
      ]);

      if (arRes.ok && idRes.ok) {
        const arJson = await arRes.json();
        const idJson = await idRes.json();

        const arData = arJson.data;
        const idData = idJson.data;

        setAyah({
          surahNumber: arData.surah.number,
          surahNameIndo: arData.surah.englishName,
          surahNameArabic: arData.surah.name,
          ayahNumber: arData.numberInSurah,
          verseArabic: arData.text,
          verseIndo: idData.text,
          audioUrl: arData.audio || `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${randomAyahNumber}.mp3`,
          words: arData.text.split(' ')
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
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-hairline shadow-soft gradient-mesh text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ayat Acak &amp; Tadabbur Harian</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-light text-ink-primary tracking-tight font-sans">
          Inspirasi Ayat Al-Qur&apos;an
        </h1>

        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Temukan pesan dan hikmah dari 6.236 Ayat Al-Qur&apos;an secara acak. Klik pada kata manapun untuk membedah akar kata &amp; etimologinya.
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
        <div className="p-16 text-center bg-white border border-hairline rounded-3xl space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-mono text-slate-500">Memilih Ayat Acak dari Al-Qur&apos;an...</p>
        </div>
      ) : ayah ? (
        <div className="p-8 sm:p-12 bg-white border border-hairline rounded-3xl shadow-hover space-y-8">
          
          {/* Ayah Surah Header & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4">
            <div className="flex items-center space-x-3">
              <span className="w-9 h-9 rounded-full bg-primary-subdued text-primary-deep font-bold font-mono text-sm flex items-center justify-center border border-primary/20">
                {ayah.surahNumber}
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-lg font-sans">
                  Surah {ayah.surahNameIndo} ({ayah.surahNameArabic})
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Ayat Ke-{ayah.ayahNumber}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlayAudio}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  isPlaying ? 'bg-primary text-white scale-105 shadow-md animate-pulse' : 'bg-canvas-soft hover:bg-slate-100 text-slate-700 border border-hairline'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlaying ? 'Memutar...' : 'Dengar Audio'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-canvas-soft hover:bg-slate-100 text-slate-700 border border-hairline transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                <span>{copied ? 'Tersalin!' : 'Salin Ayat'}</span>
              </button>
            </div>
          </div>

          {/* Arabic Text with Interactive Clickable Words */}
          <div className="py-4 text-right dir-rtl">
            <div className="font-arabic-lg text-3xl sm:text-5xl text-ink-primary leading-loose tracking-wide space-x-2 space-x-reverse">
              {ayah.words.map((w, idx) => (
                <QuranWordInteractive
                  key={idx}
                  wordArabic={w}
                />
              ))}
            </div>
          </div>

          {/* Indonesian Kemenag Translation */}
          <div className="p-6 bg-canvas-soft border border-hairline rounded-2xl space-y-2">
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider block">
              Terjemahan Kemenag RI:
            </span>
            <p className="text-base sm:text-lg translation-kemenag leading-relaxed">
              {ayah.verseIndo}
            </p>
          </div>

        </div>
      ) : null}
    </div>
  );
}
