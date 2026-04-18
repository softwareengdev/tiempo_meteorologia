'use client';

import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wind, Eye, Gauge, Sun } from 'lucide-react';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { getWeatherDescription, getWeatherIcon, getWindDirection } from '@/lib/weather';

export function CurrentWeatherWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const locationName = useWeatherStore((s) => s.locationName);
  const { data, isLoading, error } = useWeatherForecast(selectedLocation);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="mt-4 h-12 w-24 rounded bg-white/10" />
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.current) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-md">
        <p className="text-sm text-red-400">Error al cargar el tiempo</p>
      </div>
    );
  }

  const current = data.current;
  const isDay = current.is_day === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-medium text-white/60">{locationName}</h2>
          <p className="text-xs text-white/30">
            {new Date(current.time).toLocaleString('es-ES', {
              weekday: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span className="text-4xl">{getWeatherIcon(current.weather_code, isDay)}</span>
      </div>

      <div className="mb-1 flex items-end gap-2">
        <span className="text-5xl font-light text-white">
          {Math.round(current.temperature_2m)}°
        </span>
        <span className="mb-2 text-lg text-white/40">C</span>
      </div>
      <p className="mb-1 text-sm text-white/60">
        {getWeatherDescription(current.weather_code)}
      </p>
      <p className="text-xs text-white/30">
        Sensación: {Math.round(current.apparent_temperature)}°C
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <MetricCard icon={Droplets} label="Humedad" value={`${current.relative_humidity_2m}%`} color="text-teal-400" />
        <MetricCard icon={Wind} label="Viento" value={`${Math.round(current.wind_speed_10m)} km/h`} sublabel={getWindDirection(current.wind_direction_10m)} color="text-cyan-400" />
        <MetricCard icon={Gauge} label="Presión" value={`${Math.round(current.pressure_msl)} hPa`} color="text-purple-400" />
        <MetricCard icon={Eye} label="Nubes" value={`${current.cloud_cover}%`} color="text-yellow-400" />
        <MetricCard icon={Thermometer} label="Rocío" value={`${current.precipitation} mm`} color="text-blue-400" />
        <MetricCard icon={Sun} label="Rachas" value={`${Math.round(current.wind_gusts_10m)} km/h`} color="text-orange-400" />
      </div>
    </motion.div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sublabel?: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
      <Icon className={`mb-1 h-3.5 w-3.5 ${color}`} />
      <p className="text-xs text-white/40">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
      {sublabel && <p className="text-xs text-white/30">{sublabel}</p>}
    </div>
  );
}
