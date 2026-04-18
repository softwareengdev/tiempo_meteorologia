'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/layout';
import {
  ModelComparisonWidget,
  AlertsWidget,
  ClimateHistoryWidget,
  CurrentWeatherWidget,
  MeteogramWidget,
} from '@/components/widgets';

const WeatherMap = dynamic(() => import('@/components/map/weather-map').then((m) => m.WeatherMap), { ssr: false });

export default function ProPage() {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        {/* Map half */}
        <div className="hidden w-1/2 lg:block">
          <WeatherMap />
        </div>

        {/* Pro panel */}
        <div className="flex flex-1 flex-col overflow-y-auto p-4 lg:w-1/2">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-lg bg-gradient-to-r from-purple-500/20 to-sky-500/20 px-3 py-1 text-xs font-bold tracking-wider text-purple-400 uppercase">
              Modo Pro
            </span>
            <h1 className="text-lg font-semibold text-white/80">Análisis Avanzado</h1>
          </div>

          <div className="grid gap-4">
            <AlertsWidget />
            <CurrentWeatherWidget />
            <ModelComparisonWidget />
            <ClimateHistoryWidget />
            <MeteogramWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
