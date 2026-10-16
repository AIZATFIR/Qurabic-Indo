'use client';

import React, { useState } from 'react';
import { Layers, Volume2, ArrowRight, BookOpen, CheckCircle2, HelpCircle } from 'lucide-react';
import { getSharafParadigms, SharafForm } from '@/lib/morphology/sharaf-paradigms';

export type { SharafForm };

interface SharafParadigmVisualizerProps {
  rootSlug?: string;
  rootArabic?: string;
  customForms?: SharafForm[];
}

export default function SharafParadigmVisualizer({ rootSlug, rootArabic, customForms }: SharafParadigmVisualizerProps) {
  const forms = customForms || getSharafParadigms(rootSlug, rootArabic);
  const [selectedFormIdx, setSelectedFormIdx] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const activeForm = forms[selectedFormIdx] || forms[0];

  const handlePlayAudio = (arabicText: string) => {
    setPlayingAudio(arabicText);
    setTimeout(() => setPlayingAudio(null), 1200);
  };

  return (
    <div className="bg-canvas-surface border border-hairline rounded-3xl p-5 sm:p-7 space-y-6 shadow-subtle font-sans">
      {/* Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center space-x-1.5 font-sans">
            <Layers className="w-3.5 h-3.5" />
            <span>Matriks Tasrif &amp; Wazan Sharaf</span>
          </span>
          <h3 className="text-lg font-bold text-ink-primary font-sans mt-0.5">
            Konjugasi Derivasi Wazan ({rootArabic || rootSlug || 'Akar Kata'})
          </h3>
        </div>
        
        {/* Form Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {forms.map((f, idx) => (
            <button
              key={f.formId}
              onClick={() => setSelectedFormIdx(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold font-sans whitespace-nowrap transition-all border ${
                selectedFormIdx === idx
                  ? 'bg-primary text-white border-primary shadow-subtle'
                  : 'bg-canvas-soft border-hairline text-ink-secondary hover:border-primary/40'
              }`}
            >
              {f.formId}
            </button>
          ))}
        </div>
      </div>

      {/* Active Form Detail Card */}
      <div className="space-y-5">
        {/* Header Badge & Faedah Sharaf */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              {activeForm.formName}
            </span>
            <span className="text-xs font-mono font-semibold text-ink-mute">
              Pola: {activeForm.wazanPattern}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-primary font-medium">
            <strong className="text-primary font-semibold">Fa&apos;idah Sharaf: </strong>
            {activeForm.faedahSharaf}
          </p>
          <p className="text-xs text-ink-mute font-sans">
            {activeForm.explanation}
          </p>
        </div>

        {/* Declension Grid: Madhi, Mudhari, Amr, Masdar, Isim Fail, Isim Maful */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Fi'il Madhi */}
          {activeForm.madhi && (
            <div className="p-3.5 bg-canvas-soft border border-hairline rounded-2xl text-center space-y-1 hover:border-primary/30 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mute block font-sans">
                Fi&apos;il Madhi (Lampau)
              </span>
              <div className="font-arabic text-2xl font-bold text-primary" dir="rtl">
                {activeForm.madhi.arabic}
              </div>
              <div className="text-xs font-semibold text-ink-primary font-sans">
                {activeForm.madhi.translit}
              </div>
              <div className="text-[11px] text-ink-mute leading-tight font-sans">
                {activeForm.madhi.meaning}
              </div>
            </div>
          )}

          {/* 2. Fi'il Mudhari */}
          {activeForm.mudhari && (
            <div className="p-3.5 bg-canvas-soft border border-hairline rounded-2xl text-center space-y-1 hover:border-primary/30 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mute block font-sans">
                Mudhari&apos; (Sekarang/Akan)
              </span>
              <div className="font-arabic text-2xl font-bold text-primary" dir="rtl">
                {activeForm.mudhari.arabic}
              </div>
              <div className="text-xs font-semibold text-ink-primary font-sans">
                {activeForm.mudhari.translit}
              </div>
              <div className="text-[11px] text-ink-mute leading-tight font-sans">
                {activeForm.mudhari.meaning}
              </div>
            </div>
          )}

          {/* 3. Fi'il Amr */}
          {activeForm.amr && (
            <div className="p-3.5 bg-canvas-soft border border-hairline rounded-2xl text-center space-y-1 hover:border-primary/30 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mute block font-sans">
                Fi&apos;il Amr (Perintah)
              </span>
              <div className="font-arabic text-2xl font-bold text-primary" dir="rtl">
                {activeForm.amr.arabic}
              </div>
              <div className="text-xs font-semibold text-ink-primary font-sans">
                {activeForm.amr.translit}
              </div>
              <div className="text-[11px] text-ink-mute leading-tight font-sans">
                {activeForm.amr.meaning}
              </div>
            </div>
          )}

          {/* 4. Masdar */}
          {activeForm.masdar && (
            <div className="p-3.5 bg-canvas-soft border border-hairline rounded-2xl text-center space-y-1 hover:border-primary/30 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mute block font-sans">
                Masdar (Kata Benda)
              </span>
              <div className="font-arabic text-2xl font-bold text-primary" dir="rtl">
                {activeForm.masdar.arabic}
              </div>
              <div className="text-xs font-semibold text-ink-primary font-sans">
                {activeForm.masdar.translit}
              </div>
              <div className="text-[11px] text-ink-mute leading-tight font-sans">
                {activeForm.masdar.meaning}
              </div>
            </div>
          )}

          {/* 5. Isim Fa'il */}
          {activeForm.isimFail && (
            <div className="p-3.5 bg-canvas-soft border border-hairline rounded-2xl text-center space-y-1 hover:border-primary/30 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mute block font-sans">
                Isim Fa&apos;il (Pelaku)
              </span>
              <div className="font-arabic text-2xl font-bold text-primary" dir="rtl">
                {activeForm.isimFail.arabic}
              </div>
              <div className="text-xs font-semibold text-ink-primary font-sans">
                {activeForm.isimFail.translit}
              </div>
              <div className="text-[11px] text-ink-mute leading-tight font-sans">
                {activeForm.isimFail.meaning}
              </div>
            </div>
          )}

          {/* 6. Isim Maf'ul */}
          {activeForm.isimMaful && (
            <div className="p-3.5 bg-canvas-soft border border-hairline rounded-2xl text-center space-y-1 hover:border-primary/30 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink-mute block font-sans">
                Isim Maf&apos;ul (Objek)
              </span>
              <div className="font-arabic text-2xl font-bold text-primary" dir="rtl">
                {activeForm.isimMaful.arabic}
              </div>
              <div className="text-xs font-semibold text-ink-primary font-sans">
                {activeForm.isimMaful.translit}
              </div>
              <div className="text-[11px] text-ink-mute leading-tight font-sans">
                {activeForm.isimMaful.meaning}
              </div>
            </div>
          )}
        </div>

        {/* Real Quranic Verse Example */}
        {activeForm.quranicExample && (
          <div className="p-4 bg-canvas-soft border border-hairline rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md font-sans">
                  Contoh Penggunaan Al-Qur&apos;an ({activeForm.quranicExample.verseRef})
                </span>
              </div>
              <p className="font-arabic text-xl font-bold text-ink-primary" dir="rtl">
                {activeForm.quranicExample.arabic}
              </p>
              <p className="text-xs text-ink-mute italic font-sans">
                &ldquo;{activeForm.quranicExample.indo}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
