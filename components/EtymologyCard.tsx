import { Compass, BookMarked, ShieldCheck } from 'lucide-react';

interface EtymologyCardProps {
  rootArabic: string;
  rootLatin: string;
  etymologyNote: string;
  meaningsIndonesian: string[];
}

export default function EtymologyCard({
  rootArabic,
  rootLatin,
  etymologyNote,
  meaningsIndonesian,
}: EtymologyCardProps) {
  return (
    <div className="p-7 sm:p-9 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-6">
      
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-subdued text-primary flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base sm:text-lg text-ink-primary font-sans">Etimologi dan Makna Klasik</h3>
            <p className="text-xs sm:text-sm text-ink-mute font-sans">Tafsir Linguistik Akar Kata ({rootLatin})</p>
          </div>
        </div>

        <span className="font-arabic text-4xl sm:text-5xl font-bold text-primary" dir="rtl">
          {rootArabic}
        </span>
      </div>

      {/* Classical Etymology Note */}
      {etymologyNote && (
        <div className="p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-hairline text-sm sm:text-base text-ink-secondary leading-relaxed font-sans space-y-2">
          <div className="flex items-center space-x-2 font-semibold text-ink-primary text-xs sm:text-sm">
            <BookMarked className="w-4 h-4 text-primary" />
            <span>Kajian Kamus Klasik (Lisan al-&apos;Arab &amp; Mu&apos;jam Maqayis al-Lughah):</span>
          </div>
          <p className="italic text-ink-primary leading-relaxed font-normal">&ldquo;{etymologyNote}&rdquo;</p>
        </div>
      )}

      {/* List of Primary Meanings */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs sm:text-sm font-semibold text-ink-mute uppercase tracking-wider font-sans">
          Cakupan Makna dalam Bahasa Indonesia:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
          {meaningsIndonesian.map((meaning, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-4 rounded-2xl bg-canvas-soft border border-hairline text-ink-primary font-sans">
              <span className="w-6 h-6 rounded-xl bg-primary-subdued text-primary flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 font-sans">
                {idx + 1}
              </span>
              <span className="leading-relaxed font-medium">{meaning}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Source Attribution */}
      <div className="pt-2 flex justify-end">
        <span className="inline-flex items-center space-x-1.5 text-xs text-ink-mute font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Sumber: Lisan al-&apos;Arab (Ibn Manzhur) &amp; Mu&apos;jam Maqayis al-Lughah (Ibn Faris)</span>
        </span>
      </div>
    </div>
  );
}
