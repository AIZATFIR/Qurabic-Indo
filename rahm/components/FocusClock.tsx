'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Wind, Bell, CheckCircle2, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface FocusClockProps {
  onSessionComplete?: (durationMinutes: number) => void;
  className?: string;
}

type BreathingPhase = 'Tarik Nafas (Inhale)' | 'Tahan (Hold)' | 'Hembuskan (Exhale)' | 'Hening (Stillness)';

export default function FocusClock({ onSessionComplete, className = '' }: FocusClockProps) {
  // Session durations in minutes: 3 (Istirahat Sejenak), 5 (Muraqabah Singkat), 15 (Tadabbur), 25 (Khusyu' Pomodoro)
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dhikrCount, setDhikrCount] = useState<number>(0);
  const [isBreathingMode, setIsBreathingMode] = useState<boolean>(true);
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('Tarik Nafas (Inhale)');
  const [breathingCycleSec, setBreathingCycleSec] = useState<number>(0);

  const totalSeconds = selectedMinutes * 60;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;

  // Audio Context for subtle Apple-like ambient bell and tick feedback
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSoftBell = useCallback((frequency = 528) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch {
      // AudioContext policy fallback
    }
  }, [soundEnabled]);

  // Timer Tick Interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playSoftBell(660);
            onSessionComplete?.(selectedMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, playSoftBell, onSessionComplete, selectedMinutes]);

  // Nafas Rohani (4-4-4-4 Cadence / Box Breathing)
  useEffect(() => {
    if (!isRunning || !isBreathingMode) return;
    const interval = setInterval(() => {
      setBreathingCycleSec((prev) => {
        const next = (prev + 1) % 16;
        if (next < 4) {
          setBreathingPhase('Tarik Nafas (Inhale)');
        } else if (next < 8) {
          setBreathingPhase('Tahan (Hold)');
        } else if (next < 12) {
          setBreathingPhase('Hembuskan (Exhale)');
        } else {
          setBreathingPhase('Hening (Stillness)');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBreathingMode]);

  const handleSelectMinutes = (mins: number) => {
    setSelectedMinutes(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
    setDhikrCount(0);
  };

  const handleTogglePlay = () => {
    if (!isRunning) {
      playSoftBell(432);
    }
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
    setDhikrCount(0);
    setBreathingCycleSec(0);
  };

  const handleManualDhikrTap = () => {
    setDhikrCount((prev) => prev + 1);
    playSoftBell(880);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Apple Dial Dimensions
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-canvas-surface/80 dark:bg-canvas-dark-surface/80 backdrop-blur-2xl border border-hairline shadow-hover p-6 sm:p-8 flex flex-col items-center select-none text-ink-primary ${className}`}
    >
      {/* Top Controls: Sound & Breathing Mode */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
            Muraqabah Clock
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsBreathingMode((prev) => !prev)}
            className={`p-2 rounded-xl text-xs font-medium transition-transform duration-100 active:scale-95 border ${
              isBreathingMode
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-canvas-soft text-ink-mute border-hairline'
            }`}
            title="Panduan Nafas Rohani (Box Breathing)"
          >
            <Wind className="w-4 h-4" />
          </button>
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2 rounded-xl text-xs font-medium transition-transform duration-100 active:scale-95 border ${
              soundEnabled
                ? 'bg-primary-subdued text-primary border-primary/30'
                : 'bg-canvas-soft text-ink-mute border-hairline'
            }`}
            title="Lonceng Keheningan"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center Apple-Style Circular Progress Ring */}
      <div className="relative my-4 flex items-center justify-center">
        <svg className="w-64 h-64 -rotate-90 transform">
          {/* Track Circle */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="text-canvas-soft dark:text-hairline-dark stroke-current"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated Progress Ring */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="text-primary transition-all duration-500 ease-out stroke-current stroke-round"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Content & Breathing Scale Indicator */}
        <div
          className={`absolute flex flex-col items-center justify-center text-center transition-transform duration-1000 ease-in-out ${
            isRunning && isBreathingMode
              ? breathingPhase.includes('Inhale')
                ? 'scale-110'
                : breathingPhase.includes('Exhale')
                ? 'scale-95'
                : 'scale-100'
              : 'scale-100'
          }`}
        >
          <span className="font-mono text-5xl font-bold tracking-tight text-ink-primary">
            {formatTime(timeLeft)}
          </span>
          {isRunning && isBreathingMode ? (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2 animate-fade-in">
              {breathingPhase}
            </span>
          ) : (
            <span className="text-xs font-medium text-ink-mute mt-2">
              {timeLeft === 0 ? 'Sesi Selesai' : `${selectedMinutes} Menit Keheningan`}
            </span>
          )}
        </div>
      </div>

      {/* Preset Duration Buttons */}
      <div className="flex items-center space-x-2 my-2">
        {[3, 5, 15, 25, 45].map((mins) => {
          const isSelected = selectedMinutes === mins;
          return (
            <button
              key={mins}
              onClick={() => handleSelectMinutes(mins)}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-100 active:scale-95 border ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-subtle'
                  : 'bg-canvas-soft text-ink-secondary border-hairline hover:bg-canvas-surface disabled:opacity-50'
              }`}
            >
              {mins}m
            </button>
          );
        })}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex items-center space-x-3 mt-4">
        <button
          onClick={handleReset}
          className="p-3 rounded-2xl bg-canvas-soft hover:bg-hairline text-ink-secondary transition-transform duration-100 active:scale-95 border border-hairline"
          title="Reset Waktu"
          aria-label="Reset Waktu"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleTogglePlay}
          className={`px-8 py-3.5 rounded-2xl text-white font-semibold flex items-center space-x-2 transition-transform duration-100 active:scale-95 shadow-hover ${
            isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary-deep'
          }`}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          <span>{isRunning ? 'Jeda' : timeLeft === 0 ? 'Mulai Ulang' : 'Mulai Khusyu’'}</span>
        </button>

        {/* Tactile Dhikr Tap Pad */}
        <button
          onClick={handleManualDhikrTap}
          className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-transform duration-100 active:scale-90 flex items-center justify-center font-bold text-xs"
          title="Hitung Dzikir (Tap)"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          <span>{dhikrCount}</span>
        </button>
      </div>
    </div>
  );
}
