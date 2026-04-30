'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationSearch } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import { cn } from '@/lib/utils';
import type { GeocodingResult } from '@/types';

export function LocationSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: results = [] } = useLocationSearch(query);
  const setSelectedLocation = useWeatherStore((s) => s.setSelectedLocation);

  const handleSelect = useCallback(
    (result: GeocodingResult) => {
      setSelectedLocation(
        { latitude: result.latitude, longitude: result.longitude },
        `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${result.country}`,
      );
      setQuery('');
      setIsOpen(false);
      setMobileOpen(false);
    },
    [setSelectedLocation],
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
      const t = setTimeout(() => mobileInputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [mobileOpen]);

  // ESC closes mobile sheet.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

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

      {/* Mobile — icon trigger + full-screen sheet */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Buscar ubicación"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:hidden"
      >
        <Search className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-search-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] bg-[#0b1020] sm:hidden"
            style={{ width: '100vw', height: '100dvh' }}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar ubicación"
          >
            <div
              className="flex items-center gap-2 border-b border-white/10 px-3 py-3"
              style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}
            >
              <button
                onClick={() => { setMobileOpen(false); setQuery(''); }}
                aria-label="Cerrar búsqueda"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white/70 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 focus-within:border-sky-400/50">
                <Search className="h-4 w-4 text-white/50" />
                <input
                  ref={mobileInputRef}
                  type="search"
                  enterKeyHint="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ciudad, provincia o país…"
                  className="flex-1 bg-transparent text-base text-white placeholder-white/40 outline-none"
                  aria-label="Buscar ubicación"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="Limpiar" className="text-white/40 hover:text-white/80">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className={cn('overflow-y-auto', 'h-[calc(100dvh-env(safe-area-inset-top)-4rem)]')}>
              {query.length < 2 && (
                <p className="px-4 py-6 text-center text-sm text-white/50">
                  Escribe al menos 2 caracteres para buscar.
                </p>
              )}
              {query.length >= 2 && results.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-white/50">Sin resultados</p>
              )}
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/10 active:bg-white/15"
                >
                  <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{result.name}</p>
                    <p className="truncate text-xs text-white/50">
                      {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
