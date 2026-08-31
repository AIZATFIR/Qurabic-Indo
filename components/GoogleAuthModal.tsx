'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, User, Bookmark } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { isFirebaseConfigured } from '@/lib/firebase';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleAuthModal({ isOpen, onClose }: GoogleAuthModalProps) {
  const { loginWithGoogle, loginWithCustomName } = useAuth();
  const [customName, setCustomName] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCustomName(customName || 'Pengguna Qurabic');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Auth Modal Box */}
      <div className="relative w-full max-w-md bg-canvas-surface border border-hairline rounded-3xl shadow-2xl overflow-hidden z-10 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-subdued text-primary flex items-center justify-center font-bold">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-ink-primary text-base font-sans flex items-center space-x-2">
                <span>Profil Belajar Qurabic</span>
              </h3>
              <p className="text-xs text-ink-mute font-sans">
                Simpan kata &amp; riwayat belajar Al-Qur&apos;an
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Custom Name Login Form */}
        <div className="space-y-4 pt-1">
          <form onSubmit={handleCustomLogin} className="space-y-3">
            <label className="block text-xs font-semibold text-ink-secondary font-sans">
              Nama Profil Anda:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-ink-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Contoh: Ahmad, Sarah..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-hairline bg-canvas-soft text-sm text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-subtle font-sans"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-deep text-white py-3.5 rounded-2xl font-semibold text-xs shadow-subtle transition-all font-sans"
            >
              Mulai Belajar Sekarang
            </button>
          </form>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-hairline" />
            <span className="px-3 text-xs text-ink-mute font-sans">atau Masuk dengan Google</span>
            <div className="flex-1 border-t border-hairline" />
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center space-x-3 bg-canvas-surface hover:bg-canvas-soft border border-hairline text-ink-primary py-3.5 px-4 rounded-2xl font-semibold text-sm shadow-subtle hover:shadow-soft transition-all disabled:opacity-50 font-sans"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isLoggingIn ? 'Menghubungkan...' : 'Lanjutkan dengan Google'}</span>
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-ink-mute font-sans flex items-center justify-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Data tersimpan dengan aman pada peramban Anda.</span>
        </div>

      </div>
    </div>
  );
}
