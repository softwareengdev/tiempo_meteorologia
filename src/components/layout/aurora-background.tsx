'use client';

/**
 * AuroraBackground — Fondo dinámico que reacciona al estado meteorológico actual.
 *
 * Lee `weather_code` + `is_day` y aplica gradientes radiales/lineales
 * mediante CSS variables (--aurora-from / --aurora-to / --aurora-glow / --aurora-accent).
 * Transición suave de 1.5s entre estados.
 *
 * Uso: montar como hijo absoluto detrás del contenido principal.
 */

import { useEffect, useRef } from 'react';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

interface Palette {
  from: string;
  to: string;
  glow: string;
  accent: string;
}

function paletteFor(code: number, isDay: boolean): Palette {
  if (!isDay) {
    if (code >= 95) return { from: '#0a0716', to: '#1a0c33', glow: 'rgba(180,80,255,0.22)', accent: 'rgba(255,80,160,0.18)' };
    if (code >= 71) return { from: '#0a1224', to: '#1e3a5f', glow: 'rgba(180,220,255,0.18)', accent: 'rgba(120,200,255,0.14)' };
    if (code >= 51) return { from: '#080d1a', to: '#15243d', glow: 'rgba(56,189,248,0.20)', accent: 'rgba(47,114,255,0.16)' };
    if (code === 3 || code === 45 || code === 48) return { from: '#0a0e1a', to: '#1c2236', glow: 'rgba(150,170,200,0.14)', accent: 'rgba(100,116,139,0.14)' };
    return { from: '#06091a', to: '#0d1530', glow: 'rgba(107,92,255,0.22)', accent: 'rgba(47,114,255,0.18)' };
  }
  // Day
  if (code >= 95) return { from: '#1c1530', to: '#2d1a4a', glow: 'rgba(253,224,71,0.22)', accent: 'rgba(220,40,90,0.16)' };
  if (code >= 71) return { from: '#dde7f5', to: '#a8c3e2', glow: 'rgba(255,255,255,0.40)', accent: 'rgba(160,200,240,0.30)' };
  if (code === 65 || code === 82) return { from: '#0f1830', to: '#1e2a4a', glow: 'rgba(56,189,248,0.20)', accent: 'rgba(29,78,216,0.18)' };
  if (code >= 51) return { from: '#1a2540', to: '#2d3e5f', glow: 'rgba(56,189,248,0.22)', accent: 'rgba(47,114,255,0.18)' };
  if (code === 3) return { from: '#1c2440', to: '#2d3a5a', glow: 'rgba(180,200,230,0.18)', accent: 'rgba(120,140,180,0.14)' };
  if (code === 2) return { from: '#15244a', to: '#2a4072', glow: 'rgba(255,213,128,0.20)', accent: 'rgba(56,189,248,0.18)' };
  if (code === 1) return { from: '#102050', to: '#2a55a0', glow: 'rgba(255,213,128,0.22)', accent: 'rgba(56,189,248,0.20)' };
  // Clear day
  return { from: '#0c1d4a', to: '#3470c8', glow: 'rgba(255,213,128,0.28)', accent: 'rgba(255,143,98,0.22)' };
}

interface Props { className?: string }

export function AuroraBackground({ className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data } = useWeatherForecast(selectedLocation);

  useEffect(() => {
    if (!ref.current) return;
    const code = data?.current?.weather_code ?? 1;
    const isDay = (data?.current?.is_day ?? 1) === 1;
    const p = paletteFor(code, isDay);
    ref.current.style.setProperty('--aurora-from', p.from);
    ref.current.style.setProperty('--aurora-to', p.to);
    ref.current.style.setProperty('--aurora-glow', p.glow);
    ref.current.style.setProperty('--aurora-accent', p.accent);
  }, [data?.current?.weather_code, data?.current?.is_day]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 bg-aurora-dynamic', className)}
    />
  );
}
