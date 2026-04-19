'use client';

import { Header, Sidebar, MobileBottomNav } from '@/components/layout';
import { AlertsWidget, CurrentWeatherWidget } from '@/components/widgets';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function AlertsPage() {
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
        <div className="mx-auto max-w-5xl p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="rounded-full bg-amber-500/15 p-3 text-amber-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs tracking-wider text-white/40 uppercase">Avisos meteorológicos</p>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Alertas <span className="text-white/40">·</span>{' '}
                <span className="text-gradient-sky">{locationName}</span>
              </h1>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AlertsWidget />
            </div>
            <CurrentWeatherWidget />
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
