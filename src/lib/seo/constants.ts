export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tiempo-meteorologia.pages.dev';

export const SITE_NAME = 'AetherCast';
export const SITE_TAGLINE = 'El tiempo más preciso del planeta';
export const SITE_DESCRIPTION =
  'AetherCast — La plataforma meteorológica más avanzada del mundo. Pronóstico hiperlocal multi-modelo (ECMWF, ICON, GFS, HRRR), mapa interactivo con +80 capas, IA explicativa, alertas en tiempo real y radar global. Sin anuncios.';

export const SITE_KEYWORDS = [
  'tiempo', 'meteorología', 'pronóstico', 'el tiempo', 'clima',
  'mapa del tiempo', 'radar meteorológico', 'previsión',
  'tiempo hoy', 'tiempo mañana', 'lluvia', 'temperatura',
  'viento', 'huracán', 'tormenta', 'nieve',
  'AetherCast', 'pronóstico ECMWF', 'modelo GFS', 'ICON',
  'meteorología profesional', 'tiempo España', 'el tiempo en mi ciudad',
];

export const SOCIAL = {
  twitter: '@aethercast',
  github: 'softwareengdev/tiempo_meteorologia',
};

export const ORGANIZATION = {
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  email: 'hola@aethercast.app',
  sameAs: [
    `https://github.com/${SOCIAL.github}`,
    `https://twitter.com/${SOCIAL.twitter.replace('@', '')}`,
  ],
};

export interface MajorCity {
  slug: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
}

export const MAJOR_CITIES: MajorCity[] = [
  { slug: 'madrid', name: 'Madrid', country: 'España', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid', population: 3300000 },
  { slug: 'barcelona', name: 'Barcelona', country: 'España', latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid', population: 1620000 },
  { slug: 'valencia', name: 'Valencia', country: 'España', latitude: 39.4699, longitude: -0.3763, timezone: 'Europe/Madrid', population: 800000 },
  { slug: 'sevilla', name: 'Sevilla', country: 'España', latitude: 37.3891, longitude: -5.9845, timezone: 'Europe/Madrid', population: 690000 },
  { slug: 'bilbao', name: 'Bilbao', country: 'España', latitude: 43.2630, longitude: -2.9350, timezone: 'Europe/Madrid', population: 350000 },
  { slug: 'malaga', name: 'Málaga', country: 'España', latitude: 36.7213, longitude: -4.4214, timezone: 'Europe/Madrid', population: 580000 },
  { slug: 'zaragoza', name: 'Zaragoza', country: 'España', latitude: 41.6488, longitude: -0.8891, timezone: 'Europe/Madrid', population: 670000 },
  { slug: 'palma-de-mallorca', name: 'Palma de Mallorca', country: 'España', latitude: 39.5696, longitude: 2.6502, timezone: 'Europe/Madrid', population: 420000 },
  { slug: 'las-palmas', name: 'Las Palmas de Gran Canaria', country: 'España', latitude: 28.1235, longitude: -15.4366, timezone: 'Atlantic/Canary', population: 380000 },
  { slug: 'tenerife', name: 'Santa Cruz de Tenerife', country: 'España', latitude: 28.4636, longitude: -16.2518, timezone: 'Atlantic/Canary', population: 210000 },
  { slug: 'mexico-df', name: 'Ciudad de México', country: 'México', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City', population: 9200000 },
  { slug: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires', population: 3100000 },
  { slug: 'bogota', name: 'Bogotá', country: 'Colombia', latitude: 4.7110, longitude: -74.0721, timezone: 'America/Bogota', population: 7400000 },
  { slug: 'lima', name: 'Lima', country: 'Perú', latitude: -12.0464, longitude: -77.0428, timezone: 'America/Lima', population: 9700000 },
  { slug: 'santiago-de-chile', name: 'Santiago de Chile', country: 'Chile', latitude: -33.4489, longitude: -70.6693, timezone: 'America/Santiago', population: 6700000 },
  { slug: 'london', name: 'Londres', country: 'Reino Unido', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', population: 9000000 },
  { slug: 'paris', name: 'París', country: 'Francia', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', population: 2150000 },
  { slug: 'new-york', name: 'Nueva York', country: 'EE. UU.', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', population: 8400000 },
  { slug: 'tokyo', name: 'Tokio', country: 'Japón', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', population: 13900000 },
  { slug: 'sydney', name: 'Sídney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', population: 5300000 },
];
