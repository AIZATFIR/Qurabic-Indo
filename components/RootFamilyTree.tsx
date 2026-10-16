'use client';

import React, { useState } from 'react';
import { GitBranch, Layers, ArrowRight, BookOpen } from 'lucide-react';

export interface DerivativeNode {
  category: 'Madhi' | 'Mudhari' | 'Amr' | 'Masdar' | 'IsimFa\'il' | 'IsimMaf\'ul' | 'Lainnya';
  wazan: string;
  arabic: string;
  translit: string;
  meaningIndo: string;
  quranOccurrenceCount?: number;
  verseExample?: { verseRef: string; textArabic: string };
}

interface RootFamilyTreeProps {
  rootSlug?: string;
  rootArabic?: string;
  customNodes?: DerivativeNode[];
}

/**
 * Pre-defined rich derivative families for core Quranic roots
 */
const CLASSICAL_FAMILY_TREES: Record<string, DerivativeNode[]> = {
  's-b-r': [
    { category: 'Madhi', wazan: 'فَعَلَ (Form I)', arabic: 'صَبَرَ', translit: 'Ṣabara', meaningIndo: 'Dia telah bersabar', quranOccurrenceCount: 15, verseExample: { verseRef: 'QS. 16:126', textArabic: 'وَلَئِنْ صَبَرْتُمْ لَهُوَ خَيْرٌ لِلصَّابِرِينَ' } },
    { category: 'Mudhari', wazan: 'يَفْعِلُ (Form I)', arabic: 'يَصْبِرُ', translit: 'Yaṣbiru', meaningIndo: 'Dia sedang/akan bersabar', quranOccurrenceCount: 22, verseExample: { verseRef: 'QS. 12:90', textArabic: 'إِنَّهُ مَنْ يَتَّقِ وَيَصْبِرْ' } },
    { category: 'Amr', wazan: 'افْعِلْ (Form I)', arabic: 'اصْبِرْ', translit: 'Iṣbir', meaningIndo: 'Bersabarlah!', quranOccurrenceCount: 19, verseExample: { verseRef: 'QS. 74:7', textArabic: 'وَلِرَبِّكَ فَاصْبِرْ' } },
    { category: 'Masdar', wazan: 'فَعْلٌ', arabic: 'صَبْرٌ', translit: 'Ṣabr', meaningIndo: 'Kesabaran', quranOccurrenceCount: 14, verseExample: { verseRef: 'QS. 2:153', textArabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ' } },
    { category: 'IsimFa\'il', wazan: 'فَاعِلٌ', arabic: 'صَابِرٌ', translit: 'Ṣābir', meaningIndo: 'Orang yang bersabar', quranOccurrenceCount: 35, verseExample: { verseRef: 'QS. 2:155', textArabic: 'وَبَشِّرِ الصَّابِرِينَ' } },
    { category: 'Lainnya', wazan: 'فَعَّارٌ (Mubalaghah)', arabic: 'صَبَّارٌ', translit: 'Ṣabbār', meaningIndo: 'Orang yang amat sangat bersabar', quranOccurrenceCount: 4, verseExample: { verseRef: 'QS. 14:5', textArabic: 'لِكُلِّ صَبَّارٍ شَكُورٍ' } },
    { category: 'Madhi', wazan: 'اِفْتَعَلَ (Form VIII)', arabic: 'اصْطَبَرَ', translit: 'Iṣṭabara', meaningIndo: 'Berjuang keras bersabar (Mujahadah)', quranOccurrenceCount: 6, verseExample: { verseRef: 'QS. 19:65', textArabic: 'فَاعْبُدْهُ وَاصْطَبِرْ لِعِبَادَتِهِ' } }
  ],
  'k-t-b': [
    { category: 'Madhi', wazan: 'فَعَلَ (Form I)', arabic: 'كَتَبَ', translit: 'Kataba', meaningIndo: 'Telah menulis / menetapkan', quranOccurrenceCount: 55, verseExample: { verseRef: 'QS. 5:21', textArabic: 'الَّتِي كَتَبَ اللَّهُ لَكُمْ' } },
    { category: 'Madhi', wazan: 'فُعِلَ (Majhul)', arabic: 'كُتِبَ', translit: 'Kutiba', meaningIndo: 'Telah diwajibkan / ditetapkan', quranOccurrenceCount: 12, verseExample: { verseRef: 'QS. 2:183', textArabic: 'كُتِبَ عَلَيْكُمُ الصِّيَامُ' } },
    { category: 'Masdar', wazan: 'فِعَالٌ', arabic: 'كِتَابٌ', translit: 'Kitāb', meaningIndo: 'Kitab / Ketetapan Tertulis', quranOccurrenceCount: 261, verseExample: { verseRef: 'QS. 2:2', textArabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ' } },
    { category: 'IsimFa\'il', wazan: 'فَاعِلٌ', arabic: 'كَاتِبٌ', translit: 'Kātib', meaningIndo: 'Penulis / Pencatat', quranOccurrenceCount: 6, verseExample: { verseRef: 'QS. 2:282', textArabic: 'وَلْيَكْتُبْ بَيْنَكُمْ كَاتِبٌ بِالْعَدْلِ' } },
    { category: 'IsimMaf\'ul', wazan: 'مَفْعُولٌ', arabic: 'مَكْتُوبٌ', translit: 'Maktūb', meaningIndo: 'Tertulis / Diterapkan', quranOccurrenceCount: 4, verseExample: { verseRef: 'QS. 7:157', textArabic: 'يَجِدُونَهُ مَكْتُوبًا عِنْدَهُمْ' } }
  ],
  'E-l-m': [
    { category: 'Madhi', wazan: 'فَعِلَ (Form I)', arabic: 'عَلِمَ', translit: '\'Alima', meaningIndo: 'Telah mengetahui', quranOccurrenceCount: 382, verseExample: { verseRef: 'QS. 2:216', textArabic: 'وَاللَّهُ يَعْلَمُ وَأَنْتُمْ لَا تَعْلَمُونَ' } },
    { category: 'Madhi', wazan: 'فَعَّلَ (Form II)', arabic: 'عَلَّمَ', translit: '\'Allama', meaningIndo: 'Mengajarkan', quranOccurrenceCount: 41, verseExample: { verseRef: 'QS. 96:4', textArabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ' } },
    { category: 'Masdar', wazan: 'فِعْلٌ', arabic: 'عِلْمٌ', translit: '\'Ilm', meaningIndo: 'Ilmu / Pengetahuan', quranOccurrenceCount: 105, verseExample: { verseRef: 'QS. 17:85', textArabic: 'وَمَا أُوتِيتُمْ مِنَ الْعِلْمِ إِلَّا قَلِيلًا' } },
    { category: 'IsimFa\'il', wazan: 'فَاعِلٌ / فَعِيلٌ', arabic: 'عَالِمٌ / عَلِيمٌ', translit: '\'Ālim / \'Alīm', meaningIndo: 'Orang yang tahu / Maha Mengetahui', quranOccurrenceCount: 160, verseExample: { verseRef: 'QS. 2:32', textArabic: 'إِنَّكَ أَنْتَ الْعَلِيمُ الْحَكِيمُ' } },
    { category: 'Lainnya', wazan: 'فَاعَلُونَ', arabic: 'عَالَمِينَ', translit: '\'Ālamīn', meaningIndo: 'Semesta alam / seluruh makhluk', quranOccurrenceCount: 73, verseExample: { verseRef: 'QS. 1:2', textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' } }
  ]
};

function generateGenericFamilyTree(rootAr: string, rootSlug: string): DerivativeNode[] {
  const clean = (rootAr || rootSlug || 'فعل').replace(/[^a-zA-Z\u0621-\u064A\s-]/g, '').trim();
  const letters = clean.includes('-') ? clean.split('-') : clean.split('');
  const f = letters[0] || 'ف';
  const a = letters[1] || 'ع';
  const l = letters[2] || 'ل';

  return [
    { category: 'Madhi', wazan: 'فَعَلَ (Form I)', arabic: `${f}َ${a}َ${l}َ`, translit: 'Fa\'ala', meaningIndo: 'Telah melakukan (Fi\'il Madhi)' },
    { category: 'Mudhari', wazan: 'يَفْعُلُ (Form I)', arabic: `يَ${f}ْ${a}ُ${l}ُ`, translit: 'Yaf\'ulu', meaningIndo: 'Sedang / akan melakukan (Mudhari\')' },
    { category: 'Amr', wazan: 'اُفْعُلْ (Form I)', arabic: `اُ${f}ْ${a}ُ${l}ْ`, translit: 'Uf\'ul', meaningIndo: 'Lakukanlah! (Perintah)' },
    { category: 'Masdar', wazan: 'فَعْلٌ', arabic: `${f}َ${a}ْ${l}ٌ`, translit: 'Fa\'l', meaningIndo: 'Tindakan / Kata Benda' },
    { category: 'IsimFa\'il', wazan: 'فَاعِلٌ', arabic: `${f}َا${a}ِ${l}ٌ`, translit: 'Fā\'il', meaningIndo: 'Pelaku / yang melakukan' },
    { category: 'IsimMaf\'ul', wazan: 'مَفْعُولٌ', arabic: `مَ${f}ْ${a}ُ${l}ٌ`, translit: 'Maf\'ūl', meaningIndo: 'Objek / yang dikenai' }
  ];
}

export default function RootFamilyTree({ rootSlug, rootArabic, customNodes }: RootFamilyTreeProps) {
  const slug = (rootSlug || '').toLowerCase();
  const nodes = customNodes || CLASSICAL_FAMILY_TREES[slug] || generateGenericFamilyTree(rootArabic || '', slug);
  const [activeCategory, setActiveCategory] = useState<string>('semua');

  const categories = ['semua', 'Madhi', 'Mudhari', 'Amr', 'Masdar', 'IsimFa\'il', 'IsimMaf\'ul', 'Lainnya'];
  const filteredNodes = activeCategory === 'semua' ? nodes : nodes.filter(n => n.category === activeCategory);

  return (
    <div className="bg-canvas-surface border border-hairline rounded-3xl p-5 sm:p-7 space-y-6 shadow-subtle font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center space-x-1.5 font-sans">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Peta Silsilah Derivasi Morfologi (Isytiqaq)</span>
          </span>
          <h3 className="text-lg font-bold text-ink-primary font-sans mt-0.5">
            Pohon Cabang Morfologis ({rootArabic || rootSlug || 'Akar Kata'})
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all border font-sans ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary shadow-subtle'
                  : 'bg-canvas-soft border-hairline text-ink-secondary hover:border-primary/40'
              }`}
            >
              {cat === 'semua' ? 'Semua Cabang' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Derivative Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-canvas-soft border border-hairline hover:border-primary/40 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                {node.category}
              </span>
              <span className="text-xs font-mono font-semibold text-ink-mute">
                {node.wazan}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="font-arabic text-2xl font-bold text-primary group-hover:scale-105 transition-transform" dir="rtl">
                {node.arabic}
              </div>
              {node.quranOccurrenceCount && (
                <span className="text-[11px] font-semibold text-ink-mute bg-canvas-surface px-2 py-0.5 rounded-md border border-hairline">
                  {node.quranOccurrenceCount}x di Al-Qur&apos;an
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-ink-primary font-sans">
              {node.translit}
            </p>

            <p className="text-xs text-ink-secondary font-sans leading-snug">
              {node.meaningIndo}
            </p>

            {node.verseExample && (
              <div className="p-2.5 bg-canvas-surface border border-hairline rounded-xl text-[11px] space-y-1">
                <span className="text-[10px] text-ink-mute font-bold block">
                  Contoh {node.verseExample.verseRef}:
                </span>
                <p className="font-arabic text-sm text-ink-primary" dir="rtl">
                  {node.verseExample.textArabic}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
