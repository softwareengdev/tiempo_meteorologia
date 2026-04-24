'use client';

import dynamic from 'next/dynamic';
import { Header, Sidebar, MobileBottomNav } from '@/components/layout';
import {
  CurrentWeatherWidget, DailyForecastWidget,
  SunriseSunsetWidget,
  AirQualityWidget, AstronomyWidget,
  AlertsWidget, MarineWidget,
} from '@/components/widgets';
import {
  HourlyChartWidget, WindChartWidget, PressureChartWidget,
  MeteogramWidget, HumidityWidget,
} from '@/components/widgets/lazy';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const WeatherMap = dynamic(
  () => import('@/components/map/weather-map').then((mod) => mod.WeatherMap),
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center bg-[#0b1020]"><p className="text-white/40">Cargando mapa...</p></div> },
);

export default function DashboardPage() {
  const sidebarOpen = useWeatherStore((s) => s.sidebarOpen);
  const locationName = useWeatherStore((s) => s.locationName);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0b1020]">
      <Header />
      <Sidebar />

      <main
        className={cn(
          'flex-1 overflow-y-auto pt-14 pb-16 transition-all duration-300 md:pb-0',
          sidebarOpen ? 'md:ml-64' : 'ml-0',
        )}
      >
        {/* Map section */}
        <div className="h-[40vh] w-full lg:h-[50vh]">
          <WeatherMap />
        </div>

        {/* Dashboard grid */}
        <div className="p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-col gap-1"
          >
            <p className="text-xs tracking-wider text-white/40 uppercase">Tu panel personalizado</p>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Dashboard <span className="text-white/40">·</span> <span className="text-gradient-sky">{locationName}</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <CurrentWeatherWidget />
            <SunriseSunsetWidget />
            <HumidityWidget />
            <AlertsWidget />
            <AirQualityWidget />
            <AstronomyWidget />
            <div className="md:col-span-2 xl:col-span-3">
              <MeteogramWidget />
            </div>
            <div className="md:col-span-2 xl:col-span-2">
              <HourlyChartWidget />
            </div>
            <DailyForecastWidget />
            <WindChartWidget />
            <PressureChartWidget />
            <MarineWidget />
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}

