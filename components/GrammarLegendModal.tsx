'use client';

import React from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';

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
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Kata yang menunjukkan perbuatan atau peristiwa yang terikat dengan waktu (Lampau / Fi\'il Madhi, Sekarang-Mendatang / Fi\'il Mudhari\', atau Perintah / Fi\'il Amar).',
    example: 'كَتَبَ (kataba) = Dia telah menulis, يَقُولُ (yaqulu) = Dia berkata'
  },
  {
    code: 'N',
    title: 'Isim (Kata Benda / Kata Sifat)',
    arabic: 'إِسْم',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Kata yang merujuk pada nama manusia, tempat, benda, konsep, sifat, atau kata jadian yang tidak terikat waktu.',
    example: 'كِتَابٌ (kitabun) = Buku, رَحْمٰن (rahman) = Maha Pengasih'
  },
  {
    code: 'P',
    title: 'Harf (Kata Tugas / Harf / Kata Penghubung)',
    arabic: 'حَرْف',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Kata penyambung yang tidak memiliki makna sempurna kecuali jika bersambung dengan Isim atau Fi\'il (misalnya kata depan, kata hubung, penegas).',
    example: 'فِي (fii) = Di dalam, عَلَى (ala) = Di atas, إِنَّ (inna) = Sesungguhnya'
  },
  {
    code: 'PRON',
    title: 'Dhamir (Kata Ganti Nama)',
    arabic: 'ضَمِير',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Kata ganti penunjuk orang (Dialah, Mereka, Kami, Kamu, -Nya, -Mu) baik yang berdiri sendiri (Munfashil) maupun menempel (Mutthashil).',
    example: 'هُوَ (huwa) = Dia, هُمْ (hum) = Mereka, نَا (naa) = Kami'
  }
];

export default function GrammarLegendModal({ isOpen, onClose, selectedTagCode }: GrammarLegendModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-hairline relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-primary-subdued text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-ink-primary font-sans">
                Panduan Tata Bahasa Sharaf & Nahwu
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Quranic Part-of-Speech (POS) Tags
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-canvas-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend Grid */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {GRAMMAR_RULES.map((rule) => {
            const isHighlight = selectedTagCode && selectedTagCode.toUpperCase() === rule.code;
            return (
              <div
                key={rule.code}
                className={`p-4 rounded-2xl border transition-all ${
                  isHighlight
                    ? 'border-primary bg-primary-subdued/30 shadow-md ring-2 ring-primary/20'
                    : 'border-hairline bg-canvas-soft hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${rule.color}`}>
                      {rule.code}
                    </span>
                    <span className="font-bold text-sm text-ink-primary">{rule.title}</span>
                  </div>
                  <span className="font-arabic text-lg font-bold text-primary">{rule.arabic}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {rule.description}
                </p>

                <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded-lg border border-hairline/60">
                  <span className="font-semibold text-slate-700">Contoh:</span> {rule.example}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-hairline flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Format Standar Quranic Corpus Project (Uni of Leeds)</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary hover:bg-primary-deep text-white text-xs font-semibold rounded-full shadow-soft transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
