'use client';

import dynamic from 'next/dynamic';
import {
  AlertsWidget,
  CurrentWeatherWidget,
  AirQualityWidget,
  AstronomyWidget,
  MarineWidget,
} from '@/components/widgets';
import {
  ModelComparisonWidget,
  ClimateHistoryWidget,
  MeteogramWidget,
} from '@/components/widgets/lazy';

const WeatherMap = dynamic(() => import('@/components/map/weather-map').then((m) => m.WeatherMap), { ssr: false });

export default function ProPage() {
  return (
    <div className="flex h-dvh flex-col bg-gradient-to-br from-[#0b1020] via-[#0f1730] to-[#0b1020]">
      <main className="flex flex-1 overflow-hidden pt-14 pb-16 lg:pb-0">
        {/* Map half */}
        <div className="hidden w-1/2 lg:block">
          <WeatherMap />
        </div>

        {/* Pro panel */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4 lg:w-1/2">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-lg bg-gradient-to-r from-purple-500/20 to-sky-500/20 px-3 py-1 text-xs font-bold tracking-wider text-purple-300 uppercase ring-1 ring-purple-400/20">
              Modo Pro
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white">Análisis Avanzado</h1>
          </div>

          <div className="grid gap-4">
            <AlertsWidget />
            <CurrentWeatherWidget />
            <ModelComparisonWidget />
            <AirQualityWidget />
            <ClimateHistoryWidget />
            <MeteogramWidget />
            <MarineWidget />
            <AstronomyWidget />
          </div>
        </div>
      </main>
    </div>
  );
}

