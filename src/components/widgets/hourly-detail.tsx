'use client';

import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { WeatherIcon } from '@/components/icons';

export function HourlyDetailWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  if (isLoading || !data?.hourly) {
    return (
      <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="mt-4 space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-white/5" />)}
        </div>
      </div>
    );
  }

  const hourly = data.hourly;
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(
    (t) => new Date(t) >= now,
  );
  const startIndex = Math.max(0, currentHourIndex);
  const hours = hourly.time.slice(startIndex, startIndex + 24);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <h3 className="mb-4 text-sm font-medium text-white/60">
        Detalle por Horas — Próximas 24h
      </h3>

      <div className="space-y-1 max-h-72 overflow-y-auto">
        {hours.map((time, idx) => {
          const i = startIndex + idx;
          const date = new Date(time);
          const hour = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
          const isNow = idx === 0;

          return (
            <div
              key={time}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${
                isNow ? 'bg-sky-500/10 border border-sky-500/20' : 'hover:bg-white/5'
              }`}
            >
              <span className="w-12 font-medium text-white/70">
                {isNow ? 'Ahora' : hour}
              </span>
              <WeatherIcon code={hourly.weather_code[i]} isDay={hourly.temperature_2m[i] > 0} size={22} animated={isNow} />
              <span className="w-10 text-right font-medium text-white">
                {Math.round(hourly.temperature_2m[i])}°
              </span>
              <div className="flex flex-1 items-center gap-2 text-white/40">
                <Wind className="h-3 w-3" />
                <span>{Math.round(hourly.wind_speed_10m[i])} km/h</span>
              </div>
              {hourly.precipitation_probability[i] > 0 && (
                <span className="text-sky-400">
                  💧{hourly.precipitation_probability[i]}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
