'use client';

import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useWeatherStore } from '@/lib/stores';
import { useMounted } from '@/lib/hooks';
import { TrendingUp } from 'lucide-react';

export function ClimateHistoryWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const mounted = useMounted();

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['climate-history', selectedLocation?.latitude, selectedLocation?.longitude],
    queryFn: async () => {
      if (!selectedLocation) return null;

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const params = new URLSearchParams({
        latitude: selectedLocation.latitude.toString(),
        longitude: selectedLocation.longitude.toString(),
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone: 'auto',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      });

      const res = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!selectedLocation,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="h-4 w-40 rounded bg-white/10" />
        <div className="mt-4 h-48 rounded-lg bg-white/5" />
      </div>
    );
  }

  if (!historyData?.daily) return null;

  const chartData = historyData.daily.time.map((time: string, i: number) => ({
    date: new Date(time).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
    max: historyData.daily.temperature_2m_max[i],
    min: historyData.daily.temperature_2m_min[i],
    precip: historyData.daily.precipitation_sum[i],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-emerald-400" />
        <h3 className="text-sm font-medium text-white/60">
          Histórico Últimos 30 Días
        </h3>
      </div>

      <div className="h-48">
        {mounted && (
        <ResponsiveContainer width="100%" height={192}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.15)" fontSize={8} tickLine={false} interval={4} />
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
            <Line type="monotone" dataKey="max" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Máx °C" />
            <Line type="monotone" dataKey="min" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Mín °C" />
            <Line type="monotone" dataKey="precip" stroke="#22d3ee" strokeWidth={1} dot={false} name="Precip mm" strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>

      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-white/30">
        <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded bg-red-500" /> Máxima</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded bg-blue-500" /> Mínima</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded bg-cyan-400" /> Precip.</span>
      </div>
    </motion.div>
  );
}
