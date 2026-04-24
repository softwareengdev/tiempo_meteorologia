'use client';

import { motion } from 'framer-motion';
import {
  Thermometer, Droplets, Wind, Eye, Gauge, Sun, Share2,
} from 'lucide-react';
import { useWeatherForecast, useShare, useHaptic } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { getWeatherDescription, getWindDirection } from '@/lib/weather';
import { Skeleton } from '@/components/ui/skeleton';
import { WeatherIcon } from '@/components/icons';

export function CurrentWeatherWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const locationName = useWeatherStore((s) => s.locationName);
  const { data, isLoading, error } = useWeatherForecast(selectedLocation);
  const share = useShare();
  const haptic = useHaptic();

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-24 w-40" />
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
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
  const next6h = data.hourly?.precipitation_probability?.slice(0, 6) ?? [];
  const maxPrecipProb = next6h.length ? Math.max(...next6h) : 0;
  const hi = data.daily?.temperature_2m_max?.[0];
  const lo = data.daily?.temperature_2m_min?.[0];

  const onShare = async () => {
    haptic('medium');
    await share({
      title: `Tiempo en ${locationName}`,
      text: `${Math.round(current.temperature_2m)}°C · ${getWeatherDescription(current.weather_code)} · AetherCast`,
    });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label={`Tiempo actual en ${locationName}`}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-white/[0.04] to-purple-500/10 p-5 backdrop-blur-xl"
    >
      {/* Soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-10 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl"
      />

      <header className="relative mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium text-white/75">{locationName}</h2>
          <p className="text-xs text-white/45">
            {new Date(current.time).toLocaleString('es-ES', {
              weekday: 'long', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <button
          onClick={onShare}
          aria-label="Compartir el tiempo de esta ubicación"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white active:scale-95"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </header>

      <div className="relative flex items-end gap-4">
        <div className="flex items-start">
          <span className="font-display text-7xl leading-none font-light tracking-tight text-white sm:text-8xl">
            {Math.round(current.temperature_2m)}
          </span>
          <span className="mt-2 text-2xl text-white/50">°</span>
        </div>
          <div className="mb-2 flex flex-col items-end">
            <WeatherIcon code={current.weather_code} isDay={isDay} size={80} className="drop-shadow-md sm:size-24" />
            {(hi != null || lo != null) && (
            <p className="mt-1 font-mono text-xs text-white/55">
              {hi != null && <span>↑ {Math.round(hi)}°</span>}
              {hi != null && lo != null && <span className="mx-1 text-white/25">·</span>}
              {lo != null && <span>↓ {Math.round(lo)}°</span>}
            </p>
          )}
        </div>
      </div>

      <p className="mt-2 text-base font-medium text-white/85">
        {getWeatherDescription(current.weather_code)}
      </p>
      <p className="text-sm text-white/55">
        Sensación térmica <span className="font-mono text-white/80">{Math.round(current.apparent_temperature)}°</span>
      </p>

      {/* At-a-glance ribbon: rain · wind · UV-ish */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <GlanceTile label="Lluvia 6 h" value={`${maxPrecipProb}%`} accent="text-sky-300" icon="🌧️" />
        <GlanceTile
          label="Viento"
          value={`${Math.round(current.wind_speed_10m)}`}
          unit="km/h"
          sub={getWindDirection(current.wind_direction_10m)}
          accent="text-cyan-300"
          icon="💨"
        />
        <GlanceTile
          label="Humedad"
          value={`${current.relative_humidity_2m}`}
          unit="%"
          accent="text-teal-300"
          icon="💧"
        />
      </div>

      <details className="group mt-4">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/[0.06]">
          <span>Más métricas</span>
          <span className="transition-transform group-open:rotate-180" aria-hidden>▾</span>
        </summary>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <MetricCard icon={Droplets} label="Humedad" value={`${current.relative_humidity_2m}%`} color="text-teal-400" />
          <MetricCard icon={Wind} label="Viento" value={`${Math.round(current.wind_speed_10m)} km/h`} sublabel={getWindDirection(current.wind_direction_10m)} color="text-cyan-400" />
          <MetricCard icon={Gauge} label="Presión" value={`${Math.round(current.pressure_msl)} hPa`} color="text-purple-400" />
          <MetricCard icon={Eye} label="Nubes" value={`${current.cloud_cover}%`} color="text-yellow-400" />
          <MetricCard icon={Thermometer} label="Precip." value={`${current.precipitation} mm`} color="text-blue-400" />
          <MetricCard icon={Sun} label="Rachas" value={`${Math.round(current.wind_gusts_10m)} km/h`} color="text-orange-400" />
        </div>
      </details>
    </motion.section>
  );
}

function GlanceTile({
  label, value, unit, sub, accent, icon,
}: {
  label: string; value: string; unit?: string; sub?: string; accent: string; icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2.5">
      <p className="mb-0.5 text-base" aria-hidden>{icon}</p>
      <p className="text-[10px] tracking-wide text-white/45 uppercase">{label}</p>
      <p className={`font-mono text-lg leading-none font-semibold ${accent}`}>
        {value}
        {unit && <span className="ml-0.5 text-[10px] text-white/40">{unit}</span>}
      </p>
      {sub && <p className="mt-0.5 text-[10px] text-white/40">{sub}</p>}
    </div>
  );
}

function MetricCard({
  icon: Icon, label, value, sublabel, color,
}: {
  icon: React.ElementType; label: string; value: string; sublabel?: string; color: string;
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
