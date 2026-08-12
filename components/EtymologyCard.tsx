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
    <div className="p-6 rounded-2xl glass-panel border border-amber-500/25 bg-gradient-to-br from-slate-900/90 to-obsidian-900 space-y-4 shadow-glow-amber">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Etimologi &amp; Makna Klasik</h3>
            <p className="text-[11px] text-amber-400/90 font-mono">Tafsir Linguistik Roots Arab ({rootLatin.toUpperCase()})</p>
          </div>
        </div>

        <span className="font-arabic text-3xl font-bold text-amber-400">
          {rootArabic}
        </span>
      </div>

      {/* Classical Etymology Note */}
      {etymologyNote && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed font-sans">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs mb-1.5">
            <BookMarked className="w-4 h-4" />
            <span>Wawasan Etimologi Kamus Klasik (Lisan al-Arab &amp; Mu&apos;jam):</span>
          </div>
          <p className="italic">{etymologyNote}</p>
        </div>
      )}

      {/* List of Primary Meanings */}
      <div className="space-y-2 pt-1">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Makna Utama dalam Bahasa Indonesia:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {meaningsIndonesian.map((meaning, idx) => (
            <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-200">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
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
