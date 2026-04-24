'use client';

import { motion } from 'framer-motion';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
} from 'recharts';
import { useWeatherForecast, useMounted } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { Droplets } from 'lucide-react';

export function HumidityWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);
  const mounted = useMounted();

  if (isLoading || !data?.current) return null;

  const humidity = data.current.relative_humidity_2m;
  const chartData = [{ name: 'Humedad', value: humidity, fill: getHumidityColor(humidity) }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <div className="flex items-center gap-2 mb-3">
        <Droplets className="h-4 w-4 text-teal-400" />
        <h3 className="text-sm font-medium text-white/60">Humedad</h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-24 w-24">
          {mounted && (
          <ResponsiveContainer width={96} height={96}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="100%"
              data={chartData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" cornerRadius={10} background={{ fill: 'rgba(255,255,255,0.05)' }} />
            </RadialBarChart>
          </ResponsiveContainer>
          )}
        </div>
        <div>
          <p className="text-3xl font-light text-white">{humidity}%</p>
          <p className="text-xs text-white/40">
            Punto de rocío: {data.hourly?.dew_point_2m?.[0]?.toFixed(1) ?? '--'}°C
          </p>
          <p className="text-xs text-white/30 mt-1">{getHumidityLevel(humidity)}</p>
        </div>
      </div>
    </motion.div>
  );
}

function getHumidityColor(h: number): string {
  if (h < 30) return '#f59e0b';
  if (h < 60) return '#22c55e';
  if (h < 80) return '#3b82f6';
  return '#6366f1';
}

function getHumidityLevel(h: number): string {
  if (h < 25) return 'Muy seco';
  if (h < 40) return 'Seco';
  if (h < 60) return 'Confortable';
  if (h < 80) return 'Húmedo';
  return 'Muy húmedo';
}
