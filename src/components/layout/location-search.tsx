'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { useLocationSearch } from '@/lib/hooks';
import { useWeatherStore } from '@/lib/stores';
import type { GeocodingResult } from '@/types';

export function LocationSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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

  return (
    <div className="relative" ref={dropdownRef}>
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
          className="w-48 bg-transparent text-sm text-white placeholder-white/40 outline-none lg:w-64"
          aria-label="Buscar ubicación"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="text-white/40 hover:text-white/80"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl backdrop-blur-xl">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
            >
              <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {result.name}
                </p>
                <p className="truncate text-xs text-white/50">
                  {result.admin1 ? `${result.admin1}, ` : ''}
                  {result.country}
                </p>
              </div>
              {result.population && result.population > 0 && (
                <span className="ml-auto text-xs text-white/30">
                  {result.population.toLocaleString('es')} hab.
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
