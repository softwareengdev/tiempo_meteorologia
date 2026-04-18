'use client';

import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { useMemo } from 'react';
import { useWeatherStore } from '@/lib/stores';

function getMoonPhase(date: Date) {
  const synodic = 29.530588853;
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const days = (date.getTime() - knownNewMoon) / 86400000;
  const phase = ((days % synodic) + synodic) % synodic;
  const fraction = phase / synodic;
  const illumination = (1 - Math.cos(fraction * 2 * Math.PI)) / 2;

  let name = 'Luna nueva';
  if (fraction < 0.03 || fraction > 0.97) name = 'Luna nueva';
  else if (fraction < 0.22) name = 'Creciente';
  else if (fraction < 0.28) name = 'Cuarto creciente';
  else if (fraction < 0.47) name = 'Gibosa creciente';
  else if (fraction < 0.53) name = 'Luna llena';
  else if (fraction < 0.72) name = 'Gibosa menguante';
  else if (fraction < 0.78) name = 'Cuarto menguante';
  else name = 'Menguante';

  return { fraction, illumination, name, age: phase };
}

function MoonSVG({ illumination, waxing }: { illumination: number; waxing: boolean }) {
  const r = 50;
  const offset = (1 - 2 * illumination) * r;
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32">
      <defs>
        <radialGradient id="moonGrad">
          <stop offset="0%" stopColor="#f5f3e8" />
          <stop offset="100%" stopColor="#bdb89b" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r={r} fill="#1a1f3a" />
      <ellipse
        cx={waxing ? 60 + offset / 2 : 60 - offset / 2}
        cy="60"
        rx={Math.abs(offset / 2) + r}
        ry={r}
        fill="url(#moonGrad)"
        clipPath="circle(50px at 60px 60px)"
      />
      <clipPath id="moonClip"><circle cx="60" cy="60" r={r} /></clipPath>
      <g clipPath="url(#moonClip)">
        <circle cx={waxing ? 60 + offset : 60 - offset} cy="60" r={r} fill={waxing ? '#0b1020' : 'url(#moonGrad)'} opacity={waxing ? 1 : illumination} />
      </g>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
    </svg>
  );
}

export function AstronomyWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const moon = useMemo(() => getMoonPhase(new Date()), []);
  const waxing = moon.fraction < 0.5;

  if (!selectedLocation) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-600/5 p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-2">
        <Moon className="h-4 w-4 text-indigo-300" />
        <h3 className="text-sm font-medium text-white/60">Astronomía · Luna</h3>
      </div>

      <div className="flex items-center gap-4">
        <MoonSVG illumination={moon.illumination} waxing={waxing} />
        <div>
          <p className="text-xl font-semibold text-white">{moon.name}</p>
          <p className="mt-1 text-sm text-white/60">
            Iluminación: <span className="font-mono">{(moon.illumination * 100).toFixed(0)}%</span>
          </p>
          <p className="text-sm text-white/60">
            Edad: <span className="font-mono">{moon.age.toFixed(1)} días</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
