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
  // ---- España (capitales de provincia + grandes ciudades) ----
  { slug: 'madrid', name: 'Madrid', country: 'España', latitude: 40.4168, longitude: -3.7038, timezone: 'Europe/Madrid', population: 3300000 },
  { slug: 'barcelona', name: 'Barcelona', country: 'España', latitude: 41.3851, longitude: 2.1734, timezone: 'Europe/Madrid', population: 1620000 },
  { slug: 'valencia', name: 'Valencia', country: 'España', latitude: 39.4699, longitude: -0.3763, timezone: 'Europe/Madrid', population: 800000 },
  { slug: 'sevilla', name: 'Sevilla', country: 'España', latitude: 37.3891, longitude: -5.9845, timezone: 'Europe/Madrid', population: 690000 },
  { slug: 'zaragoza', name: 'Zaragoza', country: 'España', latitude: 41.6488, longitude: -0.8891, timezone: 'Europe/Madrid', population: 670000 },
  { slug: 'malaga', name: 'Málaga', country: 'España', latitude: 36.7213, longitude: -4.4214, timezone: 'Europe/Madrid', population: 580000 },
  { slug: 'murcia', name: 'Murcia', country: 'España', latitude: 37.9922, longitude: -1.1307, timezone: 'Europe/Madrid', population: 460000 },
  { slug: 'palma-de-mallorca', name: 'Palma de Mallorca', country: 'España', latitude: 39.5696, longitude: 2.6502, timezone: 'Europe/Madrid', population: 420000 },
  { slug: 'las-palmas', name: 'Las Palmas de Gran Canaria', country: 'España', latitude: 28.1235, longitude: -15.4366, timezone: 'Atlantic/Canary', population: 380000 },
  { slug: 'bilbao', name: 'Bilbao', country: 'España', latitude: 43.2630, longitude: -2.9350, timezone: 'Europe/Madrid', population: 350000 },
  { slug: 'alicante', name: 'Alicante', country: 'España', latitude: 38.3452, longitude: -0.4810, timezone: 'Europe/Madrid', population: 340000 },
  { slug: 'cordoba', name: 'Córdoba', country: 'España', latitude: 37.8882, longitude: -4.7794, timezone: 'Europe/Madrid', population: 320000 },
  { slug: 'valladolid', name: 'Valladolid', country: 'España', latitude: 41.6523, longitude: -4.7245, timezone: 'Europe/Madrid', population: 300000 },
  { slug: 'vigo', name: 'Vigo', country: 'España', latitude: 42.2406, longitude: -8.7207, timezone: 'Europe/Madrid', population: 295000 },
  { slug: 'gijon', name: 'Gijón', country: 'España', latitude: 43.5453, longitude: -5.6619, timezone: 'Europe/Madrid', population: 270000 },
  { slug: 'la-coruna', name: 'A Coruña', country: 'España', latitude: 43.3623, longitude: -8.4115, timezone: 'Europe/Madrid', population: 245000 },
  { slug: 'granada', name: 'Granada', country: 'España', latitude: 37.1773, longitude: -3.5986, timezone: 'Europe/Madrid', population: 230000 },
  { slug: 'vitoria', name: 'Vitoria-Gasteiz', country: 'España', latitude: 42.8467, longitude: -2.6716, timezone: 'Europe/Madrid', population: 250000 },
  { slug: 'oviedo', name: 'Oviedo', country: 'España', latitude: 43.3603, longitude: -5.8448, timezone: 'Europe/Madrid', population: 220000 },
  { slug: 'pamplona', name: 'Pamplona', country: 'España', latitude: 42.8125, longitude: -1.6458, timezone: 'Europe/Madrid', population: 200000 },
  { slug: 'santa-cruz-de-tenerife', name: 'Santa Cruz de Tenerife', country: 'España', latitude: 28.4636, longitude: -16.2518, timezone: 'Atlantic/Canary', population: 210000 },
  { slug: 'santander', name: 'Santander', country: 'España', latitude: 43.4623, longitude: -3.8099, timezone: 'Europe/Madrid', population: 170000 },
  { slug: 'almeria', name: 'Almería', country: 'España', latitude: 36.8340, longitude: -2.4637, timezone: 'Europe/Madrid', population: 200000 },
  { slug: 'castellon', name: 'Castellón de la Plana', country: 'España', latitude: 39.9864, longitude: -0.0513, timezone: 'Europe/Madrid', population: 170000 },
  { slug: 'burgos', name: 'Burgos', country: 'España', latitude: 42.3408, longitude: -3.6997, timezone: 'Europe/Madrid', population: 175000 },
  { slug: 'salamanca', name: 'Salamanca', country: 'España', latitude: 40.9701, longitude: -5.6635, timezone: 'Europe/Madrid', population: 145000 },
  { slug: 'logrono', name: 'Logroño', country: 'España', latitude: 42.4627, longitude: -2.4449, timezone: 'Europe/Madrid', population: 150000 },
  { slug: 'badajoz', name: 'Badajoz', country: 'España', latitude: 38.8794, longitude: -6.9707, timezone: 'Europe/Madrid', population: 150000 },
  { slug: 'huelva', name: 'Huelva', country: 'España', latitude: 37.2614, longitude: -6.9447, timezone: 'Europe/Madrid', population: 144000 },
  { slug: 'tarragona', name: 'Tarragona', country: 'España', latitude: 41.1189, longitude: 1.2445, timezone: 'Europe/Madrid', population: 135000 },
  { slug: 'lleida', name: 'Lleida', country: 'España', latitude: 41.6177, longitude: 0.6200, timezone: 'Europe/Madrid', population: 140000 },
  { slug: 'leon', name: 'León', country: 'España', latitude: 42.5987, longitude: -5.5671, timezone: 'Europe/Madrid', population: 125000 },
  { slug: 'cadiz', name: 'Cádiz', country: 'España', latitude: 36.5298, longitude: -6.2924, timezone: 'Europe/Madrid', population: 116000 },
  { slug: 'jaen', name: 'Jaén', country: 'España', latitude: 37.7796, longitude: -3.7849, timezone: 'Europe/Madrid', population: 113000 },
  { slug: 'ourense', name: 'Ourense', country: 'España', latitude: 42.3358, longitude: -7.8639, timezone: 'Europe/Madrid', population: 105000 },
  { slug: 'lugo', name: 'Lugo', country: 'España', latitude: 43.0125, longitude: -7.5559, timezone: 'Europe/Madrid', population: 98000 },
  { slug: 'caceres', name: 'Cáceres', country: 'España', latitude: 39.4753, longitude: -6.3724, timezone: 'Europe/Madrid', population: 96000 },
  { slug: 'girona', name: 'Girona', country: 'España', latitude: 41.9794, longitude: 2.8214, timezone: 'Europe/Madrid', population: 103000 },
  { slug: 'toledo', name: 'Toledo', country: 'España', latitude: 39.8628, longitude: -4.0273, timezone: 'Europe/Madrid', population: 85000 },
  { slug: 'huesca', name: 'Huesca', country: 'España', latitude: 42.1401, longitude: -0.4089, timezone: 'Europe/Madrid', population: 53000 },
  { slug: 'teruel', name: 'Teruel', country: 'España', latitude: 40.3456, longitude: -1.1065, timezone: 'Europe/Madrid', population: 36000 },
  { slug: 'soria', name: 'Soria', country: 'España', latitude: 41.7665, longitude: -2.4791, timezone: 'Europe/Madrid', population: 39000 },
  { slug: 'segovia', name: 'Segovia', country: 'España', latitude: 40.9429, longitude: -4.1088, timezone: 'Europe/Madrid', population: 51000 },
  { slug: 'avila', name: 'Ávila', country: 'España', latitude: 40.6566, longitude: -4.6818, timezone: 'Europe/Madrid', population: 57000 },
  { slug: 'zamora', name: 'Zamora', country: 'España', latitude: 41.5036, longitude: -5.7448, timezone: 'Europe/Madrid', population: 60000 },
  { slug: 'palencia', name: 'Palencia', country: 'España', latitude: 42.0095, longitude: -4.5288, timezone: 'Europe/Madrid', population: 78000 },
  { slug: 'cuenca', name: 'Cuenca', country: 'España', latitude: 40.0704, longitude: -2.1374, timezone: 'Europe/Madrid', population: 53000 },
  { slug: 'ciudad-real', name: 'Ciudad Real', country: 'España', latitude: 38.9848, longitude: -3.9274, timezone: 'Europe/Madrid', population: 75000 },
  { slug: 'guadalajara', name: 'Guadalajara', country: 'España', latitude: 40.6293, longitude: -3.1672, timezone: 'Europe/Madrid', population: 87000 },
  { slug: 'albacete', name: 'Albacete', country: 'España', latitude: 38.9943, longitude: -1.8585, timezone: 'Europe/Madrid', population: 174000 },
  { slug: 'merida', name: 'Mérida', country: 'España', latitude: 38.9165, longitude: -6.3424, timezone: 'Europe/Madrid', population: 60000 },
  { slug: 'ibiza', name: 'Ibiza', country: 'España', latitude: 38.9067, longitude: 1.4206, timezone: 'Europe/Madrid', population: 50000 },
  { slug: 'mahon', name: 'Mahón', country: 'España', latitude: 39.8885, longitude: 4.2658, timezone: 'Europe/Madrid', population: 30000 },
  { slug: 'arrecife', name: 'Arrecife', country: 'España', latitude: 28.9637, longitude: -13.5478, timezone: 'Atlantic/Canary', population: 65000 },
  { slug: 'puerto-del-rosario', name: 'Puerto del Rosario', country: 'España', latitude: 28.4969, longitude: -13.8631, timezone: 'Atlantic/Canary', population: 41000 },
  { slug: 'ceuta', name: 'Ceuta', country: 'España', latitude: 35.8894, longitude: -5.3213, timezone: 'Africa/Ceuta', population: 84000 },
  { slug: 'melilla', name: 'Melilla', country: 'España', latitude: 35.2923, longitude: -2.9381, timezone: 'Africa/Ceuta', population: 86000 },
  { slug: 'marbella', name: 'Marbella', country: 'España', latitude: 36.5099, longitude: -4.8861, timezone: 'Europe/Madrid', population: 145000 },
  { slug: 'benidorm', name: 'Benidorm', country: 'España', latitude: 38.5378, longitude: -0.1310, timezone: 'Europe/Madrid', population: 70000 },
  { slug: 'jerez', name: 'Jerez de la Frontera', country: 'España', latitude: 36.6850, longitude: -6.1261, timezone: 'Europe/Madrid', population: 213000 },
  { slug: 'mostoles', name: 'Móstoles', country: 'España', latitude: 40.3225, longitude: -3.8654, timezone: 'Europe/Madrid', population: 207000 },
  { slug: 'alcala-de-henares', name: 'Alcalá de Henares', country: 'España', latitude: 40.4818, longitude: -3.3643, timezone: 'Europe/Madrid', population: 196000 },
  { slug: 'san-sebastian', name: 'San Sebastián', country: 'España', latitude: 43.3183, longitude: -1.9812, timezone: 'Europe/Madrid', population: 188000 },
  { slug: 'sabadell', name: 'Sabadell', country: 'España', latitude: 41.5483, longitude: 2.1075, timezone: 'Europe/Madrid', population: 215000 },
  { slug: 'cartagena', name: 'Cartagena', country: 'España', latitude: 37.6257, longitude: -0.9966, timezone: 'Europe/Madrid', population: 215000 },
  { slug: 'elche', name: 'Elche', country: 'España', latitude: 38.2655, longitude: -0.6983, timezone: 'Europe/Madrid', population: 235000 },

  // ---- México ----
  { slug: 'ciudad-de-mexico', name: 'Ciudad de México', country: 'México', latitude: 19.4326, longitude: -99.1332, timezone: 'America/Mexico_City', population: 9200000 },
  { slug: 'guadalajara-mx', name: 'Guadalajara', country: 'México', latitude: 20.6597, longitude: -103.3496, timezone: 'America/Mexico_City', population: 1500000 },
  { slug: 'monterrey', name: 'Monterrey', country: 'México', latitude: 25.6866, longitude: -100.3161, timezone: 'America/Monterrey', population: 1135000 },
  { slug: 'puebla', name: 'Puebla', country: 'México', latitude: 19.0413, longitude: -98.2062, timezone: 'America/Mexico_City', population: 1690000 },
  { slug: 'tijuana', name: 'Tijuana', country: 'México', latitude: 32.5149, longitude: -117.0382, timezone: 'America/Tijuana', population: 1810000 },
  { slug: 'cancun', name: 'Cancún', country: 'México', latitude: 21.1619, longitude: -86.8515, timezone: 'America/Cancun', population: 750000 },
  { slug: 'merida-mx', name: 'Mérida', country: 'México', latitude: 20.9674, longitude: -89.5926, timezone: 'America/Merida', population: 920000 },
  { slug: 'oaxaca', name: 'Oaxaca de Juárez', country: 'México', latitude: 17.0732, longitude: -96.7266, timezone: 'America/Mexico_City', population: 270000 },
  { slug: 'leon-mx', name: 'León', country: 'México', latitude: 21.1250, longitude: -101.6860, timezone: 'America/Mexico_City', population: 1580000 },

  // ---- Argentina ----
  { slug: 'buenos-aires', name: 'Buenos Aires', country: 'Argentina', latitude: -34.6037, longitude: -58.3816, timezone: 'America/Argentina/Buenos_Aires', population: 3100000 },
  { slug: 'cordoba-ar', name: 'Córdoba', country: 'Argentina', latitude: -31.4201, longitude: -64.1888, timezone: 'America/Argentina/Cordoba', population: 1430000 },
  { slug: 'rosario', name: 'Rosario', country: 'Argentina', latitude: -32.9442, longitude: -60.6505, timezone: 'America/Argentina/Cordoba', population: 1280000 },
  { slug: 'mendoza', name: 'Mendoza', country: 'Argentina', latitude: -32.8895, longitude: -68.8458, timezone: 'America/Argentina/Mendoza', population: 115000 },
  { slug: 'la-plata', name: 'La Plata', country: 'Argentina', latitude: -34.9214, longitude: -57.9544, timezone: 'America/Argentina/Buenos_Aires', population: 770000 },
  { slug: 'mar-del-plata', name: 'Mar del Plata', country: 'Argentina', latitude: -38.0055, longitude: -57.5426, timezone: 'America/Argentina/Buenos_Aires', population: 620000 },
  { slug: 'bariloche', name: 'San Carlos de Bariloche', country: 'Argentina', latitude: -41.1335, longitude: -71.3103, timezone: 'America/Argentina/Salta', population: 110000 },

  // ---- Colombia ----
  { slug: 'bogota', name: 'Bogotá', country: 'Colombia', latitude: 4.7110, longitude: -74.0721, timezone: 'America/Bogota', population: 7400000 },
  { slug: 'medellin', name: 'Medellín', country: 'Colombia', latitude: 6.2476, longitude: -75.5658, timezone: 'America/Bogota', population: 2530000 },
  { slug: 'cali', name: 'Cali', country: 'Colombia', latitude: 3.4516, longitude: -76.5320, timezone: 'America/Bogota', population: 2230000 },
  { slug: 'barranquilla', name: 'Barranquilla', country: 'Colombia', latitude: 10.9685, longitude: -74.7813, timezone: 'America/Bogota', population: 1230000 },
  { slug: 'cartagena-co', name: 'Cartagena de Indias', country: 'Colombia', latitude: 10.3910, longitude: -75.4794, timezone: 'America/Bogota', population: 980000 },

  // ---- Perú ----
  { slug: 'lima', name: 'Lima', country: 'Perú', latitude: -12.0464, longitude: -77.0428, timezone: 'America/Lima', population: 9700000 },
  { slug: 'cusco', name: 'Cusco', country: 'Perú', latitude: -13.5320, longitude: -71.9675, timezone: 'America/Lima', population: 430000 },
  { slug: 'arequipa', name: 'Arequipa', country: 'Perú', latitude: -16.4090, longitude: -71.5375, timezone: 'America/Lima', population: 1080000 },

  // ---- Chile ----
  { slug: 'santiago-de-chile', name: 'Santiago de Chile', country: 'Chile', latitude: -33.4489, longitude: -70.6693, timezone: 'America/Santiago', population: 6700000 },
  { slug: 'valparaiso', name: 'Valparaíso', country: 'Chile', latitude: -33.0472, longitude: -71.6127, timezone: 'America/Santiago', population: 296000 },
  { slug: 'concepcion', name: 'Concepción', country: 'Chile', latitude: -36.8201, longitude: -73.0444, timezone: 'America/Santiago', population: 230000 },

  // ---- Resto LATAM ----
  { slug: 'caracas', name: 'Caracas', country: 'Venezuela', latitude: 10.4806, longitude: -66.9036, timezone: 'America/Caracas', population: 2940000 },
  { slug: 'quito', name: 'Quito', country: 'Ecuador', latitude: -0.1807, longitude: -78.4678, timezone: 'America/Guayaquil', population: 2010000 },
  { slug: 'guayaquil', name: 'Guayaquil', country: 'Ecuador', latitude: -2.1709, longitude: -79.9224, timezone: 'America/Guayaquil', population: 2700000 },
  { slug: 'la-paz', name: 'La Paz', country: 'Bolivia', latitude: -16.4897, longitude: -68.1193, timezone: 'America/La_Paz', population: 815000 },
  { slug: 'asuncion', name: 'Asunción', country: 'Paraguay', latitude: -25.2637, longitude: -57.5759, timezone: 'America/Asuncion', population: 525000 },
  { slug: 'montevideo', name: 'Montevideo', country: 'Uruguay', latitude: -34.9011, longitude: -56.1645, timezone: 'America/Montevideo', population: 1380000 },
  { slug: 'san-jose-cr', name: 'San José', country: 'Costa Rica', latitude: 9.9281, longitude: -84.0907, timezone: 'America/Costa_Rica', population: 340000 },
  { slug: 'panama', name: 'Ciudad de Panamá', country: 'Panamá', latitude: 8.9824, longitude: -79.5199, timezone: 'America/Panama', population: 880000 },
  { slug: 'la-habana', name: 'La Habana', country: 'Cuba', latitude: 23.1136, longitude: -82.3666, timezone: 'America/Havana', population: 2130000 },
  { slug: 'santo-domingo', name: 'Santo Domingo', country: 'Rep. Dominicana', latitude: 18.4861, longitude: -69.9312, timezone: 'America/Santo_Domingo', population: 965000 },
  { slug: 'san-juan-pr', name: 'San Juan', country: 'Puerto Rico', latitude: 18.4655, longitude: -66.1057, timezone: 'America/Puerto_Rico', population: 320000 },

  // ---- Europa ----
  { slug: 'london', name: 'Londres', country: 'Reino Unido', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', population: 9000000 },
  { slug: 'paris', name: 'París', country: 'Francia', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris', population: 2150000 },
  { slug: 'berlin', name: 'Berlín', country: 'Alemania', latitude: 52.5200, longitude: 13.4050, timezone: 'Europe/Berlin', population: 3760000 },
  { slug: 'roma', name: 'Roma', country: 'Italia', latitude: 41.9028, longitude: 12.4964, timezone: 'Europe/Rome', population: 2870000 },
  { slug: 'milan', name: 'Milán', country: 'Italia', latitude: 45.4642, longitude: 9.1900, timezone: 'Europe/Rome', population: 1390000 },
  { slug: 'amsterdam', name: 'Ámsterdam', country: 'Países Bajos', latitude: 52.3676, longitude: 4.9041, timezone: 'Europe/Amsterdam', population: 905000 },
  { slug: 'lisboa', name: 'Lisboa', country: 'Portugal', latitude: 38.7223, longitude: -9.1393, timezone: 'Europe/Lisbon', population: 545000 },
  { slug: 'porto', name: 'Oporto', country: 'Portugal', latitude: 41.1579, longitude: -8.6291, timezone: 'Europe/Lisbon', population: 215000 },
  { slug: 'bruselas', name: 'Bruselas', country: 'Bélgica', latitude: 50.8503, longitude: 4.3517, timezone: 'Europe/Brussels', population: 1210000 },
  { slug: 'viena', name: 'Viena', country: 'Austria', latitude: 48.2082, longitude: 16.3738, timezone: 'Europe/Vienna', population: 1900000 },
  { slug: 'zurich', name: 'Zúrich', country: 'Suiza', latitude: 47.3769, longitude: 8.5417, timezone: 'Europe/Zurich', population: 415000 },
  { slug: 'munich', name: 'Múnich', country: 'Alemania', latitude: 48.1351, longitude: 11.5820, timezone: 'Europe/Berlin', population: 1470000 },
  { slug: 'frankfurt', name: 'Fráncfort', country: 'Alemania', latitude: 50.1109, longitude: 8.6821, timezone: 'Europe/Berlin', population: 750000 },
  { slug: 'dublin', name: 'Dublín', country: 'Irlanda', latitude: 53.3498, longitude: -6.2603, timezone: 'Europe/Dublin', population: 590000 },
  { slug: 'estocolmo', name: 'Estocolmo', country: 'Suecia', latitude: 59.3293, longitude: 18.0686, timezone: 'Europe/Stockholm', population: 975000 },
  { slug: 'oslo', name: 'Oslo', country: 'Noruega', latitude: 59.9139, longitude: 10.7522, timezone: 'Europe/Oslo', population: 700000 },
  { slug: 'copenhague', name: 'Copenhague', country: 'Dinamarca', latitude: 55.6761, longitude: 12.5683, timezone: 'Europe/Copenhagen', population: 660000 },
  { slug: 'helsinki', name: 'Helsinki', country: 'Finlandia', latitude: 60.1699, longitude: 24.9384, timezone: 'Europe/Helsinki', population: 660000 },
  { slug: 'reikiavik', name: 'Reikiavik', country: 'Islandia', latitude: 64.1466, longitude: -21.9426, timezone: 'Atlantic/Reykjavik', population: 135000 },
  { slug: 'praga', name: 'Praga', country: 'Chequia', latitude: 50.0755, longitude: 14.4378, timezone: 'Europe/Prague', population: 1320000 },
  { slug: 'varsovia', name: 'Varsovia', country: 'Polonia', latitude: 52.2297, longitude: 21.0122, timezone: 'Europe/Warsaw', population: 1790000 },
  { slug: 'budapest', name: 'Budapest', country: 'Hungría', latitude: 47.4979, longitude: 19.0402, timezone: 'Europe/Budapest', population: 1750000 },
  { slug: 'atenas', name: 'Atenas', country: 'Grecia', latitude: 37.9838, longitude: 23.7275, timezone: 'Europe/Athens', population: 660000 },
  { slug: 'estambul', name: 'Estambul', country: 'Turquía', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul', population: 15500000 },
  { slug: 'moscu', name: 'Moscú', country: 'Rusia', latitude: 55.7558, longitude: 37.6173, timezone: 'Europe/Moscow', population: 12600000 },

  // ---- América del Norte ----
  { slug: 'new-york', name: 'Nueva York', country: 'EE. UU.', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', population: 8400000 },
  { slug: 'los-angeles', name: 'Los Ángeles', country: 'EE. UU.', latitude: 34.0522, longitude: -118.2437, timezone: 'America/Los_Angeles', population: 3970000 },
  { slug: 'chicago', name: 'Chicago', country: 'EE. UU.', latitude: 41.8781, longitude: -87.6298, timezone: 'America/Chicago', population: 2700000 },
  { slug: 'miami', name: 'Miami', country: 'EE. UU.', latitude: 25.7617, longitude: -80.1918, timezone: 'America/New_York', population: 470000 },
  { slug: 'houston', name: 'Houston', country: 'EE. UU.', latitude: 29.7604, longitude: -95.3698, timezone: 'America/Chicago', population: 2320000 },
  { slug: 'san-francisco', name: 'San Francisco', country: 'EE. UU.', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles', population: 880000 },
  { slug: 'washington', name: 'Washington D. C.', country: 'EE. UU.', latitude: 38.9072, longitude: -77.0369, timezone: 'America/New_York', population: 705000 },
  { slug: 'boston', name: 'Boston', country: 'EE. UU.', latitude: 42.3601, longitude: -71.0589, timezone: 'America/New_York', population: 695000 },
  { slug: 'toronto', name: 'Toronto', country: 'Canadá', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto', population: 2930000 },
  { slug: 'montreal', name: 'Montreal', country: 'Canadá', latitude: 45.5017, longitude: -73.5673, timezone: 'America/Montreal', population: 1780000 },
  { slug: 'vancouver', name: 'Vancouver', country: 'Canadá', latitude: 49.2827, longitude: -123.1207, timezone: 'America/Vancouver', population: 675000 },

  // ---- Asia ----
  { slug: 'tokyo', name: 'Tokio', country: 'Japón', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', population: 13900000 },
  { slug: 'osaka', name: 'Osaka', country: 'Japón', latitude: 34.6937, longitude: 135.5023, timezone: 'Asia/Tokyo', population: 2700000 },
  { slug: 'pekin', name: 'Pekín', country: 'China', latitude: 39.9042, longitude: 116.4074, timezone: 'Asia/Shanghai', population: 21500000 },
  { slug: 'shanghai', name: 'Shanghái', country: 'China', latitude: 31.2304, longitude: 121.4737, timezone: 'Asia/Shanghai', population: 24900000 },
  { slug: 'hong-kong', name: 'Hong Kong', country: 'China', latitude: 22.3193, longitude: 114.1694, timezone: 'Asia/Hong_Kong', population: 7400000 },
  { slug: 'singapur', name: 'Singapur', country: 'Singapur', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore', population: 5700000 },
  { slug: 'bangkok', name: 'Bangkok', country: 'Tailandia', latitude: 13.7563, longitude: 100.5018, timezone: 'Asia/Bangkok', population: 10500000 },
  { slug: 'seul', name: 'Seúl', country: 'Corea del Sur', latitude: 37.5665, longitude: 126.9780, timezone: 'Asia/Seoul', population: 9700000 },
  { slug: 'dubai', name: 'Dubái', country: 'Emiratos Árabes Unidos', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai', population: 3500000 },
  { slug: 'mumbai', name: 'Bombay', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', population: 20400000 },
  { slug: 'nueva-delhi', name: 'Nueva Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata', population: 32900000 },
  { slug: 'tel-aviv', name: 'Tel Aviv', country: 'Israel', latitude: 32.0853, longitude: 34.7818, timezone: 'Asia/Jerusalem', population: 460000 },

  // ---- África ----
  { slug: 'el-cairo', name: 'El Cairo', country: 'Egipto', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo', population: 9540000 },
  { slug: 'casablanca', name: 'Casablanca', country: 'Marruecos', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca', population: 3360000 },
  { slug: 'marrakech', name: 'Marrakech', country: 'Marruecos', latitude: 31.6295, longitude: -7.9811, timezone: 'Africa/Casablanca', population: 928000 },
  { slug: 'ciudad-del-cabo', name: 'Ciudad del Cabo', country: 'Sudáfrica', latitude: -33.9249, longitude: 18.4241, timezone: 'Africa/Johannesburg', population: 4620000 },
  { slug: 'lagos', name: 'Lagos', country: 'Nigeria', latitude: 6.5244, longitude: 3.3792, timezone: 'Africa/Lagos', population: 14860000 },

  // ---- Oceanía ----
  { slug: 'sydney', name: 'Sídney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney', population: 5300000 },
  { slug: 'melbourne', name: 'Melbourne', country: 'Australia', latitude: -37.8136, longitude: 144.9631, timezone: 'Australia/Melbourne', population: 5080000 },
  { slug: 'auckland', name: 'Auckland', country: 'Nueva Zelanda', latitude: -36.8485, longitude: 174.7633, timezone: 'Pacific/Auckland', population: 1660000 },
];

// Useful aggregations
export const CITIES_BY_COUNTRY = MAJOR_CITIES.reduce<Record<string, MajorCity[]>>((acc, c) => {
  (acc[c.country] ??= []).push(c);
  return acc;
}, {});

export const CITY_COUNTRIES = Object.keys(CITIES_BY_COUNTRY).sort((a, b) => {
  // Pin España first, then alphabetical
  if (a === 'España') return -1;
  if (b === 'España') return 1;
  return a.localeCompare(b, 'es');
});
