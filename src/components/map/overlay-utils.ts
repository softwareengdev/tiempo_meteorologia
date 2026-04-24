import type { WeatherLayer } from '@/types';

/* Color ramps per layer (low → high). Each ramp has at least 4 stops. */
export const LAYER_COLORS: Record<WeatherLayer, string[]> = {
  temperature:   ['#3b1d6e', '#2a4798', '#3a89c9', '#7ec8ee', '#c6e8b8', '#fce98a', '#f7a35c', '#e34a33', '#a50026'],
  precipitation: ['rgba(160,200,230,0)', '#a6cee3', '#1f78b4', '#33a02c', '#ff7f00', '#e31a1c'],
  rain:          ['rgba(160,200,230,0)', '#c6dbef', '#6baed6', '#2171b5', '#08306b'],
  snow:          ['rgba(220,220,255,0)', '#e0e0ff', '#c0c0ff', '#8080ff', '#4040ff', '#0000ff'],
  snowfall:      ['rgba(220,220,255,0)', '#e8e8ff', '#b0b0ff', '#6060ff', '#0000cc'],
  wind:          ['#a8e6ff', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#0c2c84'],
  wind_gusts:    ['#fffacd', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#b10026'],
  clouds:        ['rgba(220,220,220,0)', 'rgba(200,200,200,0.55)', 'rgba(170,170,170,0.78)', 'rgba(120,120,120,0.92)'],
  pressure:      ['#7b3294', '#c2a5cf', '#f7f7f7', '#a6dba0', '#008837'],
  humidity:      ['#fffacd', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
  visibility:    ['#d73027', '#fc8d59', '#fee08b', '#ffffbf', '#d9ef8b', '#91cf60', '#1a9850'],
  uv_index:      ['#299501', '#f7e401', '#f95901', '#d90011', '#6c49c9'],
  cape:          ['rgba(255,255,180,0)', '#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'],
  dew_point:     ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd'],
};

/* Min/max ranges for normalization (approx Earth ranges) */
export const LAYER_RANGES: Record<WeatherLayer, [number, number]> = {
  temperature:   [-30, 45],
  precipitation: [0, 15],
  rain:          [0, 15],
  snow:          [0, 5],
  snowfall:      [0, 5],
  wind:          [0, 35],
  wind_gusts:    [0, 50],
  clouds:        [0, 100],
  pressure:      [970, 1040],
  humidity:      [0, 100],
  visibility:    [0, 30000],
  uv_index:      [0, 12],
  cape:          [0, 4000],
  dew_point:     [-20, 30],
};

/* Open-Meteo "current" field name for each layer */
export function toApiField(layer: WeatherLayer): string {
  switch (layer) {
    case 'temperature':   return 'temperature_2m';
    case 'wind':          return 'wind_speed_10m';
    case 'wind_gusts':    return 'wind_gusts_10m';
    case 'clouds':        return 'cloud_cover';
    case 'pressure':      return 'pressure_msl';
    case 'humidity':      return 'relative_humidity_2m';
    case 'visibility':    return 'visibility';
    case 'uv_index':      return 'uv_index';
    case 'cape':          return 'cape';
    case 'dew_point':     return 'dew_point_2m';
    case 'precipitation': return 'precipitation';
    case 'rain':          return 'rain';
    case 'snow':          return 'snowfall';
    case 'snowfall':      return 'snowfall';
    default:              return '';
  }
}

/* Layers handled by RainViewer raster radar.
 * NOTE: RainViewer returns a placeholder PNG with the text "Zoom Level Not Supported"
 * for tiles outside its radar coverage area (inland Spain, much of Africa, etc.).
 * That gave a visually broken map, so we route all precipitation-family layers through
 * Open-Meteo's grid-sample instead, which gives consistent worldwide coverage. */
export const RAINVIEWER_LAYERS: ReadonlyArray<WeatherLayer> = [];

/* Build a MapLibre 'interpolate' color expression from a [0..1] value to LAYER_COLORS ramp */
export function buildColorExpression(layer: WeatherLayer): unknown {
  const colors = LAYER_COLORS[layer];
  const expr: unknown[] = ['interpolate', ['linear'], ['get', 'value']];
  colors.forEach((c, i) => {
    expr.push(i / (colors.length - 1), c);
  });
  return expr;
}

/* Adaptive grid sampler over a bbox.
 * Returns (cells+1)*(cells+1) lon/lat pairs, denser at higher zooms. */
export function sampleGrid(
  bbox: [number, number, number, number],
  zoom: number,
): [number, number][] {
  const [w, s, e, n] = bbox;
  const cells = zoom < 3 ? 6 : zoom < 5 ? 8 : zoom < 7 ? 10 : zoom < 9 ? 12 : 14;
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

export function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}
