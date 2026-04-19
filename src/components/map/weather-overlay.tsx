'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { WeatherLayer } from '@/types';

interface WeatherOverlayProps {
  map: maplibregl.Map | null;
  activeLayers: WeatherLayer[];
}

/* Color ramps per layer (low → high) */
export const LAYER_COLORS: Record<WeatherLayer, string[]> = {
  temperature: ['#3b1d6e', '#2a4798', '#3a89c9', '#7ec8ee', '#c6e8b8', '#fce98a', '#f7a35c', '#e34a33', '#a50026'],
  precipitation: ['rgba(0,0,0,0)', '#a6cee3', '#1f78b4', '#33a02c', '#ff7f00', '#e31a1c'],
  rain: ['rgba(0,0,0,0)', '#c6dbef', '#6baed6', '#2171b5', '#08306b'],
  snow: ['rgba(0,0,0,0)', '#e0e0ff', '#c0c0ff', '#8080ff', '#4040ff', '#0000ff'],
  snowfall: ['rgba(0,0,0,0)', '#e8e8ff', '#b0b0ff', '#6060ff', '#0000cc'],
  wind: ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'],
  wind_gusts: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
  clouds: ['rgba(0,0,0,0)', 'rgba(200,200,200,0.3)', 'rgba(180,180,180,0.55)', 'rgba(150,150,150,0.78)'],
  pressure: ['#7b3294', '#c2a5cf', '#f7f7f7', '#a6dba0', '#008837'],
  humidity: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
  visibility: ['#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'],
  uv_index: ['#299501', '#f7e401', '#f95901', '#d90011', '#6c49c9'],
  cape: ['rgba(0,0,0,0)', '#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
  dew_point: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd'],
};

/* Min/max ranges for normalization (approx Earth ranges) */
const RANGES: Record<WeatherLayer, [number, number]> = {
  temperature: [-30, 45],
  precipitation: [0, 30],
  rain: [0, 30],
  snow: [0, 200],
  snowfall: [0, 30],
  wind: [0, 35],
  wind_gusts: [0, 50],
  clouds: [0, 100],
  pressure: [970, 1040],
  humidity: [0, 100],
  visibility: [0, 30000],
  uv_index: [0, 12],
  cape: [0, 4000],
  dew_point: [-20, 30],
};

const RAINVIEWER_LAYERS: WeatherLayer[] = ['precipitation', 'rain', 'snow', 'snowfall'];

interface OverlayCache {
  bbox: [number, number, number, number] | null;
  data: Record<string, GeoJSON.Feature[]>;
  abort: AbortController | null;
}

export function useWeatherOverlay({ map, activeLayers }: WeatherOverlayProps) {
  const prevLayers = useRef<WeatherLayer[]>([]);
  const cache = useRef<OverlayCache>({ bbox: null, data: {}, abort: null });
  const radarMeta = useRef<{ host: string; path: string } | null>(null);

  /* Fetch RainViewer current radar timestamp once */
  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((r) => r.json())
      .then((j) => {
        const past = j?.radar?.past;
        if (past?.length) {
          radarMeta.current = { host: j.host, path: past[past.length - 1].path };
        }
      })
      .catch(() => {});
  }, []);

  /* Add/remove RainViewer raster layers */
  useEffect(() => {
    if (!map) return;

    const addRadar = () => {
      const meta = radarMeta.current;
      if (!meta) return;
      if (map.getLayer('rainviewer-radar')) return;
      if (!map.getSource('rainviewer-radar')) {
        map.addSource('rainviewer-radar', {
          type: 'raster',
          tiles: [`${meta.host}${meta.path}/256/{z}/{x}/{y}/4/1_1.png`],
          tileSize: 256,
          attribution: '© RainViewer',
        });
      }
      map.addLayer({
        id: 'rainviewer-radar',
        type: 'raster',
        source: 'rainviewer-radar',
        paint: { 'raster-opacity': 0.75 },
      });
    };

    const removeRadar = () => {
      if (map.getLayer('rainviewer-radar')) map.removeLayer('rainviewer-radar');
      if (map.getSource('rainviewer-radar')) map.removeSource('rainviewer-radar');
    };

    const wantsRadar = activeLayers.some((l) => RAINVIEWER_LAYERS.includes(l));
    if (wantsRadar) {
      if (map.isStyleLoaded()) addRadar();
      else map.once('styledata', addRadar);
    } else removeRadar();
  }, [map, activeLayers]);

  /* Add/remove grid sample layers for non-radar fields */
  useEffect(() => {
    if (!map) return;

    const removed = prevLayers.current.filter((l) => !activeLayers.includes(l));
    for (const layer of removed) {
      const id = `weather-grid-${layer}`;
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getLayer(`${id}-labels`)) map.removeLayer(`${id}-labels`);
      if (map.getSource(id)) map.removeSource(id);
    }

    const griddable = activeLayers.filter((l) => !RAINVIEWER_LAYERS.includes(l));
    if (!griddable.length) {
      prevLayers.current = [...activeLayers];
      return;
    }

    const refresh = async () => {
      if (!map) return;
      const b = map.getBounds();
      const bbox: [number, number, number, number] = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];

      cache.current.abort?.abort();
      const ac = new AbortController();
      cache.current.abort = ac;

      const points = sampleGrid(bbox, map.getZoom());
      let data: Record<string, number[]> = {};
      try {
        const params = new URLSearchParams({
          latitude: points.map((p) => p[1].toFixed(3)).join(','),
          longitude: points.map((p) => p[0].toFixed(3)).join(','),
          current: griddable.map(toApiField).filter(Boolean).join(','),
          timezone: 'auto',
        });
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal: ac.signal });
        if (!res.ok) throw new Error('grid fetch');
        const json = await res.json();
        const arr = Array.isArray(json) ? json : [json];
        for (const layer of griddable) {
          const field = toApiField(layer);
          if (!field) continue;
          data[layer] = arr.map((r: { current?: Record<string, number> }) => r.current?.[field] ?? NaN);
        }
      } catch {
        return;
      }

      for (const layer of griddable) {
        const id = `weather-grid-${layer}`;
        const colors = LAYER_COLORS[layer];
        const [vmin, vmax] = RANGES[layer];
        const features: GeoJSON.Feature[] = points.map((p, i) => {
          const raw = data[layer]?.[i] ?? NaN;
          return {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: p },
            properties: {
              value: clamp01((raw - vmin) / (vmax - vmin)),
              raw: Number.isFinite(raw) ? raw : null,
            },
          };
        });

        const geo: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features };
        const src = map.getSource(id) as maplibregl.GeoJSONSource | undefined;
        if (src) {
          src.setData(geo);
          continue;
        }

        map.addSource(id, { type: 'geojson', data: geo });

        // Interpolated heatmap (smooth, no visible grid dots)
        // Build color ramp for heatmap-color expression: needs density 0 → transparent
        const colorStops: unknown[] = ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,0,0,0)'];
        for (let k = 0; k < colors.length; k++) {
          const stop = (k + 1) / colors.length;
          colorStops.push(stop, colors[k]);
        }

        map.addLayer({
          id,
          type: 'heatmap',
          source: id,
          paint: {
            'heatmap-weight': ['interpolate', ['linear'], ['get', 'value'], 0, 0, 1, 1],
            'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0.6, 4, 1.2, 9, 2.5, 14, 4],
            'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 30, 4, 60, 6, 90, 9, 140, 14, 240],
            'heatmap-color': colorStops as unknown as maplibregl.ExpressionSpecification,
            'heatmap-opacity': 0.65,
          },
        });
      }
    };

    let t: ReturnType<typeof setTimeout>;
    const debouncedRefresh = () => {
      clearTimeout(t);
      t = setTimeout(refresh, 250);
    };

    if (map.isStyleLoaded()) refresh();
    else map.once('styledata', refresh);
    map.on('moveend', debouncedRefresh);

    prevLayers.current = [...activeLayers];

    return () => {
      clearTimeout(t);
      map.off('moveend', debouncedRefresh);
    };
  }, [map, activeLayers]);
}

function clamp01(v: number) {
  if (Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function sampleGrid(bbox: [number, number, number, number], zoom: number): [number, number][] {
  const [w, s, e, n] = bbox;
  // Grid density adapts to zoom
  const cells = zoom < 4 ? 6 : zoom < 6 ? 8 : zoom < 9 ? 10 : 12;
  const lonStep = (e - w) / cells;
  const latStep = (n - s) / cells;
  const out: [number, number][] = [];
  for (let i = 0; i <= cells; i++) {
    for (let j = 0; j <= cells; j++) {
      out.push([w + i * lonStep, s + j * latStep]);
    }
  }
  return out;
}

function toApiField(layer: WeatherLayer): string {
  switch (layer) {
    case 'temperature': return 'temperature_2m';
    case 'wind': return 'wind_speed_10m';
    case 'wind_gusts': return 'wind_gusts_10m';
    case 'clouds': return 'cloud_cover';
    case 'pressure': return 'pressure_msl';
    case 'humidity': return 'relative_humidity_2m';
    case 'visibility': return 'visibility';
    case 'uv_index': return 'uv_index';
    case 'cape': return 'cape';
    case 'dew_point': return 'dew_point_2m';
    default: return '';
  }
}
