'use client';

import { useEffect, useRef, useState } from 'react';
import { useWeatherStore } from '@/lib/stores';
import { Play, Pause, ChevronRight, ChevronLeft } from 'lucide-react';

export function TimeSlider() {
  const { forecastHourOffset, setForecastHourOffset } = useWeatherStore();
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
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

  // Anchor to the very top edge of the widget panel (or bottom-nav when panel
  // is collapsed). Sits flush against the panel header so it appears glued
  // to it as the panel expands/collapses.
  const anchorStyle = {
    bottom: 'calc(var(--panel-h, var(--bottom-nav-h, 0px)) + 0.5rem)',
  } as const;

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-label="Mostrar línea de tiempo"
        className="pointer-events-auto absolute left-2 z-20 flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-[#0b1020]/75 pl-1 pr-2.5 backdrop-blur-md shadow-lg transition hover:bg-[#0b1020]/90 active:scale-95"
        style={anchorStyle}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-[0_0_8px_rgba(56,189,248,0.4)]">
          <Play className="h-3.5 w-3.5 translate-x-[1px]" />
        </span>
        <span className="text-[11px] font-medium tabular-nums text-white/85">{label}</span>
        <ChevronRight className="h-3 w-3 text-white/55" />
      </button>
    );
  }

  return (
    <div
      className="pointer-events-auto absolute left-2 z-20 flex w-[calc(100vw-1rem)] max-w-[520px] items-center gap-2 rounded-full border border-white/15 bg-[#0b1020]/75 pl-1 pr-2 py-1 backdrop-blur-md backdrop-saturate-150 shadow-xl md:left-1/2 md:-translate-x-1/2 md:w-[min(86vw,520px)]"
      style={anchorStyle}
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
        className="time-slider-range flex-1 min-w-0"
        aria-label="Hora del pronóstico"
      />
      <span className="hidden min-w-[60px] text-right text-[10px] font-medium tabular-nums text-white/80 sm:inline">{label}</span>
      <button
        type="button"
        onClick={() => { setPlaying(false); setExpanded(false); }}
        aria-label="Contraer línea de tiempo"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/55 hover:bg-white/10 hover:text-white"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
