'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useWeatherStore } from '@/lib/stores';
import { LAYER_COLORS } from './weather-overlay';
import type { WeatherLayer } from '@/types';

const LABELS: Record<WeatherLayer, { name: string; min: string; max: string }> = {
  temperature: { name: 'Temperatura', min: '-30°C', max: '45°C' },
  precipitation: { name: 'Precipitación', min: '0', max: '15 mm' },
  rain: { name: 'Lluvia', min: '0', max: '15 mm' },
  snow: { name: 'Nieve', min: '0', max: '5 cm' },
  snowfall: { name: 'Nevada', min: '0', max: '5 cm' },
  wind: { name: 'Viento', min: '0', max: '30 m/s' },
  wind_gusts: { name: 'Rachas', min: '0', max: '50 m/s' },
  clouds: { name: 'Nubes', min: '0%', max: '100%' },
  pressure: { name: 'Presión', min: '970', max: '1040 hPa' },
  humidity: { name: 'Humedad', min: '0%', max: '100%' },
  visibility: { name: 'Visibilidad', min: '0', max: '30 km' },
  uv_index: { name: 'UV', min: '0', max: '12+' },
  cape: { name: 'CAPE', min: '0', max: '4000 J/kg' },
  dew_point: { name: 'Rocío', min: '-20°C', max: '30°C' },
};

/**
 * MapLegend — collapsed by default into a discreet "i" pill in the top-left
 * of the map. Tap to expand into a glass card showing the colour scale of
 * every active layer. Keeps the map almost entirely visible on mobile while
 * still letting users decode what each colour means.
 */
export function MapLegend() {
  const activeLayers = useWeatherStore((s) => s.activeLayers);
  const [open, setOpen] = useState(false);

  if (!activeLayers.length) return null;

  return (
    <div className="absolute top-[4.25rem] left-3 z-10 flex flex-col items-start gap-2 md:top-20 md:left-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Ocultar leyenda de capas' : 'Mostrar leyenda de capas'}
        className="flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0b1020]/80 px-2.5 py-1.5 text-[11px] font-semibold text-white/85 shadow-lg backdrop-blur-md backdrop-saturate-150 transition-colors hover:bg-[#0b1020]/95 hover:text-white"
      >
        {open ? <X className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5 text-sky-300" />}
        <span>Capas</span>
        <span className="rounded-full bg-sky-500/30 px-1.5 text-[10px] font-bold text-sky-100 tabular-nums">
          {activeLayers.length}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="flex max-h-[calc(100dvh-14rem)] w-[min(78vw,260px)] flex-col gap-2 overflow-y-auto rounded-2xl border border-white/12 bg-[#0b1020]/88 p-2.5 shadow-2xl backdrop-blur-2xl backdrop-saturate-150"
          >
            <p className="px-1 text-[10px] font-semibold tracking-wider text-white/45 uppercase">
              Leyenda · {activeLayers.length} {activeLayers.length === 1 ? 'capa activa' : 'capas activas'}
            </p>
            {activeLayers.map((layer) => {
              const stops = LAYER_COLORS[layer];
              const meta = LABELS[layer];
              const gradient = `linear-gradient(to right, ${stops.join(', ')})`;
              return (
                <div key={layer} className="rounded-xl border border-white/8 bg-white/5 p-2">
                  <div className="mb-1 text-[11px] font-semibold tracking-wide text-white/85">
                    {meta.name}
                  </div>
                  <div className="h-2 w-full rounded-full" style={{ background: gradient }} />
                  <div className="mt-1 flex justify-between text-[10px] text-white/55">
                    <span>{meta.min}</span>
                    <span>{meta.max}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
