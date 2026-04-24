'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun } from 'lucide-react';
import { useWeatherStore } from '@/lib/stores';
import { useHaptic } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Mounts a side-effect that toggles `data-outdoor` on <html> and exposes a
 * compact toggle button. CSS in globals.css listens to that attribute to scale
 * typography +18% and bump contrast (high-readability outdoor mode).
 */
export function OutdoorMode() {
  const enabled = useWeatherStore((s) => s.outdoorMode);
  const toggle = useWeatherStore((s) => s.toggleOutdoorMode);
  const haptic = useHaptic();

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) root.setAttribute('data-outdoor', '1');
    else root.removeAttribute('data-outdoor');
  }, [enabled]);

  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={() => { haptic('medium'); toggle(); }}
      aria-pressed={enabled}
      aria-label={enabled ? 'Desactivar modo exterior (alta legibilidad)' : 'Activar modo exterior (alta legibilidad)'}
      title="Modo exterior — alta legibilidad bajo el sol"
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-lg transition-colors',
        enabled
          ? 'bg-amber-400/20 text-amber-300 shadow-[0_0_20px_-4px_rgba(251,191,36,0.5)]'
          : 'text-white/55 hover:bg-white/10 hover:text-white',
      )}
    >
      <Sun className={cn('h-4 w-4 transition-transform', enabled && 'scale-110')} />
    </motion.button>
  );
}
