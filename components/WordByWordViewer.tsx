'use client';

import React, { useState } from 'react';
import { WordSegment } from '@/lib/types/morphology';
import GrammarBadge from './GrammarBadge';
import { Volume2 } from 'lucide-react';
import WordEtymologyModal from './WordEtymologyModal';

interface WordByWordViewerProps {
  segments: WordSegment[];
}

export default function WordByWordViewer({ segments }: WordByWordViewerProps) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordSegment | null>(null);

  if (!segments || segments.length === 0) return null;

  const handlePlayAudio = (e: React.MouseEvent, index: number, location?: string) => {
    e.stopPropagation();
    try {
      setPlayingIndex(index);
      
      let audioUrl = `https://audio.qurancdn.com/wbw/002_153_00${(index % 9) + 1}.mp3`;
      if (location) {
        const parts = location.split(':');
        if (parts.length === 3) {
          const surahPad = parts[0].padStart(3, '0');
          const ayahPad = parts[1].padStart(3, '0');
          const wordPad = parts[2].padStart(3, '0');
          audioUrl = `https://audio.qurancdn.com/wbw/${surahPad}_${ayahPad}_${wordPad}.mp3`;
        }
      }

      const audio = new Audio(audioUrl);
      audio.play().catch(() => {
        console.warn('Audio playback not supported for location:', location);
      });

      audio.onended = () => setPlayingIndex(null);
    } catch (e) {
      console.error(e);
      setPlayingIndex(null);
    }
  };

  return (
    <>
      <div className="mt-4 pt-4 border-t border-hairline">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-primary flex items-center space-x-1.5 font-sans">
            <span>Analisis Morfologi Per Kata</span>
          </span>
          <span className="text-[11px] font-sans text-primary bg-primary-subdued px-2.5 py-0.5 rounded-full font-semibold">
            Klik kata untuk Bedah Akar Kata
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {segments.map((seg, idx) => {
            const isPlaying = playingIndex === idx;

            return (
              <div
                key={seg.wordIndex || idx}
                onClick={() => setSelectedWord(seg)}
                className="p-3.5 bg-canvas-soft border border-hairline rounded-2xl hover:border-primary/40 hover:shadow-subtle transition-all duration-200 flex flex-col justify-between text-center relative group cursor-pointer active:scale-95"
                title="Klik untuk Bedah Akar Kata"
              >
                {/* Play Audio Button */}
                <button
                  onClick={(e) => handlePlayAudio(e, idx, seg.wordLocation)}
                  title="Dengarkan pengucapan kata"
                  className={`absolute top-2 left-2 p-1.5 rounded-full transition-all ${
                    isPlaying
                      ? 'bg-primary text-white scale-110 shadow-subtle animate-pulse'
                      : 'text-ink-mute hover:text-primary hover:bg-canvas-surface border border-transparent hover:border-hairline'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {/* Arabic Word */}
                <div className="font-arabic text-2xl font-bold text-ink-primary mb-1 pt-1 group-hover:text-primary transition-colors" dir="rtl">
                  {seg.arabic}
                </div>

                {/* Transliteration */}
                <div className="text-xs font-sans font-medium text-ink-secondary italic mb-1.5">
                  {seg.transliteration}
                </div>

                {/* POS Tag Badge */}
                <div className="mb-2 flex justify-center">
                  <GrammarBadge posTagCode={seg.posTagCode} posTag={seg.posTag} />
                </div>

                {/* Indonesian Meaning */}
                <div className="text-xs font-sans text-ink-primary font-medium border-t border-hairline pt-1.5 mt-auto">
                  {seg.meaningIndo}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bedah Akar Kata Popover Drawer Modal */}
      {selectedWord && (
        <WordEtymologyModal
          isOpen={!!selectedWord}
          onClose={() => setSelectedWord(null)}
          wordArabic={selectedWord.arabic}
          transliteration={selectedWord.transliteration}
          meaningIndo={selectedWord.meaningIndo}
          posTag={selectedWord.posTag}
        />
      )}
    </>
  );
}
