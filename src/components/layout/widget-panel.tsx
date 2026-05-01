'use client';

import { Drawer } from 'vaul';
import { motion } from 'framer-motion';
import {
  Cloud, Sun, Calendar, BarChart3, ChevronUp, ChevronDown,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWeatherStore } from '@/lib/stores';
import { useHaptic, useMediaQuery } from '@/lib/hooks';
import { SegmentedTabs } from '@/components/ui/segmented-tabs';
import {
  CurrentWeatherWidget, AlertsWidget, AirQualityWidget, SunriseSunsetWidget,
  HourlyDetailWidget,
  DailyForecastWidget, MarineWidget, AstronomyWidget,
  PrecipNowWidget, OutfitRecommenderWidget,
} from '@/components/widgets';
import {
  HourlyChartWidget, WindChartWidget, PressureChartWidget,
  MeteogramWidget, HumidityWidget, ClimateHistoryWidget, ModelComparisonWidget,
} from '@/components/widgets/lazy';

type Tab = 'now' | 'today' | 'week' | 'detail';

const TABS = [
  { value: 'now' as Tab,    label: 'Ahora',    icon: <Cloud className="h-3.5 w-3.5" /> },
  { value: 'today' as Tab,  label: 'Hoy',      icon: <Sun className="h-3.5 w-3.5" /> },
  { value: 'week' as Tab,   label: '7 días',   icon: <Calendar className="h-3.5 w-3.5" /> },
  { value: 'detail' as Tab, label: 'Detalles', icon: <BarChart3 className="h-3.5 w-3.5" /> },
] as const;

// Snap points anchored to viewport BOTTOM (vaul default).
// Peek = nav (~56px) + tabs strip (~52px) = ~108px so the tabs row sits
// fully visible just above the bottom-nav.
const SNAP_POINTS = ['148px', 0.55, 0.95] as const;

function PanelContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case 'now':
      return (
        <>
          <CurrentWeatherWidget />
          <PrecipNowWidget />
          <OutfitRecommenderWidget />
          <AlertsWidget />
          <AirQualityWidget />
          <HumidityWidget />
          <SunriseSunsetWidget />
        </>
      );
    case 'today':
      return (
        <>
          <HourlyChartWidget />
          <MeteogramWidget />
          <HourlyDetailWidget />
          <WindChartWidget />
        </>
      );
    case 'week':
      return (
        <>
          <DailyForecastWidget />
          <ClimateHistoryWidget />
          <ModelComparisonWidget />
        </>
      );
    case 'detail':
      return (
        <>
          <PressureChartWidget />
          <MarineWidget />
          <AstronomyWidget />
          <AlertsWidget />
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
  const sidebarOpen = useWeatherStore((s) => s.sidebarOpen);
  const setPanelHeightPx = useWeatherStore((s) => s.setPanelHeightPx);
  const haptic = useHaptic();
  const qc = useQueryClient();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

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

  // Collapse to peek whenever the sidebar opens on mobile, so the layer
  // panel can be browsed without the bottom panel covering the map.
  useEffect(() => {
    if (sidebarOpen && !isDesktop) setSnap(SNAP_POINTS[0]);
  }, [sidebarOpen, isDesktop]);

  // Publish current snap height (in CSS px) to the store so the map can
  // bias its flyTo padding and keep the marker centered in the *visible*
  // map area (above the panel). Also publishes a global CSS variable
  // (--panel-h) so map controls (zoom/locate stack, time-slider) can
  // anchor themselves above the panel without prop drilling.
  useEffect(() => {
    if (isDesktop) {
      setPanelHeightPx(0);
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--panel-h', '0px');
      }
      return;
    }
    if (typeof window === 'undefined') return;
    const vh = window.innerHeight;
    let px = 0;
    if (typeof snap === 'string' && snap.endsWith('px')) px = parseFloat(snap);
    else if (typeof snap === 'number') px = snap * vh;
    setPanelHeightPx(px);
    document.documentElement.style.setProperty('--panel-h', `${Math.round(px)}px`);
  }, [snap, isDesktop, setPanelHeightPx]);

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
      {/* Mobile: vaul Drawer (gated with JS to avoid Portal escaping CSS hide rules) */}
      {!isDesktop && (
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
              className="fixed inset-x-0 z-30 mx-auto flex max-w-3xl flex-col rounded-t-2xl border border-white/10 border-b-0 bg-[#0b1020]/92 shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur-2xl backdrop-saturate-150 outline-none"
              style={{
                bottom: 'var(--bottom-nav-h, 0px)',
                height: 'calc(92dvh - var(--bottom-nav-h, 0px))',
              }}
            >
              <Drawer.Title className="sr-only">Información meteorológica</Drawer.Title>
              <Drawer.Description className="sr-only">
                Desliza para cambiar entre vista compacta, media y completa.
              </Drawer.Description>
              {/* Tabs row also acts as the drag handle (vaul handles drag from header). */}
              <div className="relative flex items-center gap-2 px-3 pt-2 pb-1.5">
                <span aria-hidden="true" className="pointer-events-none absolute top-1 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-white/20" />
                <div className="flex-1">
                  <SegmentedTabs<Tab>
                    ariaLabel="Secciones meteorológicas"
                    tabs={TABS}
                    value={tab}
                    onChange={(v) => {
                      setTab(v);
                      // If currently peeking, expand to half so user sees content.
                      if (snap === SNAP_POINTS[0]) setSnap(SNAP_POINTS[1]);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = snap === SNAP_POINTS[0]
                      ? SNAP_POINTS[1]
                      : SNAP_POINTS[0];
                    haptic('light');
                    setSnap(next);
                  }}
                  aria-label={snap === SNAP_POINTS[0] ? 'Expandir panel' : 'Minimizar panel'}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/55 hover:bg-white/10 hover:text-white"
                >
                  {snap === SNAP_POINTS[0]
                    ? <ChevronUp className="h-4 w-4" />
                    : <ChevronDown className="h-4 w-4" />}
                </button>
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
                className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 pt-2 [&>*]:shrink-0"
                style={{ paddingBottom: 'calc(var(--bottom-nav-h, 0px) + 1.5rem)' }}
              >
                <PanelContent tab={tab} />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}

      {/* Desktop: static right-side floating panel */}
      {isDesktop && (
      <aside
        aria-label="Información meteorológica"
        className="absolute top-[4.5rem] right-4 z-20 flex max-h-[calc(100dvh-7rem)] w-96 flex-col gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1020]/65 p-3 backdrop-blur-md shadow-2xl"
      >
        <SegmentedTabs<Tab>
          ariaLabel="Secciones meteorológicas escritorio"
          tabs={TABS}
          value={tab}
          onChange={setTab}
        />
        <PanelContent tab={tab} />
      </aside>
      )}
    </>
  );
}
