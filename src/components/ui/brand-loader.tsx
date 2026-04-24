'use client';

/**
 * BrandLoader — Spinner con identidad AetherCast.
 * Anillo aether con núcleo pulsante. Respeta prefers-reduced-motion via globals.
 */

import { cn } from '@/lib/utils';

interface Props {
  size?: number;
  label?: string;
  className?: string;
}

export function BrandLoader({ size = 56, label = 'Cargando…', className }: Props) {
  return (
    <div role="status" aria-live="polite" className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 64 64" width={size} height={size} className="[animation:aether-ring_2.4s_linear_infinite]">
          <defs>
            <linearGradient id="aether-ring-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#2f72ff" />
              <stop offset="100%" stopColor="#6b5cff" />
            </linearGradient>
          </defs>
          <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
          <circle
            cx="32" cy="32" r="26"
            stroke="url(#aether-ring-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="120 200"
            fill="none"
          />
        </svg>
        <div
          className="absolute inset-0 m-auto rounded-full bg-gradient-to-br from-sky-400 to-blue-600 [animation:aether-pulse_2s_ease-in-out_infinite]"
          style={{ width: size * 0.32, height: size * 0.32, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          aria-hidden
        />
      </div>
      {label && <p className="text-sm text-white/60">{label}</p>}
    </div>
  );
}
