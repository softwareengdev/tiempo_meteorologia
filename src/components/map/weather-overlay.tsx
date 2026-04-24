'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { WeatherLayer } from '@/types';
import {
  LAYER_COLORS, LAYER_RANGES, RAINVIEWER_LAYERS,
  toApiField, buildColorExpression, sampleGrid, clamp01,
} from './overlay-utils';

/** Re-export for backwards compatibility (used by MapLegend). */
export { LAYER_COLORS, LAYER_RANGES };

interface WeatherOverlayProps {
  map: maplibregl.Map | null;
  activeLayers: WeatherLayer[];
  /** Optional callback so the WindParticles canvas can read the latest wind grid. */
  onWindGrid?: (grid: WindGridSample[] | null) => void;
}

export interface WindGridSample {
  lon: number;
  lat: number;
  speed: number; // m/s
  /** Meteorological direction in degrees (FROM). */
  direction: number;
}

const ALWAYS_VECTOR_LAYERS: WeatherLayer[] = ['wind', 'wind_gusts'];

/** fetch with retry + exponential backoff (handles transient 429/5xx) */
async function fetchWithRetry(url: string, signal: AbortSignal, attempts = 3): Promise<Response | null> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { signal });
      if (res.ok) return res;
      if (res.status >= 400 && res.status < 500 && res.status !== 429) return res;
      // retryable
      lastErr = new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (signal.aborted) return null;
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 600 * 2 ** i));
    if (signal.aborted) return null;
  }
  void lastErr;
  return null;
}

interface OverlayState {
  abort: AbortController | null;
  /** Layers currently drawn on the map (managed by us). */
  drawn: Set<WeatherLayer>;
  /** Layers whose source data is up to date for current bbox. */
  hasData: Set<WeatherLayer>;
  styleEpoch: number;
}

