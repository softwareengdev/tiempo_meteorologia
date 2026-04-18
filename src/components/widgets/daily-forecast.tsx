'use client';

import { motion } from 'framer-motion';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { getWeatherIcon, getWeatherDescription } from '@/lib/weather';

export function DailyForecastWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  if (isLoading || !data?.daily) {
    return (
      <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-4 space-y-3">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  const daily = data.daily;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <h3 className="mb-4 text-sm font-medium text-white/60">
        Pronóstico 7 Días
      </h3>

      <div className="space-y-2">
        {daily.time.map((day, i) => {
          const date = new Date(day);
          const isToday = i === 0;
          const dayName = isToday
            ? 'Hoy'
            : date.toLocaleDateString('es-ES', { weekday: 'short' });

          return (
            <div
              key={day}
              className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/5"
            >
              <span className="w-10 text-sm font-medium capitalize text-white/70">
                {dayName}
              </span>
              <span className="text-xl">
                {getWeatherIcon(daily.weather_code[i], true)}
              </span>
              <span className="flex-1 text-xs text-white/40">
                {getWeatherDescription(daily.weather_code[i])}
              </span>
              {daily.precipitation_probability_max[i] > 0 && (
                <span className="text-xs text-sky-400">
                  💧 {daily.precipitation_probability_max[i]}%
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-white">
                  {Math.round(daily.temperature_2m_max[i])}°
                </span>
                <span className="text-xs text-white/40">
                  {Math.round(daily.temperature_2m_min[i])}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
