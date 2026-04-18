'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import type { WeatherLayer } from '@/types';

interface WeatherOverlayProps {
  map: maplibregl.Map | null;
  activeLayers: WeatherLayer[];
  latitude: number;
  longitude: number;
}

const LAYER_COLORS: Record<WeatherLayer, string[]> = {
  temperature: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
  precipitation: ['rgba(0,0,0,0)', '#a6cee3', '#1f78b4', '#33a02c', '#ff7f00', '#e31a1c'],
  wind: ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'],
  clouds: ['rgba(0,0,0,0)', 'rgba(200,200,200,0.3)', 'rgba(180,180,180,0.5)', 'rgba(150,150,150,0.7)'],
  pressure: ['#7b3294', '#c2a5cf', '#f7f7f7', '#a6dba0', '#008837'],
  humidity: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c'],
  snow: ['rgba(0,0,0,0)', '#e0e0ff', '#c0c0ff', '#8080ff', '#4040ff', '#0000ff'],
  visibility: ['#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'],
  uv_index: ['#299501', '#f7e401', '#f95901', '#d90011', '#6c49c9'],
  cape: ['rgba(0,0,0,0)', '#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
  dew_point: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd'],
  wind_gusts: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
  rain: ['rgba(0,0,0,0)', '#c6dbef', '#6baed6', '#2171b5', '#08306b'],
  snowfall: ['rgba(0,0,0,0)', '#e8e8ff', '#b0b0ff', '#6060ff', '#0000cc'],
};

export function useWeatherOverlay({ map, activeLayers, latitude, longitude }: WeatherOverlayProps) {
  const prevLayers = useRef<WeatherLayer[]>([]);

  useEffect(() => {
    if (!map) return;

    // Remove layers that are no longer active
    const removed = prevLayers.current.filter((l) => !activeLayers.includes(l));
    for (const layer of removed) {
      const layerId = `weather-${layer}`;
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(layerId)) map.removeSource(layerId);
    }

    // Add new active layers as colored circles around the selected point
    const added = activeLayers.filter((l) => !prevLayers.current.includes(l));
    for (const layer of added) {
      const layerId = `weather-${layer}`;
      const colors = LAYER_COLORS[layer];

      if (!map.getSource(layerId)) {
        map.addSource(layerId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: generateGridPoints(latitude, longitude, layer),
          },
        });
      }

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'circle',
          source: layerId,
          paint: {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 4, 6, 8, 10, 16],
            'circle-color': ['interpolate', ['linear'], ['get', 'value'],
              0, colors[0] || '#000',
              0.25, colors[Math.floor(colors.length * 0.25)] || colors[0] || '#000',
              0.5, colors[Math.floor(colors.length * 0.5)] || colors[0] || '#000',
              0.75, colors[Math.floor(colors.length * 0.75)] || colors[0] || '#000',
              1, colors[colors.length - 1] || '#fff',
            ],
            'circle-opacity': 0.6,
            'circle-blur': 0.8,
          },
        });
      }
    }

    prevLayers.current = [...activeLayers];
  }, [map, activeLayers, latitude, longitude]);
}

function generateGridPoints(lat: number, lon: number, layer: WeatherLayer) {
  const features = [];
  const gridSize = 8;
  const spread = 2;

  for (let i = -gridSize; i <= gridSize; i++) {
    for (let j = -gridSize; j <= gridSize; j++) {
      const pointLat = lat + i * (spread / gridSize);
      const pointLon = lon + j * (spread / gridSize);
      const distance = Math.sqrt(i * i + j * j) / gridSize;
      const noise = Math.sin(pointLat * 10 + pointLon * 10) * 0.3 + 0.5;
      const value = Math.max(0, Math.min(1, noise + (1 - distance) * 0.3));

      features.push({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [pointLon, pointLat],
        },
        properties: {
          value,
          layer,
        },
      });
    }
  }

  return features;
}
