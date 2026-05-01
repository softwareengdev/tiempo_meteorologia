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
 * MapLegend — collapsed by default into a discreet "Capas" pill (rendered
 * by the parent map at the top-left). When expanded, shows a fully
 * transparent stack of glass legend cards (one per active layer) anchored
 * to the same top-left anchor; max 40% of the viewport width on mobile.
 */
export function MapLegend() {
  const activeLayers = useWeatherStore((s) => s.activeLayers);
  const [open, setOpen] = useState(false);

  if (!activeLayers.length) return null;

  return (
    <div className="pointer-events-auto flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Ocultar leyenda de capas' : 'Mostrar leyenda de capas'}
        className="flex shrink-0 items-center gap-1 rounded-full border border-white/15 bg-[#0b1020]/70 px-2 py-1 text-[11px] font-semibold text-white/85 shadow-lg backdrop-blur-md backdrop-saturate-150 transition-colors hover:bg-[#0b1020]/90 hover:text-white"
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
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            // Fully transparent container, transparent custom scrollbar.
            // Each item carries its own translucent glass background.
            className="legend-scroll flex max-h-[calc(100dvh-12rem)] w-[40vw] max-w-[260px] flex-col gap-1.5 overflow-y-auto bg-transparent p-0 shadow-none"
          >
            {activeLayers.map((layer) => {
              const stops = LAYER_COLORS[layer];
              const meta = LABELS[layer];
              const gradient = `linear-gradient(to right, ${stops.join(', ')})`;
              return (
                <div
                  key={layer}
                  className="rounded-xl border border-white/10 bg-[#0b1020]/55 p-2 backdrop-blur-md backdrop-saturate-150 shadow-md"
                >
                  <div className="mb-1 truncate text-[11px] font-semibold tracking-wide text-white/90">
                    {meta.name}
                  </div>
                  <div className="h-1.5 w-full rounded-full" style={{ background: gradient }} />
                  <div className="mt-1 flex justify-between text-[10px] text-white/55 tabular-nums">
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
