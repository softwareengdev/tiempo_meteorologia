'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import { useWeatherStore } from '@/lib/stores';
import { useWeatherOverlay, type WindGridSample } from './weather-overlay';
import { MapLegend } from './map-legend';
import { TimeSlider } from './time-slider';
import { WindParticles } from './wind-particles';
import { StormHunter } from './storm-hunter';
import { CustomMapControls } from './custom-map-controls';

const MAP_STYLE_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export function WeatherMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const [windGrid, setWindGrid] = useState<WindGridSample[] | null>(null);
  const { resolvedTheme } = useTheme();
  const { mapView, setMapView, selectedLocation, setSelectedLocation, locationName, activeLayers } =
    useWeatherStore();
  const panelHeightPx = useWeatherStore((s) => s.panelHeightPx);
  const setSearchOpen = useWeatherStore((s) => s.setSearchOpen);

  useWeatherOverlay({ map: mapInstance, activeLayers, onWindGrid: setWindGrid });

  const styleUrl = resolvedTheme === 'light' ? MAP_STYLE_LIGHT : MAP_STYLE_DARK;

  const initMap = useCallback(() => {
    if (!mapContainer.current || mapRef.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: [mapView.longitude, mapView.latitude],
      zoom: mapView.zoom,
      pitch: mapView.pitch || 0,
      bearing: mapView.bearing || 0,
      attributionControl: false,
      cooperativeGestures: false,
      scrollZoom: true,
      keyboard: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
      dragRotate: true,
      maxZoom: 18,
      minZoom: 1.5,
    });
    mapRef.current = m;

    m.addControl(new maplibregl.ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left');
    m.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    m.on('moveend', () => {
      const center = m.getCenter();
      setMapView({
        longitude: center.lng,
        latitude: center.lat,
        zoom: m.getZoom(),
        pitch: m.getPitch(),
        bearing: m.getBearing(),
      });
    });

    m.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedLocation(
        { latitude: lat, longitude: lng },
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      );
    });

    m.on('load', () => setMapInstance(m));

    if (selectedLocation) {
      marker.current = new maplibregl.Marker({ color: '#38bdf8' })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .addTo(m);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initMap();
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [initMap]);

  useEffect(() => {
    if (mapRef.current) {
      try { mapRef.current.setStyle(styleUrl); } catch { /* noop */ }
    }
  }, [styleUrl]);

  useEffect(() => {
    if (!mapRef.current || !selectedLocation) return;

    if (marker.current) {
      marker.current.setLngLat([selectedLocation.longitude, selectedLocation.latitude]);
    } else {
      marker.current = new maplibregl.Marker({ color: '#38bdf8' })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .addTo(mapRef.current);
    }

    mapRef.current.flyTo({
      center: [selectedLocation.longitude, selectedLocation.latitude],
      zoom: Math.max(mapRef.current.getZoom(), 8),
      duration: 1500,
      // Bias the visual center upward so the marker isn't hidden behind
      // the bottom info panel on mobile.
      padding: { top: 80, bottom: panelHeightPx + 40, left: 24, right: 24 },
    });
  }, [selectedLocation, panelHeightPx]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      <WindParticles map={mapInstance} grid={windGrid} />
      <TimeSlider />
      <CustomMapControls map={mapInstance} />

      {/* Top row of map controls — Capas (left) · Ubicación (center) · Caza (right).
          Compact pills sized so all three always fit on a 360 px viewport. */}
      <div className="pointer-events-none absolute inset-x-2 top-2 z-10 flex items-start justify-between gap-1.5">
        <div className="flex shrink-0">
          <MapLegend />
        </div>
        <div className="flex min-w-0 flex-1 justify-center">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="pointer-events-auto flex max-w-full min-w-0 items-center gap-1 rounded-full border border-white/15 bg-[#0b1020]/70 px-2 py-1 text-[11px] font-semibold text-white/85 shadow-lg backdrop-blur-md backdrop-saturate-150 transition-colors hover:bg-[#0b1020]/90 hover:text-white"
            aria-label={`Cambiar ubicación. Actual: ${locationName}`}
          >
            <span aria-hidden="true" className="text-[12px] leading-none">📍</span>
            <span className="truncate max-w-[34vw] sm:max-w-[200px]">{locationName}</span>
          </button>
        </div>
        <div className="flex shrink-0 justify-end">
          <StormHunter />
        </div>
      </div>
    </div>
  );
}
