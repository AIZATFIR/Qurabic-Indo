import { Compass, BookMarked } from 'lucide-react';

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
    <div className="p-6 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-subdued text-primary flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-ink-primary font-sans">Etimologi &amp; Makna Klasik</h3>
            <p className="text-xs text-ink-mute font-sans">Tafsir Linguistik Akar Arab ({rootLatin})</p>
          </div>
        </div>

        <span className="font-arabic text-3xl font-bold text-primary">
          {rootArabic}
        </span>
      </div>

      {/* Classical Etymology Note */}
      {etymologyNote && (
        <div className="p-3.5 rounded-xl bg-canvas-soft border border-hairline text-xs text-ink-secondary leading-relaxed font-sans">
          <div className="flex items-center space-x-1.5 font-bold text-ink-primary text-xs mb-1">
            <BookMarked className="w-3.5 h-3.5 text-primary" />
            <span>Wawasan Kamus Klasik (Lisan al-Arab &amp; Mu&apos;jam):</span>
          </div>
          <p className="italic">&ldquo;{etymologyNote}&rdquo;</p>
        </div>
      )}

      {/* List of Primary Meanings */}
      <div className="space-y-2 pt-1">
        <h4 className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider font-sans">
          Makna Utama Bahasa Indonesia:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {meaningsIndonesian.map((meaning, idx) => (
            <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-lg bg-canvas-soft border border-hairline text-ink-primary font-sans">
              <span className="w-4 h-4 rounded-full bg-primary-subdued text-primary flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 font-sans">
                {idx + 1}
              </span>
              <span>{meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
