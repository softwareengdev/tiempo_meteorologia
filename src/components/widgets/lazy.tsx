/**
 * Lazy-loaded chart widgets (next/dynamic + ssr:false) so Recharts (~250KB gz)
 * is only fetched when the user opens the "today"/"detail" tabs of the widget panel.
 *
 * Each export keeps the same component name as the eager one so callers can swap
 * the import path: `from '@/components/widgets'` → `from '@/components/widgets/lazy'`.
 */
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/chart-skeleton';

const loading = () => <ChartSkeleton />;

export const HourlyChartWidget = dynamic(
  () => import('./hourly-chart').then((m) => m.HourlyChartWidget),
  { ssr: false, loading },
);

export const WindChartWidget = dynamic(
  () => import('./weather-charts').then((m) => m.WindChartWidget),
  { ssr: false, loading },
);

export const PressureChartWidget = dynamic(
  () => import('./weather-charts').then((m) => m.PressureChartWidget),
  { ssr: false, loading },
);

export const MeteogramWidget = dynamic(
  () => import('./meteogram').then((m) => m.MeteogramWidget),
  { ssr: false, loading },
);

export const HumidityWidget = dynamic(
  () => import('./humidity').then((m) => m.HumidityWidget),
  { ssr: false, loading },
);

export const ModelComparisonWidget = dynamic(
  () => import('./model-comparison').then((m) => m.ModelComparisonWidget),
  { ssr: false, loading },
);

export const ClimateHistoryWidget = dynamic(
  () => import('./climate-history').then((m) => m.ClimateHistoryWidget),
  { ssr: false, loading },
);
