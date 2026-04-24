'use client';

import { Header, Sidebar, MobileBottomNav } from '@/components/layout';
import { ClimateHistoryWidget } from '@/components/widgets/lazy';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function ClimatePage() {
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
        <div className="mx-auto max-w-6xl p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="rounded-full bg-emerald-500/15 p-3 text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs tracking-wider text-white/40 uppercase">
                Tendencias y anomalías a largo plazo
              </p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Clima <span className="text-white/40">·</span>{' '}
                <span className="text-gradient-sky">{locationName}</span>
              </h1>
            </div>
          </motion.div>

          <ClimateHistoryWidget />

          <p className="mt-6 text-sm leading-relaxed text-white/50">
            Datos climáticos históricos basados en ERA5 (Open-Meteo Climate API). Las anomalías se
            calculan respecto a la media climatológica 1991–2020 y muestran cómo está cambiando el
            clima en tu ubicación.
          </p>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
