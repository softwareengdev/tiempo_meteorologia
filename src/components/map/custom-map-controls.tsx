'use client';

import { useEffect, useState } from 'react';
import { Plus, Minus, Compass, LocateFixed, Loader2 } from 'lucide-react';
import type maplibregl from 'maplibre-gl';
import { useWeatherStore } from '@/lib/stores';
import { useHaptic } from '@/lib/hooks';
import { cn } from '@/lib/utils';

interface Props {
  map: maplibregl.Map | null;
}

/**
 * CustomMapControls — replaces MapLibre's default Navigation + Geolocate
 * controls with a refined glass stack pinned to the bottom-right of the map.
 * Always sits above the bottom-sheet panel (and the mobile bottom-nav) thanks
 * to the `--panel-h` CSS variable published by `WidgetPanel`.
 */
export function CustomMapControls({ map }: Props) {
  const haptic = useHaptic();
  const setSelectedLocation = useWeatherStore((s) => s.setSelectedLocation);
  const [bearing, setBearing] = useState(0);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!map) return;
    const onRotate = () => setBearing(map.getBearing());
    map.on('rotate', onRotate);
    map.on('rotateend', onRotate);
    return () => {
      map.off('rotate', onRotate);
      map.off('rotateend', onRotate);
    };
  }, [map]);

  const zoomIn = () => { haptic('light'); map?.zoomIn(); };
  const zoomOut = () => { haptic('light'); map?.zoomOut(); };
  const resetCompass = () => { haptic('light'); map?.easeTo({ bearing: 0, pitch: 0, duration: 400 }); };
  const locate = () => {
    if (!map || !('geolocation' in navigator) || locating) return;
    haptic('select');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedLocation({ latitude, longitude }, 'Tu ubicación');
        map.flyTo({ center: [longitude, latitude], zoom: Math.max(map.getZoom(), 11), duration: 1200 });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
    );
  };

  const Btn = ({
    onClick, label, children, className,
  }: { onClick: () => void; label: string; children: React.ReactNode; className?: string }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-9 w-9 items-center justify-center text-white/85 transition-colors',
        'hover:bg-white/10 hover:text-white active:bg-white/15',
        'first:rounded-t-xl last:rounded-b-xl',
        className,
      )}
    >
      {children}
    </button>
  );

  return (
    <div
      className="pointer-events-auto absolute right-2 z-20 flex flex-col rounded-xl border border-white/12 bg-[#0b1020]/65 shadow-xl backdrop-blur-md backdrop-saturate-150 divide-y divide-white/8"
      style={{ bottom: 'calc(var(--panel-h, var(--bottom-nav-h, 0px)) + 0.75rem)' }}
    >
      <Btn onClick={zoomIn} label="Acercar"><Plus className="h-4 w-4" /></Btn>
      <Btn onClick={zoomOut} label="Alejar"><Minus className="h-4 w-4" /></Btn>
      <Btn onClick={resetCompass} label="Norte arriba" className="text-white/80">
        <Compass className="h-4 w-4 transition-transform" style={{ transform: `rotate(${-bearing}deg)` }} />
      </Btn>
      <Btn onClick={locate} label="Mi ubicación" className={locating ? 'text-sky-300' : ''}>
        {locating
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <LocateFixed className="h-4 w-4" />}
      </Btn>
    </div>
  );
}
