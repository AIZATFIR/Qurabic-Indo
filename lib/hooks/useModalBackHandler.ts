'use client';

import { useEffect, useRef, useCallback } from 'react';

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
    onCloseRef.current();
  }, []);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    initialPathnameRef.current = window.location.pathname;
    const modalKey = `__qurabic_${modalName}_${Date.now()}`;
    const currentState = window.history.state || {};

    try {
      window.history.pushState(
        { ...currentState, [modalKey]: true, __qurabic_modal_active: true },
        ''
      );
      isHistoryPushedRef.current = true;
    } catch {
      isHistoryPushedRef.current = false;
    }

    const handlePopState = () => {
      // User pressed mobile hardware back button or browser back
      if (isHistoryPushedRef.current) {
        isHistoryPushedRef.current = false;
        onCloseRef.current();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);

      // If closed by parent state change or unmount, pop the history state
      // but only if we are still on the exact same pathname (not navigated to new route)
      if (isHistoryPushedRef.current && window.location.pathname === initialPathnameRef.current) {
        isHistoryPushedRef.current = false;
        try {
          window.history.back();
        } catch {}
      }
    };
  }, [isOpen, modalName]);

  return { handleClose };
}
