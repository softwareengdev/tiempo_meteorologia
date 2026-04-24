'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useWeatherStore } from '@/lib/stores';
import type { WindGridSample } from './weather-overlay';

interface Particle {
  /** Map (lng, lat) coordinates so particles travel with the map. */
  lng: number;
  lat: number;
  age: number;
  maxAge: number;
}

interface Props {
  map: maplibregl.Map | null;
  /** Wind direction grid sampled in the visible bbox (provided by useWeatherOverlay). */
  grid: WindGridSample[] | null;
}

/**
 * Real wind vector field visualization.
 *
 * Each particle stores its position in geographic coords (lng/lat) and is
 * advected by the local wind direction obtained via Inverse Distance Weighting
 * (IDW) interpolation across the sampled grid. Result: visually correct flow
 * lines that vary in direction across the map (vs the previous version that
 * applied a single global direction everywhere).
 */
export function WindParticles({ map, grid }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeLayers = useWeatherStore((s) => s.activeLayers);
  const enabled = activeLayers.includes('wind') || activeLayers.includes('wind_gusts');
  const gridRef = useRef<WindGridSample[] | null>(grid);
  gridRef.current = grid;

  useEffect(() => {
    if (!enabled || !map || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const c = map.getContainer();
      canvas.width = Math.floor(c.clientWidth * dpr);
      canvas.height = Math.floor(c.clientHeight * dpr);
      canvas.style.width = `${c.clientWidth}px`;
      canvas.style.height = `${c.clientHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    map.on('resize', resize);

    const seedParticles = (n: number): Particle[] => {
      const b = map.getBounds();
      const w = b.getWest(), e = b.getEast(), s = b.getSouth(), nB = b.getNorth();
      return Array.from({ length: n }, () => ({
        lng: w + Math.random() * (e - w),
        lat: s + Math.random() * (nB - s),
        age: Math.random() * 80,
        maxAge: 60 + Math.random() * 90,
      }));
    };

    let particles = seedParticles(420);

    const onMoveEnd = () => { particles = seedParticles(420); };
    map.on('moveend', onMoveEnd);

    /** IDW interpolation: returns {speed, dir(deg meteo FROM)} at (lng,lat). */
    const sampleAt = (lng: number, lat: number): { speed: number; ux: number; uy: number } => {
      const g = gridRef.current;
      if (!g || g.length === 0) {
        // Fallback: gentle eastward breeze so the canvas isn't dead
        return { speed: 4, ux: 1, uy: 0 };
      }
      // Convert each grid sample direction to a unit vector, weighted by 1/d²
      let sumWeight = 0, sumSpeed = 0, sumUx = 0, sumUy = 0;
      // Use a small neighborhood (5 nearest by squared distance)
      const ranked: Array<{ w: number; s: number; ux: number; uy: number }> = [];
      for (const p of g) {
        const dlon = p.lon - lng;
        const dlat = p.lat - lat;
        const d2 = dlon * dlon + dlat * dlat + 1e-6;
        // FROM direction → vector pointing TO direction (meteo convention)
        const rad = ((p.direction + 180) * Math.PI) / 180;
        const ux = Math.sin(rad);
        const uy = -Math.cos(rad);
        ranked.push({ w: 1 / d2, s: p.speed, ux, uy });
      }
      ranked.sort((a, b) => b.w - a.w);
      for (let i = 0; i < Math.min(5, ranked.length); i++) {
        const r = ranked[i];
        sumWeight += r.w;
        sumSpeed  += r.w * r.s;
        sumUx     += r.w * r.ux;
        sumUy     += r.w * r.uy;
      }
      if (sumWeight === 0) return { speed: 0, ux: 1, uy: 0 };
      const speed = sumSpeed / sumWeight;
      // Normalize the averaged vector
      const ux = sumUx / sumWeight;
      const uy = sumUy / sumWeight;
      const mag = Math.hypot(ux, uy) || 1;
      return { speed, ux: ux / mag, uy: uy / mag };
    };

    let raf = 0;
    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      // Trail fade — slightly stronger to avoid blur build-up
      ctx.fillStyle = 'rgba(11,16,32,0.16)';
      ctx.fillRect(0, 0, w, h);

      const b = map.getBounds();
      const west = b.getWest(), east = b.getEast(), south = b.getSouth(), north = b.getNorth();

      ctx.lineWidth = 1.1;
      ctx.lineCap = 'round';

      for (const p of particles) {
        // Reseed if out of bbox or expired
        if (
          p.age > p.maxAge ||
          p.lng < west || p.lng > east ||
          p.lat < south || p.lat > north
        ) {
          p.lng = west + Math.random() * (east - west);
          p.lat = south + Math.random() * (north - south);
          p.age = 0;
          continue;
        }

        const { speed, ux, uy } = sampleAt(p.lng, p.lat);
        // Step proportional to speed (m/s), but scaled to map units per frame
        const scale = (east - west) / w; // map degrees per CSS px
        const stepPx = Math.max(0.4, Math.min(3, speed * 0.18));
        const dLng =  ux * stepPx * scale;
        // Latitude step needs to account for canvas y axis (+y down) and projection
        const latPxPerDeg = h / (north - south);
        const dLat = -uy * (stepPx / latPxPerDeg);

        const a = map.project([p.lng, p.lat]);
        const newLng = p.lng + dLng;
        const newLat = p.lat + dLat;
        const c = map.project([newLng, newLat]);

        // Color by speed
        const t = Math.min(1, speed / 25);
        const hue = 200 - t * 60; // sky-blue → cyan → near-yellow
        ctx.strokeStyle = `hsla(${hue}, 92%, ${60 + t * 20}%, 0.78)`;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();

        p.lng = newLng;
        p.lat = newLat;
        p.age += 1;
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      map.off('resize', resize);
      map.off('moveend', onMoveEnd);
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
