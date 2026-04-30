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

  // Forecast time scrub (hours offset from now, 0..47)
  forecastHourOffset: number;
  setForecastHourOffset: (h: number) => void;

  // Favorites
  favorites: { name: string; coords: Coordinates }[];
  addFavorite: (name: string, coords: Coordinates) => void;
  removeFavorite: (name: string) => void;

  // UI
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Mobile UX
  mobileTab: 'now' | 'today' | 'week' | 'detail';
  setMobileTab: (t: 'now' | 'today' | 'week' | 'detail') => void;
  outdoorMode: boolean;
  toggleOutdoorMode: () => void;
  stormHunter: boolean;
  toggleStormHunter: () => void;
  /** Pixels of the bottom panel currently visible on screen. Used by the
   * map to bias flyTo padding so the selected marker is centered in the
   * remaining visible area. */
  panelHeightPx: number;
  setPanelHeightPx: (h: number) => void;
  /** Mobile floating search modal visibility. Lifted to the store so any
   * map overlay (e.g. the location pill) can open it. */
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
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

      // Default cerrada: en mobile evita tapar el contenido al primer paint;
      // en desktop la rehidrata abierta el efecto en `app/page.tsx` (matchMedia).
      sidebarOpen: false,

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

      forecastHourOffset: 0,
      setForecastHourOffset: (h) => set({ forecastHourOffset: Math.max(0, Math.min(47, h)) }),

      favorites: [],
      addFavorite: (name, coords) =>
        set((state) =>
          state.favorites.some((f) => f.name === name)
            ? state
            : { favorites: [...state.favorites, { name, coords }] },
        ),
      removeFavorite: (name) =>
        set((state) => ({ favorites: state.favorites.filter((f) => f.name !== name) })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      mobileTab: 'now',
      setMobileTab: (t) => set({ mobileTab: t }),
      outdoorMode: false,
      toggleOutdoorMode: () => set((state) => ({ outdoorMode: !state.outdoorMode })),
      stormHunter: false,
      toggleStormHunter: () =>
        set((state) => {
          if (state.stormHunter) {
            return { stormHunter: false };
          }
          // Activar capas relevantes para caza-tormentas
          const need: WeatherLayer[] = ['cape', 'wind_gusts', 'precipitation'];
          const merged = Array.from(new Set([...state.activeLayers, ...need]));
          return { stormHunter: true, activeLayers: merged };
        }),

      panelHeightPx: 0,
      setPanelHeightPx: (h) => set({ panelHeightPx: Math.max(0, Math.round(h)) }),

      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
    }),
    {
      name: 'aethercast-weather-store',
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        locationName: state.locationName,
        activeLayers: state.activeLayers,
        selectedModel: state.selectedModel,
        favorites: state.favorites,
        outdoorMode: state.outdoorMode,
        mobileTab: state.mobileTab,
        stormHunter: state.stormHunter,
      }),
    },
  ),
);
