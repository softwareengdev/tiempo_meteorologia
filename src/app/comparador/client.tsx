'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, Wind, Droplets, Thermometer, Sun, CloudRain } from 'lucide-react';
import { getForecast, searchLocations, getWeatherDescription } from '@/lib/weather';
import { MAJOR_CITIES } from '@/lib/seo';
import { WeatherIcon } from '@/components/icons';
import { EmptyState } from '@/components/ui/empty-state';
import { useHaptic } from '@/lib/hooks';
import type { Coordinates, GeocodingResult, WeatherResponse } from '@/types';

interface CityRef {
  id: string;
  name: string;
  country: string;
  coords: Coordinates;
}

const DEFAULT_CITIES: CityRef[] = [
  { id: 'madrid', name: 'Madrid', country: 'España', coords: { latitude: 40.4168, longitude: -3.7038 } },
  { id: 'barcelona', name: 'Barcelona', country: 'España', coords: { latitude: 41.3851, longitude: 2.1734 } },
  { id: 'valencia', name: 'Valencia', country: 'España', coords: { latitude: 39.4699, longitude: -0.3763 } },
];

const MAX_CITIES = 4;

export function CityCompareClient() {
  const haptic = useHaptic();
  const [cities, setCities] = useState<CityRef[]>(DEFAULT_CITIES);
  const [pickerOpen, setPickerOpen] = useState(false);

  const queries = useQueries({
    queries: cities.map((c) => ({
      queryKey: ['forecast', c.coords.latitude, c.coords.longitude],
      queryFn: () => getForecast(c.coords),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const removeCity = (id: string) => {
    haptic('light');
    setCities((cs) => cs.filter((c) => c.id !== id));
  };

  const addCity = (g: GeocodingResult) => {
    haptic('success');
    setCities((cs) => {
      if (cs.length >= MAX_CITIES) return cs;
      const id = `${g.id}-${g.latitude}-${g.longitude}`;
      if (cs.some((c) => c.id === id)) return cs;
      return [...cs, {
        id,
        name: g.name,
        country: g.country,
        coords: { latitude: g.latitude, longitude: g.longitude },
      }];
    });
    setPickerOpen(false);
  };

  if (cities.length === 0) {
    return (
      <EmptyState
        icon={Plus}
        title="Sin ciudades"
        description="Añade hasta 4 ciudades para empezar a comparar."
        action={
          <button
            onClick={() => setPickerOpen(true)}
            className="rounded-full bg-sky-500 px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-sky-400"
          >
            Añadir ciudad
          </button>
        }
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-white/50">
          {cities.length} de {MAX_CITIES} ciudades
        </p>
        <button
          onClick={() => setPickerOpen(true)}
          disabled={cities.length >= MAX_CITIES}
          className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200 transition hover:bg-sky-500/20 disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Añadir
        </button>
      </div>

      {/* Mobile (<sm): vertical stack full-width. Desktop (≥sm): N-column grid. */}
      <div
        className="flex flex-col gap-3 sm:grid sm:gap-4"
        style={{ gridTemplateColumns: `repeat(${cities.length}, minmax(0, 1fr))` }}
      >
        {cities.map((city, idx) => {
          const q = queries[idx];
          return (
            <CityCard
              key={city.id}
              city={city}
              data={q.data}
              loading={q.isLoading}
              onRemove={() => removeCity(city.id)}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {pickerOpen && (
          <CityPicker
            onClose={() => setPickerOpen(false)}
            onSelect={addCity}
            existing={cities.map((c) => c.id)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CityCard({
  city,
  data,
  loading,
  onRemove,
}: {
  city: CityRef;
  data?: WeatherResponse;
  loading: boolean;
  onRemove: () => void;
}) {
  const current = data?.current;
  const today = data?.daily;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 transition hover:bg-rose-500/30 hover:text-rose-200"
        aria-label={`Quitar ${city.name}`}
      >
        <X className="h-4 w-4" />
      </button>

      <header className="mb-3 pr-8">
        <h2 className="font-display text-lg font-semibold text-white">{city.name}</h2>
        <p className="text-xs text-white/50">{city.country}</p>
      </header>

      {loading || !current ? (
        <div className="space-y-2">
          <div className="h-16 animate-pulse rounded-xl bg-white/5" />
          <div className="h-20 animate-pulse rounded-xl bg-white/5" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3">
            <WeatherIcon code={current.weather_code} isDay={current.is_day === 1} size={56} />
            <div>
              <p className="font-display text-4xl font-bold text-white">
                {Math.round(current.temperature_2m)}°
              </p>
              <p className="text-xs text-white/60">{getWeatherDescription(current.weather_code)}</p>
            </div>
          </div>

          {today && (
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="text-white/50">Hoy</span>
              <span className="font-medium text-white/80">
                {Math.round(today.temperature_2m_max[0])}° / {Math.round(today.temperature_2m_min[0])}°
              </span>
            </div>
          )}

          <ul className="grid grid-cols-2 gap-2 text-[11px]">
            <Stat icon={Thermometer} label="Sensación" value={`${Math.round(current.apparent_temperature)}°`} />
            <Stat icon={Wind} label="Viento" value={`${Math.round(current.wind_speed_10m)} km/h`} />
            <Stat icon={Droplets} label="Humedad" value={`${current.relative_humidity_2m}%`} />
            <Stat
              icon={CloudRain}
              label="Lluvia hoy"
              value={today ? `${today.precipitation_sum[0].toFixed(1)} mm` : '—'}
            />
            <Stat
              icon={Sun}
              label="UV máx"
              value={today ? `${Math.round(today.uv_index_max[0])}` : '—'}
            />
            <Stat
              icon={CloudRain}
              label="Prob. lluvia"
              value={today ? `${today.precipitation_probability_max[0] ?? 0}%` : '—'}
            />
          </ul>
        </>
      )}
    </motion.article>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <li className="rounded-lg bg-white/5 px-2 py-1.5">
      <div className="flex items-center gap-1 text-white/40">
        <Icon className="h-3 w-3" />
        <span className="truncate">{label}</span>
      </div>
      <p className="font-display text-sm font-semibold text-white">{value}</p>
    </li>
  );
}

function CityPicker({
  onClose,
  onSelect,
  existing,
}: {
  onClose: () => void;
  onSelect: (g: GeocodingResult) => void;
  existing: string[];
}) {
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    if (query.length < 2) {
      return MAJOR_CITIES.map((c) => ({
        id: c.slug.split('-')[0].length, // dummy positive number
        name: c.name,
        latitude: c.latitude,
        longitude: c.longitude,
        country: c.country,
        country_code: '',
        feature_code: 'PPL',
        timezone: c.timezone,
      })) as GeocodingResult[];
    }
    return [];
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-md rounded-t-3xl border border-white/10 bg-[#0b1020] p-4 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-white">Añadir ciudad</h3>
          <button onClick={onClose} className="rounded-full p-1 text-white/60 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="relative mb-3">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            autoFocus
            type="search"
            placeholder="Buscar ciudad…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-white/10 bg-white/5 py-2 pr-3 pl-9 text-sm text-white placeholder-white/30 outline-none focus:border-sky-400/50"
          />
        </div>

        <SearchResults
          query={query}
          fallback={suggestions}
          existing={existing}
          onSelect={onSelect}
        />
      </motion.div>
    </motion.div>
  );
}

function SearchResults({
  query,
  fallback,
  existing,
  onSelect,
}: {
  query: string;
  fallback: GeocodingResult[];
  existing: string[];
  onSelect: (g: GeocodingResult) => void;
}) {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchLocations(query)
      .then((r) => { if (!cancelled) setResults(r); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [query]);

  const items = query.length < 2 ? fallback : results;
  const isExisting = (g: GeocodingResult) => existing.includes(`${g.id}-${g.latitude}-${g.longitude}`);

  return (
    <ul className="max-h-[50dvh] space-y-1 overflow-y-auto">
      {query.length < 2 && (
        <li className="mb-1 px-2 text-[10px] tracking-wider text-white/40 uppercase">Sugerencias</li>
      )}
      {loading && <li className="px-3 py-4 text-center text-sm text-white/50">Buscando…</li>}
      {!loading && items.length === 0 && query.length >= 2 && (
        <li className="px-3 py-4 text-center text-sm text-white/50">Sin resultados</li>
      )}
      {items.map((g, i) => {
        const exists = isExisting(g);
        return (
          <li key={`${g.id}-${i}`}>
            <button
              disabled={exists}
              onClick={() => onSelect(g)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-white transition hover:bg-white/10 disabled:opacity-40"
            >
              <span>
                <span className="font-medium">{g.name}</span>
                <span className="text-white/40"> · {g.country}</span>
              </span>
              {exists ? <span className="text-[10px] text-white/40">Ya añadida</span> : <Plus className="h-4 w-4 text-sky-400" />}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
