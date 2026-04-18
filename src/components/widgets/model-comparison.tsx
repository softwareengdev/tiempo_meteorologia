'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useWeatherStore } from '@/lib/stores';
import { Activity } from 'lucide-react';

const MODELS = [
  { id: 'ecmwf_ifs025', name: 'ECMWF IFS', color: '#ef4444' },
  { id: 'icon_global', name: 'ICON Global', color: '#3b82f6' },
  { id: 'gfs_global', name: 'GFS Global', color: '#22c55e' },
  { id: 'jma_gsm', name: 'JMA GSM', color: '#f59e0b' },
  { id: 'gem_global', name: 'GEM Global', color: '#8b5cf6' },
];

type CompareMetric = 'temperature_2m' | 'precipitation' | 'wind_speed_10m';

const METRICS: { id: CompareMetric; label: string; unit: string }[] = [
  { id: 'temperature_2m', label: 'Temperatura', unit: '°C' },
  { id: 'precipitation', label: 'Precipitación', unit: 'mm' },
  { id: 'wind_speed_10m', label: 'Viento', unit: 'km/h' },
];

export function ModelComparisonWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const [metric, setMetric] = useState<CompareMetric>('temperature_2m');
  const [activeModels, setActiveModels] = useState<string[]>(['ecmwf_ifs025', 'icon_global', 'gfs_global']);

  const { data: modelData, isLoading } = useQuery({
    queryKey: ['model-comparison', selectedLocation?.latitude, selectedLocation?.longitude, activeModels.join(',')],
    queryFn: async () => {
      if (!selectedLocation) return null;
      const results: Record<string, { time: string[]; temperature_2m: number[]; precipitation: number[]; wind_speed_10m: number[] }> = {};

      await Promise.all(
        activeModels.map(async (modelId) => {
          const params = new URLSearchParams({
            latitude: selectedLocation.latitude.toString(),
            longitude: selectedLocation.longitude.toString(),
            hourly: 'temperature_2m,precipitation,wind_speed_10m',
            models: modelId,
            forecast_days: '5',
            timezone: 'auto',
          });
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
          if (res.ok) {
            const data = await res.json();
            if (data.hourly) {
              results[modelId] = data.hourly;
            }
          }
        }),
      );

      return results;
    },
    enabled: !!selectedLocation && activeModels.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  const toggleModel = (id: string) => {
    setActiveModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const chartData = (() => {
    if (!modelData) return [];
    const firstModel = activeModels.find((m) => modelData[m]);
    if (!firstModel) return [];

    return modelData[firstModel].time.slice(0, 120).map((time, i) => {
      const point: Record<string, string | number> = {
        time: new Date(time).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit' }),
      };
      for (const model of activeModels) {
        if (modelData[model]) {
          point[model] = modelData[model][metric]?.[i] ?? 0;
        }
      }
      return point;
    });
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-sky-400" />
        <h3 className="text-sm font-medium text-white/60">
          Comparativa Multi-Modelo
        </h3>
      </div>

      {/* Metric selector */}
      <div className="mb-4 flex gap-2">
        {METRICS.map((m) => (
          <button
            key={m.id}
            onClick={() => setMetric(m.id)}
            className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
              metric === m.id
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-white/5 text-white/40 hover:text-white/70'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Model toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => toggleModel(model.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-colors ${
              activeModels.includes(model.id)
                ? 'bg-white/10 text-white'
                : 'bg-white/5 text-white/30'
            }`}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activeModels.includes(model.id) ? model.color : 'rgba(255,255,255,0.2)' }}
            />
            {model.name}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-white/30">Cargando modelos...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.15)" fontSize={8} tickLine={false} interval={11} />
              <YAxis stroke="rgba(255,255,255,0.15)" fontSize={8} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: 'white',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}
              />
              {MODELS.filter((m) => activeModels.includes(m.id)).map((model) => (
                <Line
                  key={model.id}
                  type="monotone"
                  dataKey={model.id}
                  stroke={model.color}
                  strokeWidth={1.5}
                  dot={false}
                  name={model.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="mt-3 text-center text-xs text-white/20">
        {METRICS.find((m) => m.id === metric)?.unit} — Datos: Open-Meteo
      </p>
    </motion.div>
  );
}
