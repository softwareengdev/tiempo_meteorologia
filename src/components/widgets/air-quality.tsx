'use client';

import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useWeatherStore } from '@/lib/stores';

interface AirQualityData {
  current: {
    european_aqi: number;
    pm2_5: number;
    pm10: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    ozone: number;
    carbon_monoxide: number;
  };
}

const AQI_LEVELS = [
  { max: 20, label: 'Excelente', color: 'from-emerald-500 to-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { max: 40, label: 'Bueno', color: 'from-lime-500 to-emerald-400', text: 'text-lime-400', bg: 'bg-lime-500/10' },
  { max: 60, label: 'Moderado', color: 'from-yellow-500 to-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  { max: 80, label: 'Pobre', color: 'from-orange-500 to-orange-400', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  { max: 100, label: 'Muy pobre', color: 'from-red-500 to-rose-400', text: 'text-red-400', bg: 'bg-red-500/10' },
  { max: Infinity, label: 'Extremadamente pobre', color: 'from-purple-700 to-rose-700', text: 'text-purple-400', bg: 'bg-purple-500/10' },
];

function getLevel(aqi: number) {
  return AQI_LEVELS.find((l) => aqi <= l.max) ?? AQI_LEVELS[AQI_LEVELS.length - 1];
}

export function AirQualityWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);

  const { data, isLoading } = useQuery({
    queryKey: ['air-quality', selectedLocation?.latitude, selectedLocation?.longitude],
    queryFn: async (): Promise<AirQualityData | null> => {
      if (!selectedLocation) return null;
      const params = new URLSearchParams({
        latitude: selectedLocation.latitude.toString(),
        longitude: selectedLocation.longitude.toString(),
        current: 'european_aqi,pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,ozone,carbon_monoxide',
        timezone: 'auto',
      });
      const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!selectedLocation,
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-6 h-32 rounded-xl bg-white/5" />
      </div>
    );
  }

  if (!data?.current) return null;

  const aqi = data.current.european_aqi;
  const level = getLevel(aqi);
  const pollutants = [
    { label: 'PM2.5', value: data.current.pm2_5, unit: 'μg/m³', max: 25 },
    { label: 'PM10', value: data.current.pm10, unit: 'μg/m³', max: 50 },
    { label: 'NO₂', value: data.current.nitrogen_dioxide, unit: 'μg/m³', max: 200 },
    { label: 'O₃', value: data.current.ozone, unit: 'μg/m³', max: 180 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-2">
        <Wind className="h-4 w-4 text-cyan-400" />
        <h3 className="text-sm font-medium text-white/60">Calidad del Aire</h3>
      </div>

      <div className={`flex items-center gap-4 rounded-xl p-4 ${level.bg}`}>
        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${level.color} text-2xl font-bold text-white shadow-glow`}>
          {Math.round(aqi)}
        </div>
        <div>
          <p className={`text-lg font-semibold ${level.text}`}>{level.label}</p>
          <p className="text-xs text-white/50">Índice europeo de calidad del aire</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {pollutants.map((p) => {
          const pct = Math.min(100, (p.value / p.max) * 100);
          return (
            <div key={p.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-white/50">{p.label}</span>
                <span className="font-mono text-sm font-semibold text-white">{p.value?.toFixed(1)}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${pct < 50 ? 'from-emerald-500 to-lime-400' : pct < 80 ? 'from-amber-500 to-orange-400' : 'from-red-500 to-rose-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-white/30">{p.unit}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
