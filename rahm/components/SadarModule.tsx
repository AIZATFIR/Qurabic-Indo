'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TRANSMUTATION_SPECTRUM,
  TransmutationMap,
  NAFS_STAGES,
  getNafsStage,
} from '../lib/spiritual-framework';
import { ArrowRight, Sparkles, BookOpen, Heart, Shield, RefreshCw } from 'lucide-react';

interface SadarModuleProps {
  className?: string;
  onSelectAyah?: (surah: number, ayah: number) => void;
}

export default function SadarModule({ className = '', onSelectAyah }: SadarModuleProps) {
  const [selectedId, setSelectedId] = useState<string>('cemas');
  const [selectedStageLevel, setSelectedStageLevel] = useState<number>(4);

  const activeTransmutation: TransmutationMap =
    TRANSMUTATION_SPECTRUM.find((t) => t.id === selectedId) || TRANSMUTATION_SPECTRUM[0];

  const activeStage = getNafsStage(selectedStageLevel);

  return (
    <div
      className={`rounded-3xl bg-canvas-surface/85 dark:bg-canvas-dark-surface/85 backdrop-blur-2xl border border-hairline shadow-hover p-6 sm:p-8 space-y-6 text-ink-primary ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
            <h2 className="text-lg font-bold text-ink-primary tracking-tight font-sans">
              Sadar (سَدَارْ) — Kalibrasi Kesadaran Nafs
            </h2>
          </div>
          <p className="text-xs text-ink-mute mt-1">
            Transmutasi getaran batin dari ilusi ego (Not-Self) menuju ketenangan hakiki (Sakīnah).
          </p>
        </div>

        {/* 7 Nafs Stage Selector Pill */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1">
          {NAFS_STAGES.map((stage) => {
            const isSelected = selectedStageLevel === stage.level;
            return (
              <button
                key={stage.level}
                onClick={() => setSelectedStageLevel(stage.level)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all duration-100 active:scale-95 border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-subtle'
                    : 'bg-canvas-soft text-ink-secondary border-hairline hover:bg-canvas-surface'
                }`}
                title={stage.transliteration}
              >
                Taraf {stage.level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Detail Banner */}
      <div className="rounded-2xl bg-canvas-soft/70 border border-hairline p-4 space-y-1.5 animate-in fade-in duration-200">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-xs text-primary uppercase tracking-wide">
            {activeStage.transliteration} • {activeStage.alchemicalStage}
          </span>
          <span className="font-arabic text-sm text-ink-primary">{activeStage.arabicName}</span>
        </div>
        <p className="text-xs text-ink-secondary leading-relaxed">{activeStage.description}</p>
        <div className="text-[11px] text-ink-mute pt-1 border-t border-hairline/60 flex items-center justify-between">
          <span>Inti Proses: {activeStage.coreProcess}</span>
          <span className="font-medium text-ink-primary">
            QS. {activeStage.quranicReference.surah}:{activeStage.quranicReference.ayah}
          </span>
        </div>
      </div>

      {/* State / Feeling Trigger Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-ink-secondary flex items-center justify-between">
          <span>Apa yang sedang dirasakan qalb saat ini?</span>
          <span className="text-[10px] text-ink-mute">Pilih untuk transmutasi</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TRANSMUTATION_SPECTRUM.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`p-3 rounded-2xl text-left border transition-all duration-100 active:scale-98 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-100 shadow-sm'
                    : 'bg-canvas-surface hover:bg-canvas-soft border-hairline text-ink-secondary'
                }`}
              >
                <span className="text-xs font-bold leading-tight truncate">{item.shadow.split(' (')[0]}</span>
                <span className="text-[10px] text-ink-mute mt-1 line-clamp-1">{item.shadowDesc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spectrum Transformation Card: Shadow -> Gift -> Siddhi */}
      <div className="rounded-2xl border border-hairline bg-gradient-to-br from-canvas-surface via-canvas-soft/40 to-canvas-surface p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Shadow (Not-Self) */}
          <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 space-y-1">
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              Bayangan (Ego Not-Self)
            </span>
            <div className="text-xs font-bold text-ink-primary">{activeTransmutation.shadow}</div>
            <p className="text-[11px] text-ink-secondary leading-snug">{activeTransmutation.shadowDesc}</p>
          </div>

          {/* 2. Gift (Hikmah) */}
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center">
              <RefreshCw className="w-3 h-3 mr-1" />
              Hikmah (Gift Penyadaran)
            </span>
            <div className="text-xs font-bold text-ink-primary">{activeTransmutation.gift}</div>
            <p className="text-[11px] text-ink-secondary leading-snug">{activeTransmutation.giftDesc}</p>
          </div>

          {/* 3. Siddhi (Nur Ilahi) */}
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Nur (Siddhi / Kesempurnaan)
            </span>
            <div className="text-xs font-bold text-ink-primary">{activeTransmutation.siddhi}</div>
            <p className="text-[11px] text-ink-secondary leading-snug">{activeTransmutation.siddhiDesc}</p>
          </div>
        </div>

        {/* Prescribed Asmaul Husna & Dhikr */}
        <div className="p-4 rounded-xl bg-canvas-surface border border-hairline flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
              Penawar Asmaul Husna (Penetralisir Ego)
            </span>
            <div className="font-arabic text-xl font-bold text-ink-primary tracking-wide">
              {activeTransmutation.asmaulHusna.arabic}
            </div>
            <div className="text-xs font-semibold text-ink-secondary">
              {activeTransmutation.asmaulHusna.transliteration} — {activeTransmutation.asmaulHusna.meaning}
            </div>
            <p className="text-[11px] text-ink-mute">{activeTransmutation.asmaulHusna.dhikrPrompt}</p>
          </div>
        </div>

        {/* Prescribed Quranic Ayah & Hadith */}
        <div className="space-y-2 pt-2 border-t border-hairline/70">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-primary flex items-center">
              <BookOpen className="w-3.5 h-3.5 text-primary mr-1.5" />
              Ayat Al-Qur'an Pengokoh Jiwa
            </span>
            <Link
              href={`/baca?surah=${activeTransmutation.quranicAyah.surah}&ayah=${activeTransmutation.quranicAyah.ayah}`}
              className="text-xs font-semibold text-primary hover:underline flex items-center"
            >
              <span>
                QS. {activeTransmutation.quranicAyah.surah}:{activeTransmutation.quranicAyah.ayah}
              </span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="p-3.5 rounded-xl bg-canvas-soft/60 border border-hairline space-y-2">
            <p className="font-arabic text-right text-lg text-ink-primary leading-loose">
              {activeTransmutation.quranicAyah.arabic}
            </p>
            <p className="text-xs text-ink-secondary italic leading-relaxed">
              "{activeTransmutation.quranicAyah.indo}"
            </p>
          </div>
          <div className="text-[11px] text-ink-mute bg-canvas-surface/80 p-3 rounded-xl border border-hairline flex items-start space-x-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{activeTransmutation.hadithGuide}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
