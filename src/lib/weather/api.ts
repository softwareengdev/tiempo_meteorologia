import type { Coordinates, WeatherResponse, GeocodingResult } from '@/types';

const OPEN_METEO_BASE = process.env.NEXT_PUBLIC_OPEN_METEO_BASE || 'https://api.open-meteo.com';
/** Cloudflare Pages Function that proxies + caches Open-Meteo. Local dev returns 404 → we fallback. */
const PROXY_BASE = '/api/wx/grid';

/** Prefer same-origin proxy (single egress IP, edge cache, no per-user 429).
 *  Falls back to direct Open-Meteo when:
 *   - proxy is not deployed (404, local dev)
 *   - proxy returns a degraded payload (200 with `error` field — happens when
 *     Open-Meteo rate-limits the Cloudflare egress IP and the worker returns
 *     a `current: null` body to avoid throwing)
 *   - any unexpected non-ok status
 */
async function fetchOpenMeteoForecast(params: URLSearchParams): Promise<Response> {
  if (typeof window !== 'undefined') {
    try {
      const proxied = await fetch(`${PROXY_BASE}?${params}`);
      if (proxied.ok) {
        // Detect the worker's degraded fallback (200 + { error, current: null }).
        // We need to inspect the body without consuming the original Response,
        // so clone first and restore via a fresh Response if it turns out fine.
        try {
          const clone = proxied.clone();
          const txt = await clone.text();
          if (txt && txt.length < 240 && txt.includes('"error"') && txt.includes('"current":null')) {
            // Skip degraded payload — fall through to direct Open-Meteo below.
          } else {
            return new Response(txt, { status: proxied.status, headers: proxied.headers });
          }
        } catch {
          return proxied;
        }
      } else if (proxied.status !== 404) {
        return proxied;
      }
    } catch {
      // network error → fallback
    }
  }
  return fetch(`${OPEN_METEO_BASE}/v1/forecast?${params}`);
}

const CURRENT_PARAMS = [
  'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
  'is_day', 'precipitation', 'rain', 'snowfall', 'weather_code',
  'cloud_cover', 'pressure_msl', 'surface_pressure',
  'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
].join(',');

const HOURLY_PARAMS = [
  'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
  'precipitation_probability', 'precipitation', 'rain', 'snowfall',
  'snow_depth', 'weather_code', 'cloud_cover', 'visibility',
  'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m',
  'uv_index', 'pressure_msl', 'surface_pressure', 'cape', 'dew_point_2m',
].join(',');

const DAILY_PARAMS = [
  'weather_code', 'temperature_2m_max', 'temperature_2m_min',
  'apparent_temperature_max', 'apparent_temperature_min',
  'sunrise', 'sunset', 'uv_index_max',
  'precipitation_sum', 'rain_sum', 'snowfall_sum',
  'precipitation_hours', 'precipitation_probability_max',
  'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant',
].join(',');

export async function getForecast(
  coords: Coordinates,
  model?: string,
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: coords.latitude.toString(),
    longitude: coords.longitude.toString(),
    current: CURRENT_PARAMS,
    minutely_15: 'precipitation,precipitation_probability',
    hourly: HOURLY_PARAMS,
    daily: DAILY_PARAMS,
    timezone: 'auto',
    forecast_days: '7',
    forecast_minutely_15: '24',
  });

  if (model) {
    params.set('models', model);
  }

  const res = await fetchOpenMeteoForecast(params);

  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }

  return res.json();
}

export async function getMultiModelForecast(
  coords: Coordinates,
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: coords.latitude.toString(),
    longitude: coords.longitude.toString(),
    current: CURRENT_PARAMS,
    hourly: HOURLY_PARAMS,
    daily: DAILY_PARAMS,
    timezone: 'auto',
    forecast_days: '7',
    models: 'ecmwf_ifs025,icon_global,gfs_global',
  });

  const res = await fetchOpenMeteoForecast(params);

  if (!res.ok) {
    throw new Error(`Multi-model API error: ${res.status}`);
  }

  return res.json();
}

export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: 'es',
    format: 'json',
  });

  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.results || [];
}

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna intensa',
    56: 'Llovizna helada ligera',
    57: 'Llovizna helada intensa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    66: 'Lluvia helada ligera',
    67: 'Lluvia helada intensa',
    71: 'Nevada ligera',
    73: 'Nevada moderada',
    75: 'Nevada intensa',
    77: 'Granizo',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos intensos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve intensos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo intenso',
  };
  return descriptions[code] || 'Desconocido';
}

export function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code <= 2) return isDay ? '⛅' : '☁️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO'];
  const index = Math.round(degrees / 22.5) % 16;
  return dirs[index];
}
