'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useWeatherStore } from '@/lib/stores';
import { useHaptic } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * StormHunter — compact map overlay button. Renders as `absolute` so the
 * parent (`WeatherMap`) controls its placement; this keeps the three top
 * map controls (legend, location, storm-hunter) perfectly aligned.
 */
export function StormHunter() {
  const active = useWeatherStore((s) => s.stormHunter);
  const toggle = useWeatherStore((s) => s.toggleStormHunter);
  const haptic = useHaptic();

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={() => { haptic(active ? 'light' : 'success'); toggle(); }}
      aria-pressed={active}
      aria-label={active ? 'Desactivar modo Caza-tormentas' : 'Activar modo Caza-tormentas'}
      title="Modo Caza-tormentas (CAPE + rachas + precipitación)"
      className={cn(
        'pointer-events-auto flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold shadow-lg backdrop-blur-md backdrop-saturate-150 transition-colors',
        active
          ? 'border-violet-400/60 bg-gradient-to-r from-indigo-500/45 to-violet-500/45 text-white shadow-[0_0_18px_rgba(139,92,246,0.45)]'
          : 'border-white/15 bg-[#0b1020]/70 text-white/80 hover:bg-[#0b1020]/90 hover:text-white',
      )}
    >
      <Zap className={cn('h-3.5 w-3.5', active && 'fill-yellow-300 text-yellow-300')} />
      <span>Caza</span>
      {active && (
        <span
          className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-yellow-300"
          style={{ animation: 'wi-flash 1.4s ease-in-out infinite' }}
          aria-hidden
        />
      )}
    </motion.button>
  );
}
