'use client';

import React, { useEffect } from 'react';
import { X, BookOpen, Info } from 'lucide-react';
import { useModalBackHandler } from '@/lib/hooks/useModalBackHandler';
import { useLanguage } from '@/lib/context/LanguageContext';

interface GrammarLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTagCode?: string;
}

const GRAMMAR_RULES = [
  {
    code: 'V',
    titleId: "Fi'il (Kata kerja)",
    titleEn: 'Verb (Fi‘l)',
    arabic: 'فِعْل',
    color: 'bg-primary-subdued text-primary border-primary/30',
    descriptionId: "Kata yang menunjukkan perbuatan atau keadaan dalam bentuk lampau (fi‘il māḍī), kini/akan datang (fi‘il muḍāri‘), atau perintah (fi‘il amr).",
    descriptionEn: 'A word for an action or state in the past (fi‘l māḍī), present/future (fi‘l muḍāri‘), or command (fi‘l amr).',
    exampleId: 'كَتَبَ (kataba) = dia telah menulis; يَقُولُ (yaqūlu) = dia berkata',
    exampleEn: 'كَتَبَ (kataba) = he wrote; يَقُولُ (yaqūlu) = he says',
  },
  {
    code: 'N',
    titleId: 'Isim (Kata benda dan konsep)',
    titleEn: 'Noun (Isim)',
    arabic: 'إِسْم',
    color: 'bg-primary-fixed text-primary-deep border-primary/20',
    descriptionId: 'Kata untuk orang, tempat, benda, konsep, sifat, atau makna yang tidak terikat waktu.',
    descriptionEn: 'A word for a person, place, thing, concept, quality, or meaning that is not bound to tense.',
    exampleId: 'كِتَابٌ (kitābun) = buku; رَحْمَٰن (raḥmān) = Maha Pengasih',
    exampleEn: 'كِتَابٌ (kitābun) = a book; رَحْمَٰن (raḥmān) = the Most Merciful',
  },
  {
    code: 'P',
    titleId: 'Harf (Kata tugas dan partikel)',
    titleEn: 'Particle (Ḥarf)',
    arabic: 'حَرْف',
    color: 'bg-canvas-soft text-ink-primary border-hairline',
    descriptionId: 'Kata tugas—seperti preposisi, konjungsi, dan partikel—yang menghubungkan atau memberi fungsi pada unsur lain. Maknanya bergantung pada konteks.',
    descriptionEn: 'A function word—such as a preposition, conjunction, or particle—that links or shapes other words. Its meaning depends on context.',
    exampleId: 'فِي (fī) = di dalam; عَلَى (ʿalā) = di atas; إِنَّ (inna) = sesungguhnya',
    exampleEn: 'فِي (fī) = in; عَلَى (ʿalā) = on/upon; إِنَّ (inna) = indeed',
  },
  {
    code: 'PRON',
    titleId: 'Dhamir (Kata ganti)',
    titleEn: 'Pronoun (Ḍamīr)',
    arabic: 'ضَمِير',
    color: 'bg-primary-subdued text-primary border-primary/30',
    descriptionId: 'Kata ganti orang seperti dia, mereka, kami, atau kamu; dapat berdiri sendiri (munfaṣil) atau melekat pada kata lain (muttasil).',
    descriptionEn: 'A personal pronoun such as he, they, we, or you; it may stand alone (munfaṣil) or attach to another word (muttasil).',
    exampleId: 'هُوَ (huwa) = dia; هُمْ (hum) = mereka; نَا (nā) = kami/kita',
    exampleEn: 'هُوَ (huwa) = he; هُمْ (hum) = they; نَا (nā) = we/us',
  }
];

export default function GrammarLegendModal({ isOpen, onClose, selectedTagCode }: GrammarLegendModalProps) {
  const { t } = useLanguage();
  const { handleClose } = useModalBackHandler(isOpen, onClose, { modalName: 'grammar_legend' });

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="grammar-legend-title"
        className="bg-canvas-surface rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-hairline relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-subdued text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 id="grammar-legend-title" className="font-bold text-base text-ink-primary font-sans">
                {t('Panduan Nahwu dan Sharaf', 'Nahw and Sarf guide')}
              </h3>
              <p className="text-xs text-ink-mute font-sans">
                {t('Kelas kata dalam Al-Qur’an', 'Quranic Arabic word classes')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label={t('Tutup panduan', 'Close guide')}
            className="p-2 rounded-full text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Legend Grid */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {GRAMMAR_RULES.map((rule) => {
            const isHighlight = selectedTagCode && selectedTagCode.toUpperCase() === rule.code;
            return (
              <div
                key={rule.code}
                className={`p-4 rounded-2xl border transition-all space-y-2 ${
                  isHighlight
                    ? 'border-primary bg-primary-subdued/30 shadow-subtle ring-2 ring-primary/20'
                    : 'border-hairline bg-canvas-soft hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border font-sans ${rule.color}`}>
                      {rule.code}
                    </span>
                    <span className="font-bold text-sm text-ink-primary font-sans">{t(rule.titleId, rule.titleEn)}</span>
                  </div>
                  <span className="font-arabic text-lg font-bold text-primary" dir="rtl">{rule.arabic}</span>
                </div>

                <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                  {t(rule.descriptionId, rule.descriptionEn)}
                </p>

                <div className="text-[11px] text-ink-mute bg-canvas-surface p-2.5 rounded-xl border border-hairline font-sans">
                  <span className="font-semibold text-ink-primary">{t('Contoh:', 'Example:')}</span> {t(rule.exampleId, rule.exampleEn)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Source note separates corpus tags from Qurabic's unreviewed explanations. */}
        <div className="pt-3 border-t border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-ink-secondary font-sans">
          <p className="flex items-start gap-2 sm:max-w-[19rem]">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-mute" aria-hidden="true" />
            <span>{t('Tag kelas kata dari ', 'Word-class tags from ')}<a href="https://corpus.quran.com/documentation/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Quranic Arabic Corpus</a>{t(' (University of Leeds). Penjelasan adalah catatan Qurabic; proses penulisan dan telaah ahli tidak tercatat.', ' (University of Leeds). Explanations are Qurabic notes; authorship and expert review are undocumented.')}</span>
          </p>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <a
              href="/morfologi"
              onClick={handleClose}
              className="px-3.5 py-1.5 bg-canvas-soft hover:bg-primary-fixed border border-hairline text-ink-primary hover:text-primary text-xs font-semibold rounded-full transition-all font-sans"
            >
              {t('Buka indeks akar', 'Open root index')}
            </a>
            <button
              onClick={handleClose}
              className="px-4 py-1.5 bg-primary hover:bg-primary-deep text-white text-xs font-semibold rounded-full shadow-subtle transition-all font-sans"
            >
              {t('Tutup', 'Close')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
