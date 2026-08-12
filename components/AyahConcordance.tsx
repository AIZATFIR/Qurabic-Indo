import { VerseOccurrence } from '@/lib/types/morphology';
import { BookOpen, MapPin } from 'lucide-react';

interface AyahConcordanceProps {
  occurrences: VerseOccurrence[];
  rootArabicJoined: string;
}

export default function AyahConcordance({ occurrences, rootArabicJoined }: AyahConcordanceProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between pb-2 border-b border-hairline">
        <div>
          <h3 className="text-xl font-light text-ink-primary flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Kemunculan Ayat Al-Qur&apos;an (Concordance)</span>
          </h3>
          <p className="text-xs text-ink-mute mt-0.5">Daftar surah dan ayat yang memuat kata turunan ini</p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-primary-subdued text-primary-deep font-semibold">
          {occurrences.length} Ayat Contoh
        </span>
      </div>

      <div className="space-y-4">
        {occurrences.map((verse, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl bg-white border border-hairline shadow-soft space-y-4 hover:shadow-hover transition-all"
          >
            {/* Verse Badge Location */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-canvas-soft text-primary font-semibold border border-hairline flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Surah {verse.surahNameIndo} ({verse.surahNumber}:{verse.ayahNumber})</span>
                </span>
                <span className="font-arabic text-sm text-ink-secondary">
                  سورة {verse.surahNameArabic}
                </span>
              </div>

              <span className="text-[11px] font-mono text-ink-mute">
                Posisi: {verse.wordLocation}
              </span>
            </div>

            {/* Arabic Verse Display */}
            <div className="p-4 rounded-lg bg-canvas-soft border border-hairline text-right">
              <p className="font-arabic text-2xl sm:text-3xl text-ink-primary leading-loose">
                {verse.verseArabic}
              </p>
            </div>

            {/* Highlighted Word & Indonesian Translation */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-ink-mute">Kata Terkait:</span>
                <span className="px-2 py-0.5 rounded bg-primary-subdued text-primary-deep font-arabic font-bold text-base border border-primary-subdued">
                  {verse.matchedWordArabic}
                </span>
                <span className="text-ink-secondary font-medium">({verse.matchedWordIndo})</span>
              </div>

              <div className="p-3.5 rounded-lg bg-canvas-soft text-xs text-ink-secondary leading-relaxed border border-hairline">
                <span className="text-[10px] text-primary font-bold block mb-0.5 uppercase tracking-wide">Terjemahan Kemenag RI:</span>
                <p>&quot;{verse.verseIndo}&quot;</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
