'use client';

import {
  Thermometer, Wind, CloudRain, Cloud, Eye, Sun, Gauge, Droplets, Snowflake, Zap,
} from 'lucide-react';
import { useWeatherStore } from '@/lib/stores';
import type { WeatherLayer } from '@/types';
import { cn } from '@/lib/utils';

const LAYER_CONFIG: {
  id: WeatherLayer;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { id: 'temperature', label: 'Temperatura', icon: Thermometer, color: 'text-red-400' },
  { id: 'wind', label: 'Viento', icon: Wind, color: 'text-cyan-400' },
  { id: 'precipitation', label: 'Precipitación', icon: CloudRain, color: 'text-blue-400' },
  { id: 'clouds', label: 'Nubes', icon: Cloud, color: 'text-gray-400' },
  { id: 'pressure', label: 'Presión', icon: Gauge, color: 'text-purple-400' },
  { id: 'humidity', label: 'Humedad', icon: Droplets, color: 'text-teal-400' },
  { id: 'snow', label: 'Nieve', icon: Snowflake, color: 'text-blue-200' },
  { id: 'visibility', label: 'Visibilidad', icon: Eye, color: 'text-yellow-400' },
  { id: 'uv_index', label: 'Índice UV', icon: Sun, color: 'text-orange-400' },
  { id: 'cape', label: 'CAPE', icon: Zap, color: 'text-amber-400' },
  { id: 'dew_point', label: 'Punto de rocío', icon: Droplets, color: 'text-emerald-400' },
  { id: 'wind_gusts', label: 'Rachas de viento', icon: Wind, color: 'text-indigo-400' },
  { id: 'rain', label: 'Lluvia', icon: CloudRain, color: 'text-sky-400' },
  { id: 'snowfall', label: 'Nevada', icon: Snowflake, color: 'text-slate-300' },
];

export function Sidebar() {
  const { sidebarOpen, activeLayers, toggleLayer, selectedModel, setSelectedModel } =
    useWeatherStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed top-14 bottom-0 left-0 z-30 flex w-64 flex-col overflow-y-auto border-r border-white/5 bg-gray-950/90 backdrop-blur-xl">
      {/* Model selector */}
      <div className="border-b border-white/5 p-4">
        <label className="mb-2 block text-xs font-semibold tracking-wider text-white/50 uppercase">
          Modelo
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50"
        >
          <option value="best_match">Mejor combinación</option>
          <option value="ecmwf_ifs025">ECMWF IFS (9km)</option>
          <option value="icon_global">ICON Global</option>
          <option value="gfs_global">GFS Global</option>
          <option value="jma_gsm">JMA GSM</option>
          <option value="gem_global">GEM Global</option>
        </select>
      </div>

      {/* Weather layers */}
      <div className="flex-1 p-4">
        <h3 className="mb-3 text-xs font-semibold tracking-wider text-white/50 uppercase">
          Capas meteorológicas
        </h3>
        <div className="space-y-1">
          {LAYER_CONFIG.map(({ id, label, icon: Icon, color }) => {
            const active = activeLayers.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleLayer(id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/80',
                )}
              >
                <Icon className={cn('h-4 w-4', active ? color : 'text-white/30')} />
                <span>{label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/5 p-4">
        <p className="text-center text-xs text-white/30">
          AetherCast v1.0 — Datos: Open-Meteo
        </p>
      </div>
    </aside>
  );
}
