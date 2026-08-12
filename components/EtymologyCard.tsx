import { Sparkles, BookMarked } from 'lucide-react';

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
    <div className="p-7 rounded-xl bg-white border border-hairline shadow-soft space-y-4">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-subdued text-primary-deep flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-ink-primary">Etimologi &amp; Makna Klasik</h3>
            <p className="text-xs text-ink-mute font-mono">Tafsir Linguistik Roots Arab ({rootLatin.toUpperCase()})</p>
          </div>
        </div>

        <span className="font-arabic text-3xl font-bold text-primary">
          {rootArabic}
        </span>
      </div>

      {/* Classical Etymology Note */}
      {etymologyNote && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-sans">
          <div className="flex items-center space-x-1.5 font-bold text-amber-950 text-xs mb-1.5">
            <BookMarked className="w-4 h-4 text-amber-700" />
            <span>Wawasan Etimologi Kamus Klasik (Lisan al-Arab &amp; Mu&apos;jam):</span>
          </div>
          <p className="italic">{etymologyNote}</p>
        </div>
      )}

      {/* List of Primary Meanings */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-semibold text-ink-mute uppercase tracking-wider">Makna Utama dalam Bahasa Indonesia:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          {meaningsIndonesian.map((meaning, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-lg bg-canvas-soft border border-hairline text-ink-primary">
              <span className="w-5 h-5 rounded-full bg-primary-subdued text-primary-deep flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 font-mono">
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
