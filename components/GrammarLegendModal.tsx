'use client';

import React from 'react';
import { X, BookOpen, ShieldCheck } from 'lucide-react';

interface GrammarLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTagCode?: string;
}

const GRAMMAR_RULES = [
  {
    code: 'V',
    title: "Fi'il (Kata Kerja)",
    arabic: 'فِعْل',
    color: 'bg-primary-subdued text-primary border-primary/30',
    description: "Kata yang menunjukkan perbuatan atau peristiwa yang terikat dengan waktu (Lampau / Fi'il Madhi, Sekarang-Mendatang / Fi'il Mudhari', atau Perintah / Fi'il Amar).",
    example: 'كَتَبَ (kataba) = Dia telah menulis, يَقُولُ (yaqulu) = Dia berkata'
  },
  {
    code: 'N',
    title: 'Isim (Kata Benda & Konsep)',
    arabic: 'إِسْم',
    color: 'bg-primary-fixed text-primary-deep border-primary/20',
    description: 'Kata yang merujuk pada nama manusia, tempat, benda, konsep, sifat, atau kata jadian yang tidak terikat dimensi waktu.',
    example: 'كِتَابٌ (kitabun) = Buku, رَحْمٰن (rahman) = Maha Pengasih'
  },
  {
    code: 'P',
    title: 'Harf (Kata Tugas & Partikel)',
    arabic: 'حَرْف',
    color: 'bg-canvas-soft text-ink-primary border-hairline',
    description: "Kata penghubung atau partikel yang tidak memiliki makna sempurna kecuali jika bersambung dengan Isim atau Fi'il.",
    example: 'فِي (fii) = Di dalam, عَلَى (ala) = Di atas, إِنَّ (inna) = Sesungguhnya'
  },
  {
    code: 'PRON',
    title: 'Dhamir (Kata Ganti Nama)',
    arabic: 'ضَمِير',
    color: 'bg-primary-subdued text-primary border-primary/30',
    description: 'Kata ganti penunjuk orang (Dia, Mereka, Kami, Kamu) baik yang berdiri sendiri (Munfashil) maupun menempel (Muttashil).',
    example: 'هُوَ (huwa) = Dia, هُمْ (hum) = Mereka, نَا (naa) = Kami'
  }
];

export default function GrammarLegendModal({ isOpen, onClose, selectedTagCode }: GrammarLegendModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-canvas-surface rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-hairline relative space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-subdued text-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-ink-primary font-sans">
                Panduan Tata Bahasa Sharaf &amp; Nahwu
              </h3>
              <p className="text-xs text-ink-mute font-sans">
                Klasifikasi Bagian Kalimat (Part-of-Speech) Al-Qur&apos;an
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
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
                    <span className="font-bold text-sm text-ink-primary font-sans">{rule.title}</span>
                  </div>
                  <span className="font-arabic text-lg font-bold text-primary" dir="rtl">{rule.arabic}</span>
                </div>

                <p className="text-xs text-ink-secondary leading-relaxed font-sans">
                  {rule.description}
                </p>

                <div className="text-[11px] text-ink-mute bg-canvas-surface p-2.5 rounded-xl border border-hairline font-sans">
                  <span className="font-semibold text-ink-primary">Contoh:</span> {rule.example}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Detail Link & Close */}
        <div className="pt-3 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-mute font-sans">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Sumber: Quranic Arabic Corpus (Univ. of Leeds)</span>
          </span>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <a
              href="/morfologi"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-canvas-soft hover:bg-primary-fixed border border-hairline text-ink-primary hover:text-primary text-xs font-semibold rounded-full transition-all font-sans"
            >
              Lihat Katalog Morfologi
            </a>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-primary hover:bg-primary-deep text-white text-xs font-semibold rounded-full shadow-subtle transition-all font-sans"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
