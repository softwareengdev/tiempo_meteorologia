'use client';

import { useState, useMemo } from 'react';
import {
  Thermometer, Wind, CloudRain, Cloud, Eye, Sun, Gauge, Droplets, Snowflake, Zap, Star, Trash2,
  Search, Sparkles, Layers, X,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useWeatherStore } from '@/lib/stores';
import type { WeatherLayer } from '@/types';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';

type LayerKind = 'realtime' | 'sampled';

interface LayerDef {
  id: WeatherLayer;
  label: string;
  desc: string;
  icon: React.ElementType;
  /** Tailwind color for the icon when active. */
  color: string;
  /** Two-stop gradient (Tailwind classes) used for the active card glow + ring. */
  gradient: string;
  kind: LayerKind;
}

interface LayerGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  layers: LayerDef[];
}

const LAYER_GROUPS: LayerGroup[] = [
  {
    id: 'precip',
    label: 'Precipitación',
    icon: CloudRain,
    layers: [
      { id: 'precipitation', label: 'Precipitación', desc: 'Radar real (RainViewer)', icon: CloudRain, color: 'text-blue-300', gradient: 'from-blue-500/30 to-cyan-500/20', kind: 'realtime' },
      { id: 'rain',          label: 'Lluvia',        desc: 'Radar líquido',          icon: CloudRain, color: 'text-sky-300',  gradient: 'from-sky-500/30 to-blue-500/20',  kind: 'realtime' },
      { id: 'snow',          label: 'Nieve',         desc: 'Radar nieve',            icon: Snowflake, color: 'text-blue-200', gradient: 'from-indigo-400/30 to-sky-400/20', kind: 'realtime' },
      { id: 'snowfall',      label: 'Nevada',        desc: 'Radar nevada',           icon: Snowflake, color: 'text-slate-200',gradient: 'from-slate-400/30 to-slate-200/20',kind: 'realtime' },
    ],
  },
  {
    id: 'atmos',
    label: 'Atmósfera',
    icon: Thermometer,
    layers: [
      { id: 'temperature', label: 'Temperatura',     desc: 'Sensor a 2 m',         icon: Thermometer, color: 'text-red-400',     gradient: 'from-orange-500/30 to-red-500/20',   kind: 'sampled' },
      { id: 'humidity',    label: 'Humedad',         desc: 'Humedad relativa',     icon: Droplets,    color: 'text-teal-300',    gradient: 'from-teal-500/30 to-cyan-500/20',    kind: 'sampled' },
      { id: 'pressure',    label: 'Presión',         desc: 'Presión a nivel mar',  icon: Gauge,       color: 'text-purple-300',  gradient: 'from-purple-500/30 to-fuchsia-500/20', kind: 'sampled' },
      { id: 'dew_point',   label: 'Punto de rocío',  desc: 'Temperatura de rocío', icon: Droplets,    color: 'text-emerald-300', gradient: 'from-emerald-500/30 to-teal-500/20', kind: 'sampled' },
    ],
  },
  {
    id: 'wind',
    label: 'Viento',
    icon: Wind,
    layers: [
      { id: 'wind',        label: 'Viento',           desc: 'Velocidad media + partículas', icon: Wind, color: 'text-cyan-300',   gradient: 'from-cyan-500/30 to-sky-500/20',     kind: 'sampled' },
      { id: 'wind_gusts',  label: 'Rachas de viento', desc: 'Ráfagas máximas',              icon: Wind, color: 'text-indigo-300', gradient: 'from-indigo-500/30 to-violet-500/20',kind: 'sampled' },
    ],
  },
  {
    id: 'advanced',
    label: 'Avanzadas',
    icon: Sparkles,
    layers: [
      { id: 'clouds',     label: 'Nubes',      desc: 'Cobertura nubosa',  icon: Cloud, color: 'text-gray-300',   gradient: 'from-slate-400/30 to-slate-300/15',  kind: 'sampled' },
      { id: 'visibility', label: 'Visibilidad',desc: 'Distancia visual',  icon: Eye,   color: 'text-yellow-300', gradient: 'from-yellow-500/30 to-amber-500/20', kind: 'sampled' },
      { id: 'uv_index',   label: 'Índice UV',  desc: 'Radiación UV',      icon: Sun,   color: 'text-orange-300', gradient: 'from-orange-500/30 to-yellow-500/20',kind: 'sampled' },
      { id: 'cape',       label: 'CAPE',       desc: 'Energía convectiva',icon: Zap,   color: 'text-amber-300',  gradient: 'from-amber-500/30 to-yellow-500/20', kind: 'sampled' },
    ],
  },
];


