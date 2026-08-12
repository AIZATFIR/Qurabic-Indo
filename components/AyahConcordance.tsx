import { VerseOccurrence } from '@/lib/types/morphology';
import { BookOpen, MapPin } from 'lucide-react';

interface AyahConcordanceProps {
  occurrences: VerseOccurrence[];
  rootArabicJoined: string;
}

export default function AyahConcordance({ occurrences, rootArabicJoined }: AyahConcordanceProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <span>Kemunculan Ayat Al-Qur&apos;an (Concordance)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Daftar surah dan ayat yang memuat kata turunan ini</p>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
          {occurrences.length} Ayat Contoh
        </span>
      </div>

      <div className="space-y-4">
        {occurrences.map((verse, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4 hover:border-emerald-500/30 transition-colors"
          >
            {/* Verse Badge Location */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 font-bold border border-slate-700 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Surah {verse.surahNameIndo} ({verse.surahNumber}:{verse.ayahNumber})</span>
                </span>
                <span className="font-arabic text-sm text-slate-300">
                  سورة {verse.surahNameArabic}
                </span>
              </div>

              <span className="text-[11px] font-mono text-slate-500">
                Posisi: {verse.wordLocation}
              </span>
            </div>

            {/* Arabic Verse Display */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 text-right">
              <p className="font-arabic text-2xl sm:text-3xl text-slate-100 leading-loose">
                {verse.verseArabic}
              </p>
            </div>

            {/* Highlighted Word & Indonesian Translation */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Kata Terkait:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-arabic font-bold text-base border border-emerald-500/30">
                  {verse.matchedWordArabic}
                </span>
                <span className="text-slate-400 font-medium">({verse.matchedWordIndo})</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 text-xs text-slate-200 leading-relaxed border border-slate-700/50">
                <span className="text-[10px] text-emerald-400 font-bold block mb-0.5 uppercase tracking-wide">Terjemahan Kemenag RI:</span>
                <p>&quot;{verse.verseIndo}&quot;</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
