'use client';

import { useCallback } from 'react';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

/**
 * Web Share API with graceful fallback to clipboard. Returns:
 *  - 'shared' if native share dialog completed
 *  - 'copied' if URL copied to clipboard
 *  - 'unsupported' if neither is available
 *  - 'cancelled' if user dismissed share dialog
 */
export function useShare() {
  return useCallback(async (data: ShareData): Promise<'shared' | 'copied' | 'unsupported' | 'cancelled'> => {
    if (typeof navigator === 'undefined') return 'unsupported';
    const payload: ShareData = {
      ...data,
      url: data.url ?? window.location.href,
    };
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(payload);
        return 'shared';
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return 'cancelled';
        // fall through to clipboard
      }
    }
    if (navigator.clipboard?.writeText && payload.url) {
      try {
        await navigator.clipboard.writeText(payload.url);
        return 'copied';
      } catch {
        return 'unsupported';
      }
    }
    return 'unsupported';
  }, []);
}
