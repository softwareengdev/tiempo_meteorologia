'use client';

import dynamic from 'next/dynamic';
const WeatherMap = dynamic(
  () => import('@/components/map/weather-map').then((m) => m.WeatherMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0b1020]">
        <p className="text-white/40">Cargando mapa...</p>
      </div>
    ),
  },
);

export default function MapPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0b1020]">
      <main className="relative flex-1 pt-14 pb-16 md:pb-0">
        <div className="absolute inset-0 top-14 md:bottom-0 bottom-16">
          <WeatherMap />
        </div>
      </main>
    </div>
  );
}
