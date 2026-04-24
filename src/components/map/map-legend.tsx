'use client';

import { useMemo } from 'react';
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

export function MapLegend() {
  const activeLayers = useWeatherStore((s) => s.activeLayers);

  const items = useMemo(() => activeLayers.slice(0, 4), [activeLayers]);
  if (!items.length) return null;

  return (
    <div className="pointer-events-none absolute bottom-20 left-4 z-10 flex flex-col gap-2 md:bottom-16">
      {items.map((layer) => {
        const stops = LAYER_COLORS[layer];
        const meta = LABELS[layer];
        const gradient = `linear-gradient(to right, ${stops.join(', ')})`;
        return (
          <div
            key={layer}
            className="pointer-events-auto rounded-lg border border-white/10 bg-[#0b1020]/85 p-2 backdrop-blur-md shadow-lg"
          >
            <div className="mb-1 text-[11px] font-semibold tracking-wider text-white/80 uppercase">
              {meta.name}
            </div>
            <div className="h-2 w-44 rounded-sm" style={{ background: gradient }} />
            <div className="mt-1 flex justify-between text-[10px] text-white/55">
              <span>{meta.min}</span>
              <span>{meta.max}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
