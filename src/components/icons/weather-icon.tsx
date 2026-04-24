'use client';

/**
 * WeatherIcon — Pictogramas SVG meteorológicos animados (WMO codes).
 *
 * Reemplaza los emoji de getWeatherIcon() con SVG inline propio:
 *  • 32+ condiciones WMO mapeadas a 12 pictogramas base
 *  • Variantes día / noche (sol vs luna, color paleta)
 *  • Animaciones SMIL/CSS suaves (sol gira, gotas caen, rayos parpadean)
 *  • Respeta prefers-reduced-motion (animaciones se desactivan vía CSS)
 *  • Tree-shakable, sin dependencias externas
 *  • Tamaño escalable vía prop `size` (px) o `className`
 *
 * Uso:
 *   <WeatherIcon code={61} isDay={true} size={64} />
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  size?: number;
  className?: string;
  animated?: boolean;
  title?: string;
}

type Kind =
  | 'clear' | 'mostlyClear' | 'partlyCloudy' | 'cloudy'
  | 'fog' | 'drizzle' | 'rain' | 'heavyRain'
  | 'freezingRain' | 'snow' | 'sleet' | 'thunderstorm';

function classify(code: number): Kind {
  if (code === 0) return 'clear';
  if (code === 1) return 'mostlyClear';
  if (code === 2) return 'partlyCloudy';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code === 56 || code === 57 || code === 66 || code === 67) return 'freezingRain';
  if (code === 61 || code === 63 || code === 80 || code === 81) return 'rain';
  if (code === 65 || code === 82) return 'heavyRain';
  if (code >= 71 && code <= 75) return 'snow';
  if (code === 77 || code === 85 || code === 86) return 'sleet';
  if (code >= 95) return 'thunderstorm';
  return 'partlyCloudy';
}

const palette = {
  sunCore: '#ffd35a',
  sunRays: '#ffb547',
  moon: '#e8edf6',
  moonShade: '#9aa6c2',
  cloud: '#e2e8f0',
  cloudShade: '#94a3b8',
  cloudDark: '#64748b',
  rainDrop: '#38bdf8',
  rainHeavy: '#1d4ed8',
  snow: '#f0f9ff',
  fog: '#cbd5e1',
  bolt: '#fde047',
  freezing: '#a5f3fc',
};

/* ----------------------------- Sub-shapes ------------------------------ */

function Sun({ animated }: { animated: boolean }) {
  return (
    <g className={animated ? 'origin-center [animation:wi-spin_22s_linear_infinite]' : ''} style={{ transformOrigin: '50% 50%' }}>
      <circle cx="50" cy="50" r="16" fill={palette.sunCore} />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="50" y1="22" x2="50" y2="14"
          stroke={palette.sunRays}
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${i * 45} 50 50)`}
        />
      ))}
    </g>
  );
}

function Moon() {
  return (
    <g>
      <circle cx="50" cy="50" r="20" fill={palette.moon} />
      <circle cx="58" cy="46" r="20" fill="#0b1020" opacity="0.92" />
      <circle cx="42" cy="42" r="2" fill={palette.moonShade} opacity="0.5" />
      <circle cx="36" cy="56" r="1.5" fill={palette.moonShade} opacity="0.4" />
    </g>
  );
}

function Cloud({ x = 50, y = 58, scale = 1, fill = palette.cloud, shadow = palette.cloudShade }: { x?: number; y?: number; scale?: number; fill?: string; shadow?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="6" rx="32" ry="6" fill={shadow} opacity="0.25" />
      <path
        d="M -28 4 q 0 -14 14 -14 q 5 -10 18 -10 q 16 0 18 14 q 12 0 12 12 q 0 10 -14 10 h -36 q -12 0 -12 -12 z"
        fill={fill}
        stroke={shadow}
        strokeWidth="1.2"
      />
    </g>
  );
}

function Drops({ count = 3, color = palette.rainDrop, animated = true, delayBase = 0 }: { count?: number; color?: string; animated?: boolean; delayBase?: number }) {
  const positions = [-14, 0, 14, -7, 7];
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <ellipse
          key={i}
          cx={50 + positions[i]} cy={82} rx={2.2} ry={4}
          fill={color}
          className={animated ? '[animation:wi-fall_1.4s_ease-in_infinite]' : ''}
          style={{ animationDelay: `${delayBase + i * 0.18}s`, transformOrigin: `${50 + positions[i]}px 70px` }}
        />
      ))}
    </g>
  );
}

function Snowflakes({ animated }: { animated: boolean }) {
  const positions = [-14, 0, 14];
  return (
    <g>
      {positions.map((x, i) => (
        <g
          key={i}
          className={animated ? '[animation:wi-snow_2.4s_linear_infinite]' : ''}
          style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${50 + x}px 70px` }}
        >
          <text x={50 + x} y="86" textAnchor="middle" fontSize="11" fill={palette.snow} fontWeight="700">❋</text>
        </g>
      ))}
    </g>
  );
}

