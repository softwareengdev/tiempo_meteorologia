'use client';

import dynamic from 'next/dynamic';
import { Header, Sidebar, MobileBottomNav, PWAInstall, WidgetPanel, AuroraBackground } from '@/components/layout';
import { AIChat } from '@/components/ai';
import { BrandLoader } from '@/components/ui/brand-loader';
import { StormHunter } from '@/components/map';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';

const WeatherMap = dynamic(
  () => import('@/components/map/weather-map').then((mod) => mod.WeatherMap),
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center bg-[#0b1020]"><BrandLoader label="Cargando mapa meteorológico…" /></div> },
);

export default function HomePage() {
  const sidebarOpen = useWeatherStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0b1020]">
      <Header />
      <Sidebar />

      <main
        className={cn(
          'relative flex-1 pt-14 transition-all duration-300',
          sidebarOpen ? 'md:ml-64' : 'ml-0',
        )}
      >
        {/* Dynamic atmospheric backdrop reacts to current weather */}
        <AuroraBackground />
        {/* Map fills the entire main area; the WidgetPanel floats on top */}
        <div className="absolute inset-0 pt-14">
          <WeatherMap />
        </div>
        <StormHunter />
        <WidgetPanel />
      </main>

      <AIChat />
      <MobileBottomNav />
      <PWAInstall />
    </div>
  );
}

