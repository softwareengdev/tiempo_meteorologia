'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useWeatherStore } from '@/lib/stores';

interface Particle {
  x: number; y: number; age: number;
}

interface Props {
  map: maplibregl.Map | null;
}

/* Lightweight wind particles using location's current wind values; not a full vector field
 * but visually evocative and respectful of perf. */
export function WindParticles({ map }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeLayers = useWeatherStore((s) => s.activeLayers);
  const sel = useWeatherStore((s) => s.selectedLocation);
  const enabled = activeLayers.includes('wind') || activeLayers.includes('wind_gusts');
  const wind = useRef<{ speed: number; dir: number }>({ speed: 5, dir: 90 });

  useEffect(() => {
    if (!enabled || !sel) return;
    const ctrl = new AbortController();
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${sel.latitude}&longitude=${sel.longitude}&current=wind_speed_10m,wind_direction_10m`,
      { signal: ctrl.signal },
    )
      .then((r) => r.json())
      .then((j) => {
        wind.current.speed = j?.current?.wind_speed_10m ?? 5;
        wind.current.dir = j?.current?.wind_direction_10m ?? 90;
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [enabled, sel]);

  useEffect(() => {
    if (!enabled || !map || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const c = map.getContainer();
      canvas.width = c.clientWidth;
      canvas.height = c.clientHeight;
    };
    resize();
    map.on('resize', resize);

    const N = 250;
    const particles: Particle[] = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      age: Math.random() * 100,
    }));

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(11,16,32,0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert meteorological dir (FROM) to vector (TO)
      const rad = ((wind.current.dir + 180) * Math.PI) / 180;
      const speed = Math.max(0.3, Math.min(4, wind.current.speed / 6));
      const dx = Math.sin(rad) * speed;
      const dy = -Math.cos(rad) * speed;

      ctx.strokeStyle = 'rgba(125,211,252,0.65)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (const p of particles) {
        const nx = p.x + dx;
        const ny = p.y + dy;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        p.x = nx;
        p.y = ny;
        p.age += 1;
        if (p.age > 100 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.age = 0;
        }
      }
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      map.off('resize', resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [enabled, map]);

  if (!enabled) return null;
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[5] mix-blend-screen"
      aria-hidden="true"
    />
  );
}
