'use client';

import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line,
} from 'recharts';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';

export function MeteogramWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const locationName = useWeatherStore((s) => s.locationName);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  if (isLoading || !data?.hourly) {
    return (
      <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-4 h-64 rounded-lg bg-white/5" />
      </div>
    );
  }

  const chartData = data.hourly.time.slice(0, 72).map((time, i) => {
    const date = new Date(time);
    return {
      time: `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}h`,
      temp: data.hourly!.temperature_2m[i],
      humidity: data.hourly!.relative_humidity_2m[i],
      precip: data.hourly!.precipitation[i],
      wind: data.hourly!.wind_speed_10m[i],
      clouds: data.hourly!.cloud_cover[i],
      pressure: data.hourly!.pressure_msl[i],
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/60">
          Meteograma — {locationName}
        </h3>
        <span className="text-xs text-white/30">72 horas</span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="meteogramTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="meteogramPrecip" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="meteogramClouds" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.15)" fontSize={8} tickLine={false} interval={7} />
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
            <Area type="monotone" dataKey="clouds" stroke="#94a3b8" fill="url(#meteogramClouds)" strokeWidth={1} name="Nubes %" />
            <Area type="monotone" dataKey="precip" stroke="#3b82f6" fill="url(#meteogramPrecip)" strokeWidth={1.5} name="Precip mm" />
            <Area type="monotone" dataKey="temp" stroke="#ef4444" fill="url(#meteogramTemp)" strokeWidth={2} name="Temp °C" />
            <Line type="monotone" dataKey="wind" stroke="#22d3ee" strokeWidth={1} dot={false} name="Viento km/h" strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-red-500" /> Temperatura</span>
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-blue-500" /> Precipitación</span>
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-cyan-400 border border-dashed" /> Viento</span>
        <span className="flex items-center gap-1"><span className="h-2 w-4 rounded bg-gray-400/30" /> Nubes</span>
      </div>
    </motion.div>
  );
}