export function useWeatherOverlay({ map, activeLayers, onWindGrid }: WeatherOverlayProps) {
  const state = useRef<OverlayState>({
    abort: null,
    drawn: new Set(),
    hasData: new Set(),
    styleEpoch: 0,
  });
  const radarMeta = useRef<{ host: string; path: string } | null>(null);
  const layersRef = useRef<WeatherLayer[]>(activeLayers);
  layersRef.current = activeLayers;

  /* ---------------------------------------------------------------- */
  /*  RainViewer radar metadata                                       */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        const past = j?.radar?.past;
        if (past?.length) {
          radarMeta.current = { host: j.host, path: past[past.length - 1].path };
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  /* ---------------------------------------------------------------- */
  /*  Re-add layers after a basemap style switch                      */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!map) return;
    const onStyleLoad = () => {
      // Map style was swapped — all custom sources/layers are gone, mark drawn empty
      state.current.drawn.clear();
      state.current.hasData.clear();
      state.current.styleEpoch += 1;
      // Trigger a re-application by emitting a synthetic moveend on next frame
      requestAnimationFrame(() => map.fire('moveend'));
    };
    map.on('style.load', onStyleLoad);
    return () => { map.off('style.load', onStyleLoad); };
  }, [map]);

  /* ---------------------------------------------------------------- */
  /*  Main effect: refresh on layer change + map move                 */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (!map) return;

    const removeLayer = (layer: WeatherLayer) => {
      const fillId  = `wx-fill-${layer}`;
      const srcId   = `wx-src-${layer}`;
      try {
        if (map.getLayer(fillId))  map.removeLayer(fillId);
        if (map.getSource(srcId))  map.removeSource(srcId);
      } catch { /* style swap race */ }
      state.current.drawn.delete(layer);
      state.current.hasData.delete(layer);
    };

    const addRadar = () => {
      const meta = radarMeta.current;
      if (!meta) return;
      try {
        if (!map.getSource('rainviewer-radar')) {
          map.addSource('rainviewer-radar', {
            type: 'raster',
            tiles: [`${meta.host}${meta.path}/256/{z}/{x}/{y}/4/1_1.png`],
            tileSize: 256,
            attribution: '© RainViewer',
          });
        }
        if (!map.getLayer('rainviewer-radar')) {
          map.addLayer({
            id: 'rainviewer-radar',
            type: 'raster',
            source: 'rainviewer-radar',
            paint: { 'raster-opacity': 0.78 },
          });
        }
      } catch { /* race */ }
    };
    const removeRadar = () => {
      try {
        if (map.getLayer('rainviewer-radar'))  map.removeLayer('rainviewer-radar');
        if (map.getSource('rainviewer-radar')) map.removeSource('rainviewer-radar');
      } catch { /* race */ }
    };

    /* --- core grid refresh, fetches all needed scalar+vector fields in 1 call --- */
    const refresh = async () => {
      if (!map.isStyleLoaded()) return;
      const layers = layersRef.current;

      // RainViewer raster radar (precipitation/rain/snow)
      const wantsRadar = layers.some((l) => RAINVIEWER_LAYERS.includes(l));
      if (wantsRadar) addRadar(); else removeRadar();

      // Field layers (everything except radar-only fields, since those have no point sample meaning)
      const fieldLayers = layers.filter(
        (l) => !RAINVIEWER_LAYERS.includes(l) && !ALWAYS_VECTOR_LAYERS.includes(l),
      );
      const wantsWindGrid = layers.some((l) => ALWAYS_VECTOR_LAYERS.includes(l));

      // Garbage-collect layers no longer requested
      for (const drawn of [...state.current.drawn]) {
        if (!fieldLayers.includes(drawn)) removeLayer(drawn);
      }

      // No work needed for grid?
      if (!fieldLayers.length && !wantsWindGrid) {
        if (onWindGrid) onWindGrid(null);
        return;
      }

      const b = map.getBounds();
      const bbox: [number, number, number, number] = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
      const points = sampleGrid(bbox, map.getZoom());

      // Build the field list. Always include wind_speed_10m + wind_direction_10m if wind grid wanted.
      const apiFields = new Set<string>();
      for (const l of fieldLayers) {
        const f = toApiField(l);
        if (f) apiFields.add(f);
      }
      if (wantsWindGrid) {
        apiFields.add('wind_speed_10m');
        apiFields.add('wind_direction_10m');
      }
      if (!apiFields.size) return;

      // Cancel previous in-flight
      state.current.abort?.abort();
      const ac = new AbortController();
      state.current.abort = ac;

      const params = new URLSearchParams({
        latitude:  points.map((p) => p[1].toFixed(3)).join(','),
        longitude: points.map((p) => p[0].toFixed(3)).join(','),
        current:   [...apiFields].join(','),
        timezone:  'auto',
      });

      let json: unknown;
      try {
        // In production (Cloudflare Pages) `/api/wx/grid` is a Pages Function
        // that proxies + caches Open-Meteo, side-stepping per-IP 429 limits.
        // In local dev (`output: 'export'`, no Functions runtime) the proxy
        // 404s, so we fall back to calling Open-Meteo directly.
        let res = await fetchWithRetry(`/api/wx/grid?${params}`, ac.signal, 1);
        if (!res || res.status === 404) {
          res = await fetchWithRetry(`https://api.open-meteo.com/v1/forecast?${params}`, ac.signal);
        }
        if (!res || !res.ok) return;
        json = await res.json();
      } catch {
        return;
      }
      if (json && typeof json === 'object' && (json as { error?: string }).error) {
        return;
      }
      const arr = (Array.isArray(json) ? json : [json]) as Array<{ current?: Record<string, number> }>;

      // Push wind grid up to particles
      if (wantsWindGrid && onWindGrid) {
        const grid: WindGridSample[] = points.map((p, i) => ({
          lon: p[0],
          lat: p[1],
          speed: arr[i]?.current?.wind_speed_10m ?? 0,
          direction: arr[i]?.current?.wind_direction_10m ?? 0,
        }));
        onWindGrid(grid);
      } else if (onWindGrid) {
        onWindGrid(null);
      }

      // Render each scalar field as a blurred circle layer (proper field visualization)
      for (const layer of fieldLayers) {
        const field = toApiField(layer);
        if (!field) continue;
        const [vmin, vmax] = LAYER_RANGES[layer];

        const features: GeoJSON.Feature[] = points.map((p, i) => {
          const raw = arr[i]?.current?.[field];
          const v = clamp01(((raw ?? NaN) - vmin) / (vmax - vmin));
          return {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: p },
            properties: {
              value: v,
              raw: Number.isFinite(raw) ? raw : null,
              hasData: Number.isFinite(raw) ? 1 : 0,
            },
          };
        });
        const geo: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features };

        const srcId  = `wx-src-${layer}`;
        const fillId = `wx-fill-${layer}`;
        const existing = map.getSource(srcId) as maplibregl.GeoJSONSource | undefined;

        if (existing) {
          existing.setData(geo);
          state.current.hasData.add(layer);
          continue;
        }

        try {
          map.addSource(srcId, { type: 'geojson', data: geo });
          map.addLayer({
            id: fillId,
            type: 'circle',
            source: srcId,
            filter: ['==', ['get', 'hasData'], 1],
            paint: {
              // Big, blurred circles overlap → smooth field appearance
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                1, 28,
                3, 48,
                5, 80,
                7, 120,
                9, 170,
                12, 240,
                15, 360,
              ],
              'circle-color': buildColorExpression(layer) as maplibregl.ExpressionSpecification,
              'circle-blur': 1.0,
              'circle-opacity': layer === 'clouds' ? 0.85 : 0.55,
              'circle-pitch-alignment': 'map',
            },
          });
          state.current.drawn.add(layer);
          state.current.hasData.add(layer);
        } catch { /* style swap race */ }
      }
    };

    // Debounced moveend handler
    let t: ReturnType<typeof setTimeout> | null = null;
    const debouncedRefresh = () => {
      if (t) clearTimeout(t);
      t = setTimeout(refresh, 220);
    };

    if (map.isStyleLoaded()) refresh();
    else map.once('styledata', refresh);
    map.on('moveend', debouncedRefresh);

    return () => {
      if (t) clearTimeout(t);
      map.off('moveend', debouncedRefresh);
      state.current.abort?.abort();
    };
  }, [map, activeLayers, onWindGrid]);
}
