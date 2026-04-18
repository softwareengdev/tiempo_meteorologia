'use client';

import { motion } from 'framer-motion';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { Sunrise, Sunset, Sun, Shield } from 'lucide-react';

export function SunriseSunsetWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  if (isLoading || !data?.daily) return null;

  const sunrise = new Date(data.daily.sunrise[0]);
  const sunset = new Date(data.daily.sunset[0]);
  const dayLength = (sunset.getTime() - sunrise.getTime()) / 1000 / 60 / 60;
  const uvMax = data.daily.uv_index_max[0];

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { label: 'Bajo', color: 'text-green-400', bg: 'bg-green-400/20' };
    if (uv <= 5) return { label: 'Moderado', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (uv <= 7) return { label: 'Alto', color: 'text-orange-400', bg: 'bg-orange-400/20' };
    if (uv <= 10) return { label: 'Muy alto', color: 'text-red-400', bg: 'bg-red-400/20' };
    return { label: 'Extremo', color: 'text-purple-400', bg: 'bg-purple-400/20' };
  };

  const uvInfo = getUVLevel(uvMax);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <h3 className="mb-4 text-sm font-medium text-white/60">Sol y UV</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-400/10 p-2">
            <Sunrise className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-white/40">Amanecer</p>
            <p className="text-sm font-medium text-white">
              {sunrise.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-orange-400/10 p-2">
            <Sunset className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-xs text-white/40">Atardecer</p>
            <p className="text-sm font-medium text-white">
              {sunset.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-400/10 p-2">
            <Sun className="h-5 w-5 text-sky-400" />
          </div>
          <div>
            <p className="text-xs text-white/40">Horas de sol</p>
            <p className="text-sm font-medium text-white">
              {dayLength.toFixed(1)}h
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`rounded-xl ${uvInfo.bg} p-2`}>
            <Shield className={`h-5 w-5 ${uvInfo.color}`} />
          </div>
          <div>
            <p className="text-xs text-white/40">UV Máx</p>
            <p className={`text-sm font-medium ${uvInfo.color}`}>
              {uvMax} — {uvInfo.label}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
