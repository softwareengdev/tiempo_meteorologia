'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shirt } from 'lucide-react';
import { useWeatherForecast } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';

interface Outfit {
  emoji: string;
  title: string;
  description: string;
  tips: string[];
}

function recommend(opts: {
  apparent: number;
  temp: number;
  rain: number;
  wind: number;
  uv: number;
  isDay: boolean;
}): Outfit {
  const { apparent, rain, wind, uv, isDay } = opts;
  const tips: string[] = [];

  let emoji = '👕';
  let title = '';
  let description = '';

  if (apparent < -5) {
    emoji = '🧥';
    title = 'Frío extremo';
    description = 'Plumas, gorro, guantes y capas térmicas';
  } else if (apparent < 5) {
    emoji = '🧣';
    title = 'Mucho frío';
    description = 'Abrigo grueso, bufanda y gorro';
  } else if (apparent < 12) {
    emoji = '🧥';
    title = 'Frío';
    description = 'Abrigo o chaqueta gruesa con jersey';
  } else if (apparent < 18) {
    emoji = '🧶';
    title = 'Fresco';
    description = 'Chaqueta ligera o sudadera';
  } else if (apparent < 24) {
    emoji = '👕';
    title = 'Templado';
    description = 'Camiseta y pantalón largo';
  } else if (apparent < 30) {
    emoji = '🩳';
    title = 'Calor agradable';
    description = 'Ropa ligera, manga corta';
  } else {
    emoji = '🥵';
    title = 'Mucho calor';
    description = 'Ropa muy ligera, transpirable y clara';
    tips.push('Hidrátate cada 20 min');
  }

  if (rain >= 0.5) {
    tips.push('Lleva paraguas o impermeable');
    if (emoji === '👕' || emoji === '🩳') emoji = '☔';
  } else if (rain >= 0.1) {
    tips.push('Posibilidad de chubascos: chubasquero ligero');
  }

  if (wind >= 40) {
    tips.push('Viento fuerte: evita capas sueltas');
  } else if (wind >= 20) {
    tips.push('Cortavientos recomendado');
  }

  if (isDay && uv >= 6) {
    tips.push(`Protector solar SPF 50 (UV ${Math.round(uv)})`);
  } else if (isDay && uv >= 3) {
    tips.push('Gafas de sol y SPF 30');
  }

  if (!isDay && apparent >= 18) {
    tips.push('Capa fina: las noches refrescan');
  }

  return { emoji, title, description, tips };
}

export function OutfitRecommenderWidget() {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { data, isLoading } = useWeatherForecast(selectedLocation);

  const outfit = useMemo<Outfit | null>(() => {
    if (!data?.current || !data.hourly) return null;
    // Próximas 6 h: peor caso de lluvia/viento + UV máx + temp aparente media
    const now = data.current;
    const hourly = data.hourly;
    const slice = 6;
    const apparent = hourly.apparent_temperature.slice(0, slice).reduce((a, b) => a + b, 0) / slice;
    const rain = Math.max(...hourly.precipitation.slice(0, slice));
    const wind = Math.max(now.wind_speed_10m, ...hourly.wind_speed_10m.slice(0, slice));
    const uv = Math.max(...hourly.uv_index.slice(0, slice));
    return recommend({
      apparent,
      temp: now.temperature_2m,
      rain,
      wind,
      uv,
      isDay: now.is_day === 1,
    });
  }, [data]);

  if (isLoading || !outfit) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
        <div className="h-24 animate-pulse rounded-xl bg-white/5" />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 p-4 backdrop-blur-md"
      aria-label="Recomendación de vestimenta"
    >
      <div className="flex items-start gap-3">
        <div className="text-4xl leading-none" aria-hidden>{outfit.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-1.5">
            <Shirt className="h-3.5 w-3.5 text-amber-300/80" />
            <p className="text-[11px] font-medium tracking-wider text-white/60 uppercase">¿Qué me pongo?</p>
          </div>
          <p className="font-display text-base font-semibold text-white">{outfit.title}</p>
          <p className="text-sm text-white/70">{outfit.description}</p>
          {outfit.tips.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {outfit.tips.map((tip) => (
                <li
                  key={tip}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/75"
                >
                  {tip}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.section>
  );
}
