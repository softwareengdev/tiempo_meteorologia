'use client';

import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'success' | 'select';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 5,
  medium: 12,
  success: [8, 30, 8],
  select: 3,
};

/**
 * Web Vibration API helper. Respects `prefers-reduced-motion`.
 * No-op on browsers without `navigator.vibrate` (most desktops, Safari iOS).
 */
export function useHaptic() {
  return useCallback((pattern: HapticPattern = 'light') => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
    if (!('vibrate' in navigator)) return;
    try {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;
      navigator.vibrate(PATTERNS[pattern]);
    } catch {
      // Silently ignore; vibrate may throw in iframes / restricted contexts.
    }
  }, []);
}
