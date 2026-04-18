'use client';

import dynamic from 'next/dynamic';
import { Header, Sidebar } from '@/components/layout';
import { CurrentWeatherWidget, HourlyChartWidget, DailyForecastWidget } from '@/components/widgets';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

const WeatherMap = dynamic(
  () => import('@/components/map/weather-map').then((mod) => mod.WeatherMap),
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center bg-gray-900"><p className="text-white/40">Cargando mapa...</p></div> },
);

export default function HomePage() {
  const sidebarOpen = useWeatherStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-950">
      <Header />
      <Sidebar />

      <main
        className={cn(
          'flex-1 pt-14 transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-0',
        )}
      >
        <div className="relative flex h-full">
          {/* Map */}
          <div className="flex-1">
            <WeatherMap />
          </div>

          {/* Right panel with widgets */}
          <div className="absolute top-4 right-4 z-20 flex w-96 max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-y-auto pr-1">
            <CurrentWeatherWidget />
            <HourlyChartWidget />
            <DailyForecastWidget />
          </div>
        </div>
      </main>
    </div>
  );
}
