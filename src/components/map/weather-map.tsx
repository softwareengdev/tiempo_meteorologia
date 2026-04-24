'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useTheme } from 'next-themes';
import { useWeatherStore } from '@/lib/stores';
import { useWeatherOverlay } from './weather-overlay';
import { MapLegend } from './map-legend';
import { TimeSlider } from './time-slider';
import { WindParticles } from './wind-particles';

const MAP_STYLE_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

export function WeatherMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const { resolvedTheme } = useTheme();
  const { mapView, setMapView, selectedLocation, setSelectedLocation, locationName, activeLayers } =
    useWeatherStore();

  useWeatherOverlay({ map: mapInstance, activeLayers });

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
    });
    mapRef.current = m;

    m.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    m.addControl(new maplibregl.ScaleControl(), 'bottom-left');
    m.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
    m.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'bottom-right',
    );

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
    });
  }, [selectedLocation]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      <WindParticles map={mapInstance} />
      <MapLegend />
      <TimeSlider />
      <div className="pointer-events-none absolute top-3 left-1/2 z-10 -translate-x-1/2">
        <div className="pointer-events-auto rounded-full border border-white/10 bg-[#0b1020]/85 px-4 py-1.5 backdrop-blur-md shadow-lg">
          <p className="text-[13px] font-medium text-white/80">
            📍 {locationName}
          </p>
        </div>
      </div>
    </div>
  );
}
