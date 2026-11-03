'use client';

import { useEffect, useRef, useCallback } from 'react';
import { showRespectfulInterstitial } from '@/lib/ads/admob';

export interface UseModalBackHandlerOptions {
  modalName?: string;
}

/**
 * useModalBackHandler
 * 
 * Intercepts mobile device back buttons / browser back actions when a modal is open.
 * Prevents mobile back navigation from dumping the user back to home or previous page,
 * ensuring back action dismisses the modal gracefully.
 */
export function useModalBackHandler(
  isOpen: boolean,
  onClose: () => void,
  options?: UseModalBackHandlerOptions
) {
  const modalName = options?.modalName || 'modal';
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const isHistoryPushedRef = useRef(false);
  const initialPathnameRef = useRef<string>('');
  const historyKeyRef = useRef<string>('');
  const effectGenerationRef = useRef(0);

  const triggerRespectfulAdIfAllowed = useCallback(() => {
    const isReadingModal = ['word_study', 'grammar_legend', 'surah_search'].includes(modalName);
    if (!isReadingModal) {
      showRespectfulInterstitial('modal_back').catch(() => {});
    }
  }, [modalName]);

  // Primary close function to be called by UI elements (X button, backdrop, ESC key)
  const handleClose = useCallback(() => {
    if (isHistoryPushedRef.current) {
      isHistoryPushedRef.current = false;
      try {
        if (typeof window !== 'undefined') {
          window.history.back();
        }
      } catch {}
    }
    triggerRespectfulAdIfAllowed();
    onCloseRef.current();
  }, [triggerRespectfulAdIfAllowed]);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const generation = ++effectGenerationRef.current;
    initialPathnameRef.current = window.location.pathname;
    const modalKey = historyKeyRef.current || `__qurabic_${modalName}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    historyKeyRef.current = modalKey;
    const currentState = window.history.state || {};

    try {
      // StrictMode replays this effect; reuse the entry owned by this mounted modal.
      if (!currentState[modalKey]) {
        window.history.pushState(
          { ...currentState, [modalKey]: true, __qurabic_modal_active: true, __qurabic_modal_top: modalKey },
          ''
        );
      }
      isHistoryPushedRef.current = true;
    } catch {
      isHistoryPushedRef.current = false;
    }

    const handlePopState = (event: PopStateEvent) => {
      // User pressed mobile hardware back button or browser back
      if (isHistoryPushedRef.current && !event.state?.[modalKey]) {
        isHistoryPushedRef.current = false;
        triggerRespectfulAdIfAllowed();
        onCloseRef.current();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // Cleanup is also replayed by StrictMode. Defer traversal so a synchronous
      // remount can cancel it before an asynchronous popstate closes the new modal.
      queueMicrotask(() => {
        if (effectGenerationRef.current !== generation) return;
        if (isHistoryPushedRef.current &&
            window.location.pathname === initialPathnameRef.current &&
            window.history.state?.__qurabic_modal_top === modalKey) {
          isHistoryPushedRef.current = false;
          try { window.history.back(); } catch {}
        }
      });
    };
  }, [isOpen, modalName, triggerRespectfulAdIfAllowed]);

  return { handleClose };
}
