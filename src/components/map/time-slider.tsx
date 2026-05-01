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
    <div
      className="pointer-events-auto absolute left-1/2 z-20 flex w-[min(86vw,520px)] -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-[#0b1020]/65 pl-1.5 pr-3 py-1 backdrop-blur-md backdrop-saturate-150 shadow-xl"
      style={{ bottom: 'calc(var(--panel-h, var(--bottom-nav-h, 0px)) + 3.25rem)' }}
    >
      <button
        onClick={() => setPlaying((p) => !p)}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-[0_0_10px_rgba(56,189,248,0.5)] transition hover:from-sky-300 hover:to-sky-500"
        aria-label={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-[1px]" />}
      </button>
      <input
        type="range"
        min={0}
        max={47}
        value={hour}
        onChange={(e) => setForecastHourOffset(Number(e.target.value))}
        className="time-slider-range flex-1"
        aria-label="Hora del pronóstico"
      />
      <span className="min-w-[78px] text-right text-[10.5px] font-medium tabular-nums text-white/80">{label}</span>
    </div>
  );
}
