'use client';

import dynamic from 'next/dynamic';
import { Header, Sidebar, MobileBottomNav, PWAInstall } from '@/components/layout';
import {
  CurrentWeatherWidget, HourlyChartWidget, DailyForecastWidget,
  HourlyDetailWidget, WindChartWidget, PressureChartWidget, SunriseSunsetWidget,
  AlertsWidget, AirQualityWidget, MarineWidget, AstronomyWidget,
} from '@/components/widgets';
import { AIChat } from '@/components/ai';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

const WeatherMap = dynamic(
  () => import('@/components/map/weather-map').then((mod) => mod.WeatherMap),
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center bg-[#0b1020]"><p className="text-white/40">Cargando mapa...</p></div> },
);

export default function HomePage() {
  const sidebarOpen = useWeatherStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0b1020]">
      <Header />
      <Sidebar />

      <main
        className={cn(
          'flex-1 pt-14 pb-16 transition-all duration-300 md:pb-0',
          sidebarOpen ? 'md:ml-64' : 'ml-0',
        )}
      >
        <div className="relative flex h-full flex-col lg:flex-row">
          {/* Map */}
          <div className="flex-1">
            <WeatherMap />
          </div>

          {/* Widgets panel: bottom sheet on mobile, side panel on desktop */}
          <aside
            className={cn(
              'z-20 flex flex-col gap-4 overflow-y-auto bg-[#0b1020]/60 p-4 backdrop-blur-md',
              // Mobile: bottom drawer-like, half height; Desktop: floating right panel
              'h-[45dvh] border-t border-white/10 lg:absolute lg:top-4 lg:right-4 lg:h-auto lg:max-h-[calc(100vh-5rem)] lg:w-96 lg:rounded-2xl lg:border lg:p-3 lg:pr-1',
            )}
            aria-label="Información meteorológica"
          >
            <CurrentWeatherWidget />
            <AlertsWidget />
            <SunriseSunsetWidget />
            <AirQualityWidget />
            <HourlyChartWidget />
            <HourlyDetailWidget />
            <WindChartWidget />
            <PressureChartWidget />
            <MarineWidget />
            <AstronomyWidget />
            <DailyForecastWidget />
          </aside>
        </div>
      </main>
      <AIChat />
      <MobileBottomNav />
      <PWAInstall />
    </div>
  );
}

