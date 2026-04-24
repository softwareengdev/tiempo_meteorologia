'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Droplets } from 'lucide-react';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';

/**
 * PrecipNow™ — Nowcast minuto-a-minuto de precipitación.
 * Lee `minutely_15` de Open-Meteo (8 buckets de 15 min = próximas 2h) y
 * dibuja un sparkline + un mensaje en lenguaje natural ("Lluvia en ~25 min").
 */
export function PrecipNowWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  const buckets = useMemo(() => {
    if (!data?.minutely_15) return null;
    const { time, precipitation, precipitation_probability } = data.minutely_15;
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const items = time.map((t, i) => ({
      t: new Date(t).getTime(),
      mm: precipitation[i] ?? 0,
      prob: precipitation_probability?.[i] ?? 0,
    }));
    // Tomar buckets futuros (los <now ya pasaron) hasta 2 h
    const future = items.filter((it) => it.t >= now - 15 * 60_000).slice(0, 8);
    return future;
  }, [data]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="h-32 animate-pulse rounded-xl bg-white/5" />
      </div>
    );
  }

  if (!buckets || buckets.length === 0) {
    return null;
  }

  const maxMm = Math.max(0.5, ...buckets.map((b) => b.mm));
  const totalMm = buckets.reduce((acc, b) => acc + b.mm, 0);
  const firstWet = buckets.findIndex((b) => b.mm >= 0.1);
  const allDry = firstWet === -1;

  // Mensaje principal
  let headline = 'Sin precipitación esperada las próximas 2 h';
  let subline = `Probabilidad máxima: ${Math.max(0, ...buckets.map((b) => b.prob))} %`;
  let tone: 'dry' | 'soon' | 'now' = 'dry';

  if (!allDry) {
    const minutesAway = firstWet * 15;
    if (minutesAway === 0) {
      headline = 'Está lloviendo ahora';
      subline = `~${(buckets[0].mm).toFixed(1)} mm en este intervalo`;
      tone = 'now';
    } else {
      headline = `Lluvia en ~${minutesAway} min`;
      subline = `Acumulado estimado 2 h: ${totalMm.toFixed(1)} mm`;
      tone = 'soon';
    }
  }

  const toneStyles = {
    dry: 'from-emerald-500/20 to-sky-500/10 text-emerald-200',
    soon: 'from-sky-500/30 to-indigo-500/20 text-sky-100',
    now: 'from-indigo-500/40 to-violet-500/30 text-white',
  } as const;

  // Sparkline barras
  const W = 280;
  const H = 60;
  const barW = W / buckets.length;
  const barGap = 4;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${toneStyles[tone]} p-4 backdrop-blur-md`}
      aria-label="Nowcast de precipitación próximas 2 horas"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            {tone === 'dry' ? <Droplets className="h-4 w-4" /> : <CloudRain className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-wider text-white/60 uppercase">PrecipNow™</p>
            <p className="font-display text-base leading-tight font-semibold text-white">{headline}</p>
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70">
          2 h
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H + 18}`}
        className="h-20 w-full"
        role="img"
        aria-label={`Precipitación próximas 2 horas, total ${totalMm.toFixed(1)} milímetros`}
      >
        <defs>
          <linearGradient id="precip-bar" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(125 211 252)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {buckets.map((b, i) => {
          const x = i * barW + barGap / 2;
          const h = Math.max(2, (b.mm / maxMm) * H);
          const y = H - h;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW - barGap}
                height={h}
                rx="3"
                fill="url(#precip-bar)"
                opacity={b.mm < 0.1 ? 0.25 : 1}
              />
              {i % 2 === 0 && (
                <text
                  x={x + (barW - barGap) / 2}
                  y={H + 12}
                  textAnchor="middle"
                  className="fill-white/50"
                  fontSize="9"
                >
                  +{i * 15}m
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <p className="mt-2 text-xs text-white/70">{subline}</p>
    </motion.section>
  );
}
