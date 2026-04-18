'use client';

import { motion } from 'framer-motion';
import { Waves } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useWeatherStore } from '@/lib/stores';

interface MarineData {
  current?: {
    wave_height: number;
    wave_direction: number;
    wave_period: number;
    swell_wave_height: number;
    swell_wave_period: number;
    sea_surface_temperature?: number;
  };
}

export function MarineWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['marine', selectedLocation?.latitude, selectedLocation?.longitude],
    queryFn: async (): Promise<MarineData | null> => {
      if (!selectedLocation) return null;
      const params = new URLSearchParams({
        latitude: selectedLocation.latitude.toString(),
        longitude: selectedLocation.longitude.toString(),
        current: 'wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period,sea_surface_temperature',
        timezone: 'auto',
      });
      const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!selectedLocation,
    staleTime: 30 * 60 * 1000,
    retry: 0,
  });

  if (isLoading) return null;
  if (isError || !data?.current?.wave_height) return null; // Inland location

  const c = data.current;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-600/5 p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-2">
        <Waves className="h-4 w-4 text-cyan-300" />
        <h3 className="text-sm font-medium text-white/60">Marítimo · Olas</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Altura ola" value={`${c.wave_height?.toFixed(1)} m`} />
        <Stat label="Periodo" value={`${c.wave_period?.toFixed(1)} s`} />
        <Stat label="Mar de fondo" value={`${c.swell_wave_height?.toFixed(1)} m`} />
        <Stat label="Periodo fondo" value={`${c.swell_wave_period?.toFixed(1)} s`} />
        {c.sea_surface_temperature !== undefined && (
          <Stat label="Tª agua" value={`${c.sea_surface_temperature?.toFixed(1)}°C`} colSpan />
        )}
      </div>

      <p className="mt-3 text-center text-xs text-white/30">
        Solo disponible en zonas costeras
      </p>
    </motion.div>
  );
}

function Stat({ label, value, colSpan }: { label: string; value: string; colSpan?: boolean }) {
  return (
    <div className={`rounded-lg border border-white/5 bg-white/[0.03] p-3 ${colSpan ? 'col-span-2 text-center' : ''}`}>
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-0.5 font-mono text-base font-semibold text-white">{value}</p>
    </div>
  );
}
