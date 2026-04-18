import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Coordinates, MapViewState, WeatherLayer } from '@/types';

interface WeatherStore {
  // Location
  selectedLocation: Coordinates | null;
  locationName: string;
  setSelectedLocation: (coords: Coordinates, name: string) => void;

  // Map
  mapView: MapViewState;
  setMapView: (view: Partial<MapViewState>) => void;

  // Layers
  activeLayers: WeatherLayer[];
  toggleLayer: (layer: WeatherLayer) => void;
  setActiveLayers: (layers: WeatherLayer[]) => void;

  // Model
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      selectedLocation: { latitude: 40.4168, longitude: -3.7038 },
      locationName: 'Madrid, España',

      mapView: {
        longitude: -3.7038,
        latitude: 40.4168,
        zoom: 5,
        pitch: 0,
        bearing: 0,
      },

      activeLayers: ['temperature'] as WeatherLayer[],

      selectedModel: 'best_match',

      sidebarOpen: true,

      setSelectedLocation: (coords, name) =>
        set({
          selectedLocation: coords,
          locationName: name,
          mapView: {
            longitude: coords.longitude,
            latitude: coords.latitude,
            zoom: 10,
            pitch: 0,
            bearing: 0,
          },
        }),

      setMapView: (view) =>
        set((state) => ({
          mapView: { ...state.mapView, ...view },
        })),

      toggleLayer: (layer) =>
        set((state) => ({
          activeLayers: state.activeLayers.includes(layer)
            ? state.activeLayers.filter((l) => l !== layer)
            : [...state.activeLayers, layer],
        })),

      setActiveLayers: (layers) => set({ activeLayers: layers }),

      setSelectedModel: (model) => set({ selectedModel: model }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'aethercast-weather-store',
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        locationName: state.locationName,
        activeLayers: state.activeLayers,
        selectedModel: state.selectedModel,
      }),
    },
  ),
);
