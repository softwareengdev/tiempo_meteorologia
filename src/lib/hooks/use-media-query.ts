'use client';

import { useEffect, useState } from 'react';

/**
 * useMediaQuery — Reactive matchMedia hook with SSR-safe initial value.
 * @param query CSS media query, e.g. '(min-width: 1024px)'
 * @param defaultValue Returned during SSR / pre-mount. Default false.
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mq.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
