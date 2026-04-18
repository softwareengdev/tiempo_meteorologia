'use client';

import dynamic from 'next/dynamic';
import { Header, Sidebar } from '@/components/layout';
import {
  CurrentWeatherWidget, HourlyChartWidget, DailyForecastWidget,
  SunriseSunsetWidget, WindChartWidget, PressureChartWidget,
} from '@/components/widgets';
import { MeteogramWidget } from '@/components/widgets/meteogram';
import { HumidityWidget } from '@/components/widgets/humidity';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const WeatherMap = dynamic(
  () => import('@/components/map/weather-map').then((mod) => mod.WeatherMap),
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center bg-gray-900"><p className="text-white/40">Cargando mapa...</p></div> },
);

export default function DashboardPage() {
  const sidebarOpen = useWeatherStore((s) => s.sidebarOpen);
  const locationName = useWeatherStore((s) => s.locationName);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-950">
      <Header />
      <Sidebar />

      <main
        className={cn(
          'flex-1 overflow-y-auto pt-14 transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-0',
        )}
      >
        {/* Map section */}
        <div className="h-[50vh] w-full">
          <WeatherMap />
        </div>

        {/* Dashboard grid */}
        <div className="p-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-xl font-semibold text-white"
          >
            Dashboard — <span className="text-white/60">{locationName}</span>
          </motion.h2>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <div className="md:col-span-1">
              <CurrentWeatherWidget />
            </div>
            <div className="md:col-span-1">
              <SunriseSunsetWidget />
            </div>
            <div className="md:col-span-1">
              <HumidityWidget />
            </div>
            <div className="md:col-span-2 xl:col-span-3">
              <MeteogramWidget />
            </div>
            <div className="md:col-span-2 xl:col-span-2">
              <HourlyChartWidget />
            </div>
            <div className="md:col-span-1">
              <DailyForecastWidget />
            </div>
            <div className="md:col-span-1">
              <WindChartWidget />
            </div>
            <div className="md:col-span-1">
              <PressureChartWidget />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
