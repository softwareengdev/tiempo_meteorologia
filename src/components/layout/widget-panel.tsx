'use client';

import { Drawer } from 'vaul';
import { motion } from 'framer-motion';
import {
  Cloud, Sun, Calendar, BarChart3,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWeatherStore } from '@/lib/stores';
import { useHaptic } from '@/lib/hooks';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';
import {
  CurrentWeatherWidget, AlertsWidget, AirQualityWidget, SunriseSunsetWidget,
  HourlyChartWidget, HourlyDetailWidget, WindChartWidget,
  DailyForecastWidget, PressureChartWidget, MarineWidget, AstronomyWidget,
} from '@/components/widgets';

type Tab = 'now' | 'today' | 'week' | 'detail';

const TABS = [
  { value: 'now' as Tab,    label: 'Ahora',  icon: <Cloud className="h-3.5 w-3.5" /> },
  { value: 'today' as Tab,  label: 'Hoy',    icon: <Sun className="h-3.5 w-3.5" /> },
  { value: 'week' as Tab,   label: '7 días', icon: <Calendar className="h-3.5 w-3.5" /> },
  { value: 'detail' as Tab, label: 'Detalle', icon: <BarChart3 className="h-3.5 w-3.5" /> },
] as const;

const SNAP_POINTS = ['96px', 0.5, 0.92] as const;

function PanelContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case 'now':
      return (
        <>
          <CurrentWeatherWidget />
          <AlertsWidget />
          <AirQualityWidget />
          <SunriseSunsetWidget />
        </>
      );
    case 'today':
      return (
        <>
          <HourlyChartWidget />
          <HourlyDetailWidget />
          <WindChartWidget />
        </>
      );
    case 'week':
      return (
        <>
          <DailyForecastWidget />
        </>
      );
    case 'detail':
      return (
        <>
          <PressureChartWidget />
          <MarineWidget />
          <AstronomyWidget />
        </>
      );
  }
}

/**
 * Persistent draggable bottom-sheet panel for mobile (vaul Drawer with snap points).
 * On lg+ the same content is rendered as a static floating right-side panel.
 *
 * Snap points: peek (96px) → half (50dvh) → full (92dvh).
 * Pull-to-refresh: overscroll at top of content invalidates weather queries.
 */
export function WidgetPanel() {
  const tab = useWeatherStore((s) => s.mobileTab);
  const setTab = useWeatherStore((s) => s.setMobileTab);
  const haptic = useHaptic();
  const qc = useQueryClient();

  const [snap, setSnap] = useState<number | string | null>(SNAP_POINTS[1]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const pullStartY = useRef<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Open the drawer on mount (always-open pattern).
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(true);
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    haptic('success');
    await qc.invalidateQueries({ queryKey: ['weather'] });
    await qc.invalidateQueries({ queryKey: ['airQuality'] });
    await qc.invalidateQueries({ queryKey: ['marine'] });
    setTimeout(() => setRefreshing(false), 600);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    if (scrollRef.current.scrollTop <= 0) pullStartY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current == null) return;
    const dy = e.touches[0].clientY - pullStartY.current;
    if (dy > 80 && !refreshing) {
      pullStartY.current = null;
      void refresh();
    }
  };
  const onTouchEnd = () => { pullStartY.current = null; };

  return (
    <>
      {/* Mobile: vaul Drawer */}
      <div className="lg:hidden">
        <Drawer.Root
          open={open}
          modal={false}
          dismissible={false}
          snapPoints={[...SNAP_POINTS]}
          activeSnapPoint={snap}
          setActiveSnapPoint={(s) => { haptic('light'); setSnap(s); }}
          onOpenChange={setOpen}
        >
          <Drawer.Portal>
            <Drawer.Content
              aria-label="Panel meteorológico"
              className="fixed inset-x-0 bottom-0 z-30 mx-auto flex h-[92dvh] max-w-3xl flex-col rounded-t-3xl border border-white/10 border-b-0 bg-[#0b1020]/95 shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur-2xl outline-none"
            >
              <div className="mx-auto mt-2 mb-1 h-1.5 w-12 shrink-0 rounded-full bg-white/25" />
              <Drawer.Title className="sr-only">Información meteorológica</Drawer.Title>
              <Drawer.Description className="sr-only">
                Desliza para cambiar entre vista compacta, media y completa.
              </Drawer.Description>
              <div className="px-3 pb-2">
                <SegmentedTabs<Tab>
                  ariaLabel="Secciones meteorológicas"
                  tabs={TABS}
                  value={tab}
                  onChange={(v) => { setTab(v); if (snap === SNAP_POINTS[0]) setSnap(SNAP_POINTS[1]); }}
                />
              </div>
              {refreshing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 24 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex shrink-0 items-center justify-center text-[11px] text-sky-300"
                >
                  <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-sky-300 border-t-transparent" />
                  Actualizando…
                </motion.div>
              )}
              <div
                ref={scrollRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 pt-1 pb-[max(env(safe-area-inset-bottom),5rem)]"
              >
                <PanelContent tab={tab} />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      {/* Desktop: static right-side floating panel */}
      <aside
        aria-label="Información meteorológica"
        className="absolute top-4 right-4 z-20 hidden max-h-[calc(100dvh-5rem)] w-96 flex-col gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1020]/65 p-3 backdrop-blur-md lg:flex"
      >
        <SegmentedTabs<Tab>
          ariaLabel="Secciones meteorológicas escritorio"
          tabs={TABS}
          value={tab}
          onChange={setTab}
        />
        <PanelContent tab={tab} />
      </aside>
    </>
  );
}
