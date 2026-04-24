'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { Sunrise, Sunset, Shield } from 'lucide-react';

/**
 * SunriseSunsetWidget — Arco SVG animado del recorrido solar diario.
 * El sol se posiciona en el arco según hora actual; antes/después del día queda fuera.
 * UV index se muestra como pill independiente.
 */
export function SunriseSunsetWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (isLoading || !data?.daily) return null;

  const sunrise = new Date(data.daily.sunrise[0]);
  const sunset = new Date(data.daily.sunset[0]);
  const dayLengthH = (sunset.getTime() - sunrise.getTime()) / 3_600_000;
  const uvMax = data.daily.uv_index_max[0];

  // Progress 0..1 across the daylight arc; clamp before sunrise / after sunset.
  const progress = Math.min(1, Math.max(0, (now - sunrise.getTime()) / Math.max(1, sunset.getTime() - sunrise.getTime())));
  const inDaylight = now >= sunrise.getTime() && now <= sunset.getTime();

  // Arc geometry: half-circle from (20,90) to (220,90), apex (120,20)
  const W = 240, H = 100;
  const arcPath = `M 20 90 A 100 80 0 0 1 220 90`;
  const angle = Math.PI * (1 - progress); // 180° → 0°
  const sunX = 120 + 100 * Math.cos(angle);
  const sunY = 90 - 80 * Math.sin(angle);

  const uvLevel = (uv: number) => {
    if (uv <= 2) return { label: 'Bajo', color: 'text-green-400', bg: 'bg-green-400/15' };
    if (uv <= 5) return { label: 'Moderado', color: 'text-yellow-400', bg: 'bg-yellow-400/15' };
    if (uv <= 7) return { label: 'Alto', color: 'text-orange-400', bg: 'bg-orange-400/15' };
    if (uv <= 10) return { label: 'Muy alto', color: 'text-red-400', bg: 'bg-red-400/15' };
    return { label: 'Extremo', color: 'text-purple-400', bg: 'bg-purple-400/15' };
  };
  const uv = uvLevel(uvMax);

  const fmt = (d: Date) => d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 backdrop-blur-md"
      aria-label="Sol y radiación UV"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/70">Sol &amp; UV</h3>
        <span className="text-xs text-white/45">{dayLengthH.toFixed(1)}h de luz</span>
      </div>

      <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full" role="img" aria-label="Arco del recorrido solar">
        <defs>
          <linearGradient id="sun-arc" x1="0" y1="0" x2={W} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="sun-glow">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* track */}
        <path d={arcPath} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="3 4" />
        {/* progress */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#sun-arc)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="320"
          strokeDashoffset={320 * (1 - progress)}
        />
        {/* horizon */}
        <line x1="0" y1="91" x2={W} y2="91" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        {/* sun */}
        {inDaylight && (
          <g transform={`translate(${sunX} ${sunY})`}>
            <circle r="14" fill="url(#sun-glow)" />
            <circle r="6" fill="#fde047" stroke="#f59e0b" strokeWidth="0.8" />
          </g>
        )}
        {/* labels */}
        <text x="20" y={H + 14} fill="rgba(255,255,255,0.55)" fontSize="10" textAnchor="middle">{fmt(sunrise)}</text>
        <text x="220" y={H + 14} fill="rgba(255,255,255,0.55)" fontSize="10" textAnchor="middle">{fmt(sunset)}</text>
      </svg>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 p-2">
          <Sunrise className="h-4 w-4 text-amber-300" />
          <span className="text-[10px] text-white/45 uppercase tracking-wide">Amanece</span>
          <span className="text-sm font-semibold text-white tabular-nums">{fmt(sunrise)}</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 p-2">
          <Sunset className="h-4 w-4 text-orange-300" />
          <span className="text-[10px] text-white/45 uppercase tracking-wide">Anochece</span>
          <span className="text-sm font-semibold text-white tabular-nums">{fmt(sunset)}</span>
        </div>
        <div className={`flex flex-col items-center gap-1 rounded-xl p-2 ${uv.bg}`}>
          <Shield className={`h-4 w-4 ${uv.color}`} />
          <span className="text-[10px] text-white/55 uppercase tracking-wide">UV</span>
          <span className={`text-sm font-semibold tabular-nums ${uv.color}`}>{uvMax} · {uv.label}</span>
        </div>
      </div>
    </motion.div>
  );
}