function Bolt({ animated }: { animated: boolean }) {
  return (
    <g className={animated ? '[animation:wi-flash_1.6s_ease-out_infinite]' : ''} style={{ transformOrigin: '50px 80px' }}>
      <path d="M 52 70 L 44 86 L 51 86 L 47 96 L 60 80 L 53 80 L 58 70 Z" fill={palette.bolt} stroke="#a16207" strokeWidth="0.8" strokeLinejoin="round" />
    </g>
  );
}

function Fog() {
  return (
    <g>
      <line x1="20" y1="62" x2="80" y2="62" stroke={palette.fog} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <line x1="14" y1="74" x2="86" y2="74" stroke={palette.fog} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <line x1="22" y1="86" x2="78" y2="86" stroke={palette.fog} strokeWidth="4" strokeLinecap="round" opacity="0.85" />
    </g>
  );
}

/* --------------------------- Composed icons --------------------------- */

function renderIcon(kind: Kind, isDay: boolean, animated: boolean) {
  switch (kind) {
    case 'clear':
      return isDay ? <Sun animated={animated} /> : <Moon />;

    case 'mostlyClear':
      return (
        <>
          {isDay
            ? <g transform="translate(-12 -8) scale(0.85)"><Sun animated={animated} /></g>
            : <g transform="translate(-12 -8) scale(0.85)"><Moon /></g>}
          <Cloud x={58} y={62} scale={0.9} />
        </>
      );

    case 'partlyCloudy':
      return (
        <>
          {isDay
            ? <g transform="translate(-15 -10) scale(0.75)"><Sun animated={animated} /></g>
            : <g transform="translate(-15 -10) scale(0.75)"><Moon /></g>}
          <Cloud x={56} y={60} scale={1} />
        </>
      );

    case 'cloudy':
      return (
        <>
          <Cloud x={36} y={50} scale={0.8} fill="#cbd5e1" shadow={palette.cloudDark} />
          <Cloud x={56} y={62} scale={1.05} />
        </>
      );

    case 'fog':
      return (
        <>
          <Cloud x={50} y={42} scale={0.9} />
          <Fog />
        </>
      );

    case 'drizzle':
      return (
        <>
          <Cloud x={50} y={48} scale={1} />
          <Drops count={3} animated={animated} color={palette.rainDrop} />
        </>
      );

    case 'rain':
      return (
        <>
          <Cloud x={50} y={48} scale={1.05} />
          <Drops count={4} animated={animated} color={palette.rainDrop} />
        </>
      );

    case 'heavyRain':
      return (
        <>
          <Cloud x={50} y={46} scale={1.1} fill="#cbd5e1" shadow={palette.cloudDark} />
          <Drops count={5} animated={animated} color={palette.rainHeavy} />
        </>
      );

    case 'freezingRain':
      return (
        <>
          <Cloud x={50} y={48} scale={1} />
          <Drops count={3} animated={animated} color={palette.freezing} />
        </>
      );

    case 'snow':
      return (
        <>
          <Cloud x={50} y={48} scale={1} />
          <Snowflakes animated={animated} />
        </>
      );

    case 'sleet':
      return (
        <>
          <Cloud x={50} y={48} scale={1} fill="#cbd5e1" shadow={palette.cloudDark} />
          <Drops count={2} animated={animated} color={palette.rainDrop} />
          <Snowflakes animated={animated} />
        </>
      );

    case 'thunderstorm':
      return (
        <>
          <Cloud x={50} y={46} scale={1.1} fill="#94a3b8" shadow="#475569" />
          <Bolt animated={animated} />
          <Drops count={3} animated={animated} color={palette.rainHeavy} delayBase={0.2} />
        </>
      );
  }
}

export const WeatherIcon = memo(function WeatherIcon({
  code, isDay = true, size = 64, className, animated = true, title,
}: WeatherIconProps) {
  const kind = classify(code);
  const label = title ?? `Estado meteorológico código ${code}`;

  return (
    <svg
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={cn('select-none', className)}
      data-weather-kind={kind}
    >
      <title>{label}</title>
      {renderIcon(kind, isDay, animated)}
    </svg>
  );
});
