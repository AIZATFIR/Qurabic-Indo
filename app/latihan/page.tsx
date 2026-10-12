'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Award,
  Layers,
  Compass,
  ArrowLeft,
  Flame,
  Check,
  RotateCw
} from 'lucide-react';
import WordEtymologyModal from '@/components/WordEtymologyModal';
import { QUIZ_BANK, FLASHCARD_BANK, QuizQuestion, MorphologyFlashcard } from '@/lib/data/latihan-bank';

export default function LatihanPage() {
  const [activeTab, setActiveTab] = useState<'kuis' | 'flashcard'>('kuis');
  const [selectedCategory, setSelectedCategory] = useState<'semua' | 'akar' | 'sharaf' | 'kosakata' | 'balaghah'>('semua');
  
  // Quiz states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Flashcard states
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  // Modal
  const [modalWord, setModalWord] = useState<string | null>(null);

  const filteredQuestions = selectedCategory === 'semua'
    ? QUIZ_BANK
    : QUIZ_BANK.filter(q => q.category === selectedCategory);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];
  const currentFlashcard = FLASHCARD_BANK[flashcardIndex] || FLASHCARD_BANK[0];

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isSubmitted) return;
    setIsSubmitted(true);
    if (selectedAnswer === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setIsSubmitted(false);
    setIsFinished(false);
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    if (flashcardIndex < FLASHCARD_BANK.length - 1) {
      setFlashcardIndex(prev => prev + 1);
    } else {
      setFlashcardIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm text-ink-mute hover:text-primary transition-colors font-medium font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          Modul Latihan Interaktif
        </span>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-4 bg-canvas-surface border border-hairline p-6 sm:p-8 rounded-3xl shadow-subtle">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-subtle">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary font-sans">
          Latihan &amp; Hafalan Morfologi Al-Qur&apos;an
        </h1>
        <p className="text-xs sm:text-sm text-ink-mute max-w-xl mx-auto font-sans leading-relaxed">
          Uji pemahaman Anda tentang akar kata (جَذْر), wazan Sharaf, dan bedah Balaghah Al-Qur&apos;an secara interaktif.
        </p>

        {/* Dual Mode Switcher: Kuis Pilihan Ganda vs Kartu Hafalan */}
        <div className="flex items-center justify-center p-1 bg-canvas-soft border border-hairline rounded-full max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('kuis')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-2 font-sans ${
              activeTab === 'kuis'
                ? 'bg-primary text-white shadow-subtle'
                : 'text-ink-secondary hover:text-primary'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Kuis Morfologi Interaktif</span>
          </button>
          <button
            onClick={() => setActiveTab('flashcard')}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center space-x-2 font-sans ${
              activeTab === 'flashcard'
                ? 'bg-primary text-white shadow-subtle'
                : 'text-ink-secondary hover:text-primary'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kartu Hafalan (Flashcards)</span>
          </button>
        </div>

        {/* Category Filter Pills (For Quiz Mode) */}
        {activeTab === 'kuis' && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {[
              { id: 'semua', label: 'Semua Soal' },
              { id: 'akar', label: 'Akar Kata (جَذْر)' },
              { id: 'sharaf', label: 'Wazan & Sharaf' },
              { id: 'balaghah', label: 'Bedah Balaghah' },
              { id: 'kosakata', label: 'Makna Kosakata' }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCategory(c.id as any);
                  handleRestartQuiz();
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border font-sans ${
                  selectedCategory === c.id
                    ? 'bg-primary text-white border-primary shadow-subtle'
                    : 'bg-canvas-soft border-hairline text-ink-secondary hover:border-primary/40'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: KUIS MORFOLOGI INTERAKTIF                                         */}
      {/* ========================================================================= */}
      {activeTab === 'kuis' && (
        !isFinished ? (
          <div className="bg-canvas-surface border border-hairline rounded-3xl p-6 sm:p-8 space-y-6 shadow-subtle">
            {/* Progress & Live Score Bar */}
            <div className="flex items-center justify-between border-b border-hairline pb-4 text-xs font-semibold font-sans">
              <span className="text-ink-mute">
                Soal <strong className="text-primary font-bold">{currentIndex + 1}</strong> dari {filteredQuestions.length}
              </span>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                  <Trophy className="w-4 h-4" />
                  <span>Skor: {score}</span>
                </span>
                <span className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>Streak: {streak}</span>
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="space-y-4 text-center py-2">
              <span className="text-xs font-mono text-ink-mute px-2.5 py-0.5 rounded-full bg-canvas-soft border border-hairline">
                Konteks: {currentQuestion.verseRef}
              </span>

              {/* Arabic Word Display */}
              <div className="py-2" dir="rtl">
                <span className="font-arabic text-5xl sm:text-6xl font-bold text-primary block leading-[1.8]">
                  {currentQuestion.arabicWord}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-ink-mute">
                — {currentQuestion.transliteration} —
              </p>

              <h3 className="text-base sm:text-lg font-bold text-ink-primary font-sans pt-2">
                {currentQuestion.questionText}
              </h3>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;
                let styleClass = 'bg-canvas-soft border-hairline text-ink-primary hover:border-primary/40';

                if (isSubmitted) {
                  if (isCorrect) {
                    styleClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-300 font-bold';
                  } else if (isSelected) {
                    styleClass = 'bg-rose-500/10 border-rose-500/50 text-rose-700 dark:text-rose-300 font-bold';
                  } else {
                    styleClass = 'bg-canvas-soft/40 border-hairline text-ink-mute opacity-60';
                  }
                } else if (isSelected) {
                  styleClass = 'bg-primary/10 border-primary text-primary font-bold shadow-subtle';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-200 flex items-center justify-between font-sans ${styleClass}`}
                  >
                    <span>{opt}</span>
                    {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {/* Submit / Next Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-hairline">
              {currentQuestion.rootSlug && (
                <button
                  onClick={() => setModalWord(currentQuestion.arabicWord)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Lihat Bedah Kata</span>
                </button>
              )}

              {!isSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all ml-auto ${
                    selectedAnswer !== null
                      ? 'bg-primary text-white shadow-subtle hover:bg-primary-deep'
                      : 'bg-canvas-soft text-ink-mute cursor-not-allowed'
                  }`}
                >
                  Jawab Soal
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-semibold shadow-subtle hover:bg-primary-deep transition-all ml-auto flex items-center space-x-1.5"
                >
                  <span>{currentIndex < filteredQuestions.length - 1 ? 'Soal Selanjutnya' : 'Lihat Hasil Akhir'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Explanation Box */}
            {isSubmitted && (
              <div className="p-4 sm:p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2 animate-fade-in">
                <span className="text-xs font-bold text-primary uppercase block tracking-wider font-sans">
                  Penjelasan Pembahasan:
                </span>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Finished View */
          <div className="bg-canvas-surface border border-hairline rounded-3xl p-8 text-center space-y-6 shadow-subtle animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-subtle">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-ink-primary font-sans">
                Selamat! Latihan Selesai
              </h2>
              <p className="text-sm text-ink-mute font-sans">
                Anda telah menyelesaikan seluruh {filteredQuestions.length} pertanyaan kuis morfologi.
              </p>
            </div>

            <div className="p-6 bg-canvas-soft border border-hairline rounded-2xl max-w-sm mx-auto space-y-2">
              <span className="text-xs text-ink-mute uppercase font-semibold font-sans">Total Skor Akhir:</span>
              <div className="text-4xl font-bold text-primary font-sans">
                {score} Poin
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={handleRestartQuiz}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-xs sm:text-sm font-semibold shadow-subtle hover:bg-primary-deep transition-all flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Latihan Lagi</span>
              </button>
              <Link
                href="/baca"
                className="px-6 py-2.5 rounded-full bg-canvas-soft border border-hairline text-ink-primary hover:text-primary text-xs sm:text-sm font-semibold transition-all"
              >
                Lanjut Baca Al-Qur&apos;an
              </Link>
            </div>
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* MODE 2: KARTU HAFALAN (FLASHCARDS)                                         */}
      {/* ========================================================================= */}
      {activeTab === 'flashcard' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-mute font-sans">
            <span>Kartu {flashcardIndex + 1} dari {FLASHCARD_BANK.length}</span>
            <span>Berhasil Dihafal: <strong className="text-primary font-bold">{learnedCount}</strong> Kartu</span>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer bg-canvas-surface border border-hairline hover:border-primary/40 rounded-3xl p-8 min-h-[340px] flex flex-col items-center justify-center text-center shadow-subtle transition-all duration-300 relative group"
          >
            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center space-x-1">
              <RotateCw className="w-3 h-3" />
              <span>Klik Kartu untuk Membalik</span>
            </span>

            {!isFlipped ? (
              /* FRONT OF CARD */
              <div className="space-y-4 my-auto">
                <span className="text-xs font-mono font-bold text-ink-mute px-3 py-1 rounded-full bg-canvas-soft border border-hairline">
                  {currentFlashcard.wazanForm}
                </span>
                <div className="py-2" dir="rtl">
                  <span className="font-arabic text-6xl font-bold text-primary block leading-[1.8]">
                    {currentFlashcard.arabicWord}
                  </span>
                </div>
                <p className="text-sm font-mono text-ink-mute">
                  — {currentFlashcard.transliteration} —
                </p>
                <p className="text-xs text-primary font-semibold pt-2 font-sans">
                  Tap / Klik untuk melihat akar kata, fa&apos;idah Sharaf &amp; makna Al-Qur&apos;an &rarr;
                </p>
              </div>
            ) : (
              /* BACK OF CARD */
              <div className="space-y-4 my-auto max-w-lg">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    Akar Kata: {currentFlashcard.rootArabic} ({currentFlashcard.rootSlug})
                  </span>
                </div>

                <h3 className="text-xl font-bold text-ink-primary font-sans">
                  &ldquo;{currentFlashcard.meaningIndo}&rdquo;
                </h3>

                <p className="text-xs text-ink-secondary leading-relaxed bg-canvas-soft p-4 rounded-2xl border border-hairline font-sans text-left">
                  <strong className="text-primary font-semibold">Fa&apos;idah Sharaf: </strong>
                  {currentFlashcard.faedahSharaf}
                </p>

                <div className="p-3 bg-canvas-soft border border-hairline rounded-xl text-left text-xs space-y-1 font-sans">
                  <span className="text-[10px] text-ink-mute font-bold uppercase">Konteks Ayat ({currentFlashcard.verseContext.verseRef}):</span>
                  <p className="font-arabic text-base font-bold text-ink-primary" dir="rtl">
                    {currentFlashcard.verseContext.textArabic}
                  </p>
                  <p className="text-[11px] text-ink-mute italic">
                    &ldquo;{currentFlashcard.verseContext.translationIndo}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Flashcard Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setLearnedCount(prev => prev + 1);
                handleNextFlashcard();
              }}
              className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Sudah Hafal</span>
            </button>

            <button
              onClick={handleNextFlashcard}
              className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-deep text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all flex items-center space-x-1.5"
            >
              <span>Kartu Selanjutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bedah Kata Modal integration */}
      {modalWord && (
        <WordEtymologyModal
          isOpen={!!modalWord}
          onClose={() => setModalWord(null)}
          wordArabic={modalWord}
        />
      )}
    </div>
  );
}
