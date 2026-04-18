'use client';

import { useEffect, useRef, useState } from 'react';
import { useWeatherStore } from '@/lib/stores';
import { Play, Pause } from 'lucide-react';

export function TimeSlider() {
  const { forecastHourOffset, setForecastHourOffset } = useWeatherStore();
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (t: number) => {
      if (t - last > 600) {
        last = t;
        const next = ((forecastHourOffset ?? 0) + 1) % 48;
        setForecastHourOffset(next);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, forecastHourOffset, setForecastHourOffset]);

  const hour = forecastHourOffset ?? 0;
  const date = new Date(Date.now() + hour * 3600_000);
  const label = hour === 0
    ? 'Ahora'
    : `+${hour}h · ${date.toLocaleString('es', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="pointer-events-auto absolute right-4 bottom-20 z-10 flex w-[min(92vw,560px)] items-center gap-3 rounded-xl border border-white/10 bg-[#0b1020]/90 px-3 py-2 backdrop-blur-md shadow-xl md:right-1/2 md:bottom-6 md:translate-x-1/2">
      <button
        onClick={() => setPlaying((p) => !p)}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 transition hover:bg-sky-500/30"
        aria-label={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      <input
        type="range"
        min={0}
        max={47}
        value={hour}
        onChange={(e) => setForecastHourOffset(Number(e.target.value))}
        className="flex-1 accent-sky-400"
        aria-label="Hora del pronóstico"
      />
      <span className="min-w-[110px] text-right text-xs tabular-nums text-white/80">{label}</span>
    </div>
  );
}
