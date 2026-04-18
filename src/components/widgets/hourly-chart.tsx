'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';

export function HourlyChartWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  if (isLoading || !data?.hourly) {
    return (
      <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-4 h-48 rounded-lg bg-white/5" />
      </div>
    );
  }

  const chartData = data.hourly.time.slice(0, 48).map((time, i) => ({
    time: new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    temp: data.hourly!.temperature_2m[i],
    precip: data.hourly!.precipitation[i],
    wind: data.hourly!.wind_speed_10m[i],
    humidity: data.hourly!.relative_humidity_2m[i],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <h3 className="mb-4 text-sm font-medium text-white/60">
        Pronóstico por Horas — Próximas 48h
      </h3>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.2)"
              fontSize={10}
              tickLine={false}
              interval={5}
            />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15,23,42,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'white',
              }}
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  temp: '🌡️ Temperatura',
                  precip: '🌧️ Precipitación',
                  wind: '💨 Viento',
                };
                const units: Record<string, string> = {
                  temp: '°C',
                  precip: 'mm',
                  wind: 'km/h',
                };
                const n = String(name);
                const v = Number(value);
                return [`${v.toFixed(1)} ${units[n] || ''}`, labels[n] || n];
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              fill="url(#tempGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="precip"
              stroke="#38bdf8"
              fill="url(#precipGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