// Routes where the layer panel + favorites combo is meaningful (the live map).
const MAP_ROUTES = ['/'];

export function Sidebar() {
  const {
    sidebarOpen, activeLayers, toggleLayer, selectedModel, setSelectedModel,
    favorites, removeFavorite, setSelectedLocation,
  } = useWeatherStore();
  const pathname = usePathname();
  const [filter, setFilter] = useState('');

  const filteredGroups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return LAYER_GROUPS;
    return LAYER_GROUPS
      .map((g) => ({ ...g, layers: g.layers.filter((l) => l.label.toLowerCase().includes(q) || l.desc.toLowerCase().includes(q)) }))
      .filter((g) => g.layers.length > 0);
  }, [filter]);

  const activeCount = activeLayers.length;
  const clearAllLayers = () => {
    activeLayers.slice().forEach((l) => toggleLayer(l));
  };

  // The sidebar is map-centric. On informational/data pages we don't show it
  // because its primary content (layers) wouldn't apply.
  const isMapRoute = MAP_ROUTES.includes(pathname);
  if (!isMapRoute) return null;
  if (!sidebarOpen) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={() => useWeatherStore.getState().toggleSidebar()}
        className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
        aria-hidden="true"
      />
      <aside
        className="fixed top-14 bottom-16 left-0 z-30 flex w-[85vw] max-w-[20rem] flex-col overflow-y-auto border-r border-white/10 bg-[#0b1020]/95 backdrop-blur-xl animate-in slide-in-from-left-4 duration-200 md:bottom-0 md:w-64 md:max-w-none"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        role="complementary"
        aria-label="Panel de capas y favoritos"
      >
      {/* Model selector */}
      <div className="border-b border-white/5 p-4">
        <label className="mb-2 block text-xs font-semibold tracking-wider text-white/50 uppercase">
          Modelo
        </label>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-sky-400/50"
        >
          <option value="best_match">Mejor combinación</option>
          <option value="ecmwf_ifs025">ECMWF IFS (9km)</option>
          <option value="icon_global">ICON Global</option>
          <option value="gfs_global">GFS Global</option>
          <option value="jma_gsm">JMA GSM</option>
          <option value="gem_global">GEM Global</option>
        </select>
      </div>

      {/* Weather layers — categorised, searchable, with rich active state */}
      <div className="flex-1 px-4 pt-4 pb-2">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/70 uppercase">
            <Layers className="h-3.5 w-3.5 text-sky-300" />
            Capas
          </h3>
          <div className="flex items-center gap-2">
            <span className={cn(
              'rounded-full border px-2 py-0.5 text-[10px] font-semibold tabular-nums',
              activeCount > 0
                ? 'border-sky-400/40 bg-sky-400/10 text-sky-200'
                : 'border-white/15 bg-white/5 text-white/60',
            )}>
              {activeCount} activas
            </span>
            {activeCount > 0 && (
              <button
                onClick={clearAllLayers}
                aria-label="Limpiar todas las capas"
                className="rounded-md p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 focus-within:border-sky-400/50">
          <Search className="h-3.5 w-3.5 text-white/50" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar capas…"
            aria-label="Filtrar capas meteorológicas"
            className="w-full bg-transparent text-xs text-white placeholder-white/40 outline-none"
          />
        </div>

        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const GroupIcon = group.icon;
            return (
              <div key={group.id}>
                <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-semibold tracking-[0.18em] text-white/55 uppercase">
                  <GroupIcon className="h-3 w-3 text-white/55" />
                  {group.label}
                </div>
                <div className="space-y-1.5">
                  {group.layers.map((layer) => {
                    const Icon = layer.icon;
                    const active = activeLayers.includes(layer.id);
                    return (
                      <button
                        key={layer.id}
                        onClick={() => toggleLayer(layer.id)}
                        aria-pressed={active}
                        className={cn(
                          'group relative flex w-full min-h-[44px] items-center gap-3 overflow-hidden rounded-xl border px-2.5 py-2 text-left transition-all',
                          active
                            ? 'border-sky-400/40 bg-white/[0.07] shadow-[0_0_0_1px_rgba(56,189,248,0.15),0_8px_24px_-12px_rgba(56,189,248,0.5)]'
                            : 'border-white/8 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.06]',
                        )}
                      >
                        {active && (
                          <span
                            aria-hidden="true"
                            className={cn('pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br opacity-90', layer.gradient)}
                          />
                        )}
                        <span
                          className={cn(
                            'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
                            active
                              ? 'border-white/20 bg-black/30 backdrop-blur-sm'
                              : 'border-white/10 bg-white/[0.04]',
                          )}
                        >
                          <Icon className={cn('h-4 w-4', active ? layer.color : 'text-white/75')} />
                        </span>
                        <span className="relative z-10 min-w-0 flex-1">
                          <span className={cn('block truncate text-sm font-medium', active ? 'text-white' : 'text-white/90')}>
                            {layer.label}
                          </span>
                          <span className={cn('block truncate text-[10.5px]', active ? 'text-white/75' : 'text-white/55')}>
                            {layer.desc}
                          </span>
                        </span>
                        {layer.kind === 'realtime' && (
                          <span className="relative z-10 hidden rounded-full bg-emerald-400/15 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-emerald-300 sm:inline">
                            LIVE
                          </span>
                        )}
                        <span
                          className={cn(
                            'relative z-10 flex h-5 w-9 shrink-0 items-center rounded-full border transition-all',
                            active
                              ? 'border-sky-400/60 bg-sky-400/30'
                              : 'border-white/15 bg-white/10',
                          )}
                        >
                          <span
                            className={cn(
                              'h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform duration-200',
                              active ? 'translate-x-[18px]' : 'translate-x-[3px]',
                            )}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {filteredGroups.length === 0 && (
            <p className="px-1 py-3 text-xs text-white/50">Sin capas que coincidan con &quot;{filter}&quot;.</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/5 p-4">
        <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-white/50 uppercase">
          <Star className="h-3.5 w-3.5 text-amber-400" /> Favoritos
        </h3>
        {favorites.length === 0 ? (
          <EmptyState
            icon={Star}
            title="Sin favoritos"
            description="Pulsa la estrella junto a la búsqueda para guardar tus ubicaciones."
            className="bg-transparent border-white/8 p-4 text-xs"
          />
        ) : (
          <ul className="space-y-1">
            {favorites.map((f) => (
              <li key={f.name} className="group flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/5">
                <button
                  onClick={() => setSelectedLocation(f.coords, f.name)}
                  className="flex-1 truncate text-left text-sm text-white/80 hover:text-white"
                >
                  📍 {f.name}
                </button>
                <button
                  onClick={() => removeFavorite(f.name)}
                  aria-label={`Quitar ${f.name} de favoritos`}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5 text-white/40 hover:text-red-400" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-white/5 p-4">
        <p className="text-center text-xs text-white/30">
          AetherCast v3.0 — Datos: Open-Meteo · RainViewer
        </p>
      </div>
    </aside>
    </>
  );
}
