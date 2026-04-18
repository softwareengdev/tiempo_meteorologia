'use client';

import { useRef, useEffect, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useWeatherStore } from '@/lib/stores';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export function WeatherMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const marker = useRef<maplibregl.Marker | null>(null);
  const { mapView, setMapView, selectedLocation, setSelectedLocation, locationName } =
    useWeatherStore();

  const initMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [mapView.longitude, mapView.latitude],
      zoom: mapView.zoom,
      pitch: mapView.pitch || 0,
      bearing: mapView.bearing || 0,
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      'bottom-right',
    );
    map.current.addControl(new maplibregl.ScaleControl(), 'bottom-left');
    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-left',
    );
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'bottom-right',
    );

    map.current.on('moveend', () => {
      if (!map.current) return;
      const center = map.current.getCenter();
      setMapView({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.current.getZoom(),
        pitch: map.current.getPitch(),
        bearing: map.current.getBearing(),
      });
    });

    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedLocation(
        { latitude: lat, longitude: lng },
        `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      );
    });

    // Add initial marker
    if (selectedLocation) {
      marker.current = new maplibregl.Marker({ color: '#38bdf8' })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .addTo(map.current);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    initMap();
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [initMap]);

  // Update marker when location changes
  useEffect(() => {
    if (!map.current || !selectedLocation) return;

    if (marker.current) {
      marker.current.setLngLat([selectedLocation.longitude, selectedLocation.latitude]);
    } else {
      marker.current = new maplibregl.Marker({ color: '#38bdf8' })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .addTo(map.current);
    }

    map.current.flyTo({
      center: [selectedLocation.longitude, selectedLocation.latitude],
      zoom: Math.max(map.current.getZoom(), 8),
      duration: 1500,
    });
  }, [selectedLocation]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full" />
      {/* Map overlay info */}
      <div className="pointer-events-none absolute bottom-16 left-4 z-10">
        <div className="pointer-events-auto rounded-xl border border-white/10 bg-gray-950/80 px-3 py-2 backdrop-blur-md">
          <p className="text-xs text-white/60">
            📍 {locationName} | Zoom: {mapView.zoom.toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
