export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  name: string;
  country: string;
  admin1?: string;
  coordinates: Coordinates;
  timezone: string;
  elevation?: number;
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  snowfall: number[];
  snow_depth: number[];
  weather_code: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  uv_index: number[];
  pressure_msl: number[];
  surface_pressure: number[];
  cape: number[];
  dew_point_2m: number[];
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface CurrentWeather {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface MinutelyForecast {
  time: string[];
  precipitation: number[];
  precipitation_probability?: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current?: CurrentWeather;
  minutely_15?: MinutelyForecast;
  hourly?: HourlyForecast;
  daily?: DailyForecast;
}

export interface WeatherModel {
  id: string;
  name: string;
  provider: string;
  resolution: string;
  description: string;
}

export type WeatherLayer =
  | 'temperature'
  | 'precipitation'
  | 'wind'
  | 'clouds'
  | 'pressure'
  | 'humidity'
  | 'snow'
  | 'visibility'
  | 'uv_index'
  | 'cape'
  | 'dew_point'
  | 'wind_gusts'
  | 'rain'
  | 'snowfall';

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code: string;
  country_code: string;
  country: string;
  admin1?: string;
  admin2?: string;
  timezone: string;
  population?: number;
}

export interface WeatherAlert {
  id: string;
  event: string;
  headline: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: string;
  end: string;
  areas: string;
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  visible: boolean;
}

export type WidgetType =
  | 'current-weather'
  | 'hourly-chart'
  | 'daily-forecast'
  | 'wind-rose'
  | 'uv-index'
  | 'air-quality'
  | 'precipitation'
  | 'pressure'
  | 'humidity'
  | 'sunrise-sunset'
  | 'radar-mini'
  | 'meteogram';
