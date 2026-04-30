'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, X, Star, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationSearch } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import type { GeocodingResult } from '@/types';

const RECENT_KEY = 'aether-recent-searches';
const MAX_RECENT = 5;

function loadRecent(): GeocodingResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as GeocodingResult[]) : [];
  } catch { return []; }
}
function pushRecent(r: GeocodingResult) {
  if (typeof window === 'undefined') return;
  try {
    const cur = loadRecent().filter((x) => x.id !== r.id);
    cur.unshift(r);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(cur.slice(0, MAX_RECENT)));
  } catch { /* noop */ }
}

export function LocationSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const mobileOpen = useWeatherStore((s) => s.searchOpen);
  const setMobileOpen = useWeatherStore((s) => s.setSearchOpen);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: results = [], isFetching } = useLocationSearch(query);
  const setSelectedLocation = useWeatherStore((s) => s.setSelectedLocation);
  const favorites = useWeatherStore((s) => s.favorites);
  const addFavorite = useWeatherStore((s) => s.addFavorite);
  const [recents, setRecents] = useState<GeocodingResult[]>([]);

  useEffect(() => { setRecents(loadRecent()); }, [mobileOpen]);

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      setSelectedLocation(
        { latitude: result.latitude, longitude: result.longitude },
        `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${result.country}`,
      );
      pushRecent(result);
      setQuery('');
      setIsOpen(false);
      setMobileOpen(false);
    },
    [setSelectedLocation, setMobileOpen],
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus the mobile input when sheet opens.
  useEffect(() => {
    if (mobileOpen) {
      const t = setTimeout(() => mobileInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [mobileOpen]);

  // ESC closes mobile sheet.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen, setMobileOpen]);

  const showSuggestions = query.length < 2;

  return (
    <>
      {/* Desktop / sm+ — inline input */}
      <div className="relative hidden sm:block" ref={dropdownRef}>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md transition-colors focus-within:border-sky-400/50 focus-within:bg-white/10">
          <Search className="h-4 w-4 text-white/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Buscar ubicación..."
            className="w-40 bg-transparent text-sm text-white placeholder-white/40 outline-none md:w-48 lg:w-64"
            aria-label="Buscar ubicación"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className="text-white/40 hover:text-white/80"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute top-full right-0 z-50 mt-2 w-80 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-white/15 bg-[#0b1020] shadow-2xl ring-1 ring-black/40">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-white/10"
              >
                <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{result.name}</p>
                  <p className="truncate text-xs text-white/65">
                    {result.admin1 ? `${result.admin1}, ` : ''}
                    {result.country}
                  </p>
                </div>
                {result.population && result.population > 0 && (
                  <span className="ml-auto text-xs text-white/45">
                    {result.population.toLocaleString('es')} hab.
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile trigger button — header */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Buscar ubicación"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:hidden"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Mobile floating search modal — translucent glass card, NOT full-screen */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm sm:hidden"
            aria-hidden="true"
          />
        )}
        {mobileOpen && (
          <motion.div
            key="search-card"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-3 z-[81] flex max-h-[min(70dvh,560px)] flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0b1020]/85 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(56,189,248,0.08)] backdrop-blur-2xl backdrop-saturate-150 sm:hidden"
            style={{ top: 'calc(env(safe-area-inset-top) + 0.75rem)' }}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar ubicación"
          >
            {/* Search header */}
            <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2.5">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 focus-within:border-sky-400/50 focus-within:bg-white/[0.09]">
                {isFetching && query.length >= 2 ? (
                  <Loader2 className="h-4 w-4 animate-spin text-sky-300" />
                ) : (
                  <Search className="h-4 w-4 text-white/55" />
                )}
                <input
                  ref={mobileInputRef}
                  type="search"
                  enterKeyHint="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ciudad, provincia o país…"
                  className="flex-1 bg-transparent text-[15px] text-white placeholder-white/45 outline-none"
                  aria-label="Buscar ubicación"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Limpiar" className="text-white/45 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => { setMobileOpen(false); setQuery(''); }}
                aria-label="Cerrar búsqueda"
                className="rounded-lg px-2.5 py-2 text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white"
              >
                Cancelar
              </button>
            </div>

            {/* Results / suggestions */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {showSuggestions ? (
                <>
                  {recents.length > 0 && (
                    <Section title="Recientes">
                      {recents.map((r) => (
                        <ResultRow key={`r-${r.id}`} result={r} onSelect={handleSelect} />
                      ))}
                    </Section>
                  )}
                  {favorites.length > 0 && (
                    <Section title="Favoritos">
                      {favorites.map((f, i) => (
                        <button
                          key={`f-${i}`}
                          onClick={() => {
                            setSelectedLocation(f.coords, f.name);
                            setMobileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/[0.06] active:bg-white/10"
                        >
                          <Star className="h-4 w-4 shrink-0 text-amber-300" />
                          <span className="truncate text-[14px] text-white">{f.name}</span>
                        </button>
                      ))}
                    </Section>
                  )}
                  {recents.length === 0 && favorites.length === 0 && (
                    <div className="px-4 py-8 text-center">
                      <Search className="mx-auto mb-2 h-6 w-6 text-white/25" />
                      <p className="text-sm text-white/55">Busca cualquier ciudad del mundo</p>
                      <p className="mt-1 text-xs text-white/35">Ej. Madrid, Tokyo, Buenos Aires…</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {results.length === 0 && !isFetching && (
                    <p className="px-4 py-8 text-center text-sm text-white/50">Sin resultados para «{query}»</p>
                  )}
                  {results.map((r) => (
                    <ResultRow
                      key={r.id}
                      result={r}
                      onSelect={handleSelect}
                      onFav={() => addFavorite(`${r.name}, ${r.country}`, { latitude: r.latitude, longitude: r.longitude })}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-1.5">
      <p className="px-4 pt-2 pb-1 text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase">{title}</p>
      {children}
    </div>
  );
}

function ResultRow({
  result, onSelect, onFav,
}: {
  result: GeocodingResult;
  onSelect: (r: GeocodingResult) => void;
  onFav?: () => void;
}) {
  return (
    <div className="group flex items-stretch border-b border-white/5 last:border-b-0">
      <button
        onClick={() => onSelect(result)}
        className={cn(
          'flex flex-1 items-center gap-3 px-4 py-3 text-left transition-colors',
          'hover:bg-white/[0.06] active:bg-white/10',
        )}
      >
        <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-medium text-white">{result.name}</p>
          <p className="truncate text-[12px] text-white/55">
            {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
          </p>
        </div>
        {result.population && result.population > 1000 && (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-white/55">
            {Intl.NumberFormat('es', { notation: 'compact' }).format(result.population)}
          </span>
        )}
      </button>
      {onFav && (
        <button
          onClick={onFav}
          aria-label="Guardar en favoritos"
          className="flex w-11 shrink-0 items-center justify-center text-white/40 hover:text-amber-300"
        >
          <Star className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
