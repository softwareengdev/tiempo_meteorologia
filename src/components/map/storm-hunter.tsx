'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useWeatherStore } from '@/lib/stores';
import { useHaptic } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * StormHunter — Botón flotante que activa modo "caza-tormentas".
 * Cuando se enciende:
 * - Activa capas CAPE + wind_gusts + precipitation en el mapa.
 * - Pulsa la UI con borde indigo→violet.
 * - Banner informativo arriba del mapa.
 */
export function StormHunter() {
  const active = useWeatherStore((s) => s.stormHunter);
  const toggle = useWeatherStore((s) => s.toggleStormHunter);
  const haptic = useHaptic();

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => { haptic(active ? 'light' : 'success'); toggle(); }}
        aria-pressed={active}
        aria-label={active ? 'Desactivar modo Caza-tormentas' : 'Activar modo Caza-tormentas'}
        title="Modo Caza-tormentas (CAPE + rachas + precipitación)"
        className={cn(
          'absolute top-20 right-4 z-20 flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-md transition-colors lg:top-4 lg:right-[26rem]',
          active
            ? 'border-violet-400/60 bg-gradient-to-r from-indigo-500/30 to-violet-500/30 text-white shadow-[0_0_20px_rgba(139,92,246,0.45)]'
            : 'border-white/10 bg-[#0b1020]/70 text-white/70 hover:bg-[#0b1020]/90 hover:text-white',
        )}
      >
        <Zap className={cn('h-3.5 w-3.5', active && 'fill-yellow-300 text-yellow-300')} />
        <span>Caza-tormentas</span>
        {active && (
          <span
            className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-yellow-300"
            style={{ animation: 'wi-flash 1.4s ease-in-out infinite' }}
            aria-hidden
          />
        )}
      </motion.button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="pointer-events-none absolute top-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-violet-400/40 bg-gradient-to-r from-indigo-600/85 to-violet-600/85 px-4 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-md"
            role="status"
          >
            ⚡ Modo Caza-tormentas activo · CAPE + rachas + precipitación
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
