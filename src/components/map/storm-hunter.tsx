'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useWeatherStore } from '@/lib/stores';
import { useHaptic } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * StormHunter — compact toggle that activates "storm-chaser" mode:
 * CAPE + wind gusts + precipitation layers all at once. Active state
 * is communicated by the gradient + the inline pulsing dot, no extra
 * banner needed (less map covered on mobile).
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
        'fixed top-[calc(3.5rem+env(safe-area-inset-top)+0.4rem)] right-3 z-30 flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium shadow-lg backdrop-blur-md backdrop-saturate-150 transition-colors md:top-[5rem] md:px-3 md:py-2 md:text-xs lg:right-[26.5rem]',
        active
          ? 'border-violet-400/60 bg-gradient-to-r from-indigo-500/40 to-violet-500/40 text-white shadow-[0_0_18px_rgba(139,92,246,0.45)]'
          : 'border-white/12 bg-[#0b1020]/70 text-white/75 hover:bg-[#0b1020]/90 hover:text-white',
      )}
    >
      <Zap className={cn('h-3.5 w-3.5', active && 'fill-yellow-300 text-yellow-300')} />
      <span className="hidden xs:inline sm:inline">Caza-tormentas</span>
      <span className="xs:hidden sm:hidden">Caza</span>
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
