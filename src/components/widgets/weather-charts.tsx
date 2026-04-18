'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';

export function WindChartWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  if (isLoading || !data?.hourly) return null;

  const chartData = data.hourly.time.slice(0, 48).map((time, i) => ({
    time: new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit' }),
    speed: Math.round(data.hourly!.wind_speed_10m[i]),
    gusts: Math.round(data.hourly!.wind_gusts_10m[i]),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <h3 className="mb-4 text-sm font-medium text-white/60">
        Viento y Rachas — 48h
      </h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} interval={5} />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15,23,42,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '11px',
                color: 'white',
              }}
            />
            <Bar dataKey="speed" fill="#22d3ee" radius={[2, 2, 0, 0]} name="Viento (km/h)" />
            <Bar dataKey="gusts" fill="#6366f1" radius={[2, 2, 0, 0]} name="Rachas (km/h)" opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export function PressureChartWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  if (isLoading || !data?.hourly) return null;

  const chartData = data.hourly.time.slice(0, 48).map((time, i) => ({
    time: new Date(time).toLocaleTimeString('es-ES', { hour: '2-digit' }),
    pressure: Math.round(data.hourly!.pressure_msl[i]),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <h3 className="mb-4 text-sm font-medium text-white/60">
        Presión Atmosférica — 48h
      </h3>
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} interval={5} />
            <YAxis stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15,23,42,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '11px',
                color: 'white',
              }}
            />
            <Line type="monotone" dataKey="pressure" stroke="#a78bfa" strokeWidth={2} dot={false} name="hPa" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
