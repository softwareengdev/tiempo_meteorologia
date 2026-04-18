'use client';

import { useQuery } from '@tanstack/react-query';
import { getForecast, searchLocations } from '@/lib/weather';
import type { Coordinates } from '@/types';

export function useWeatherForecast(coords: Coordinates | null) {
  return useQuery({
    queryKey: ['forecast', coords?.latitude, coords?.longitude],
    queryFn: () => getForecast(coords!),
    enabled: !!coords,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: ['locations', query],
    queryFn: () => searchLocations(query),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}
