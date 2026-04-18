'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Info, AlertOctagon, ShieldAlert } from 'lucide-react';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';

interface WeatherAlert {
  type: 'extreme' | 'severe' | 'moderate' | 'minor';
  title: string;
  description: string;
  icon: React.ElementType;
}

function generateAlerts(data: { current?: { weather_code: number; wind_speed_10m: number; wind_gusts_10m: number; temperature_2m: number; precipitation: number }; daily?: { uv_index_max: number[]; precipitation_sum: number[]; temperature_2m_max: number[]; temperature_2m_min: number[] } }): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  if (!data.current) return alerts;

  const { weather_code, wind_speed_10m, wind_gusts_10m, temperature_2m, precipitation } = data.current;

  if (weather_code >= 95) {
    alerts.push({
      type: 'extreme',
      title: '⛈️ Tormenta eléctrica',
      description: 'Tormenta activa en la zona. Busca refugio en interior.',
      icon: AlertOctagon,
    });
  }

  if (wind_gusts_10m > 80) {
    alerts.push({
      type: 'severe',
      title: '🌪️ Rachas de viento extremas',
      description: `Rachas de ${Math.round(wind_gusts_10m)} km/h. Evita desplazamientos innecesarios.`,
      icon: ShieldAlert,
    });
  } else if (wind_speed_10m > 50) {
    alerts.push({
      type: 'moderate',
      title: '💨 Viento fuerte',
      description: `Viento de ${Math.round(wind_speed_10m)} km/h. Ten precaución al aire libre.`,
      icon: AlertTriangle,
    });
  }

  if (temperature_2m > 38) {
    alerts.push({
      type: 'severe',
      title: '🌡️ Ola de calor',
      description: `Temperatura de ${Math.round(temperature_2m)}°C. Hidrátate y evita el sol directo.`,
      icon: ShieldAlert,
    });
  } else if (temperature_2m < -10) {
    alerts.push({
      type: 'severe',
      title: '❄️ Frío extremo',
      description: `Temperatura de ${Math.round(temperature_2m)}°C. Riesgo de hipotermia.`,
      icon: ShieldAlert,
    });
  }

  if (precipitation > 20) {
    alerts.push({
      type: 'moderate',
      title: '🌧️ Lluvia intensa',
      description: `Precipitación de ${precipitation.toFixed(1)} mm. Posible acumulación.`,
      icon: AlertTriangle,
    });
  }

  if ((data.daily?.uv_index_max?.[0] ?? 0) > 8) {
    alerts.push({
      type: 'moderate',
      title: '☀️ UV muy alto',
      description: `Índice UV máximo de ${data.daily!.uv_index_max[0]}. Usa protector solar.`,
      icon: AlertTriangle,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: 'minor',
      title: '✅ Sin alertas',
      description: 'No hay alertas meteorológicas activas para esta ubicación.',
      icon: Info,
    });
  }

  return alerts;
}

const alertStyles: Record<string, string> = {
  extreme: 'border-red-500/30 bg-red-500/10',
  severe: 'border-orange-500/30 bg-orange-500/10',
  moderate: 'border-yellow-500/30 bg-yellow-500/10',
  minor: 'border-green-500/30 bg-green-500/10',
};

const alertIconColors: Record<string, string> = {
  extreme: 'text-red-400',
  severe: 'text-orange-400',
  moderate: 'text-yellow-400',
  minor: 'text-green-400',
};

export function AlertsWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  if (isLoading || !data) return null;

  const alerts = generateAlerts(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-md"
    >
      <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-white/60">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        Alertas Meteorológicas
      </h3>

      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const Icon = alert.icon;
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 ${alertStyles[alert.type]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${alertIconColors[alert.type]}`} />
                <div>
                  <p className="text-sm font-medium text-white">{alert.title}</p>
                  <p className="mt-1 text-xs text-white/60">{alert.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
