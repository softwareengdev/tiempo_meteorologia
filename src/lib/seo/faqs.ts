import type { FaqItem } from './jsonld';

export const HOME_FAQS: FaqItem[] = [
  {
    question: '¿Qué es AetherCast?',
    answer: 'AetherCast es una plataforma meteorológica gratuita y sin anuncios que combina los modelos de pronóstico ECMWF, ICON, GFS y HRRR con un mapa interactivo, IA explicativa y +80 capas en tiempo real para ofrecer la previsión más precisa de cada ciudad.',
  },
  {
    question: '¿De dónde proceden los datos del tiempo?',
    answer: 'Los datos provienen de Open-Meteo (que agrega ECMWF, ICON, GFS, JMA y otros modelos numéricos), del radar global de RainViewer y de servicios oficiales como AEMET (España) cuando están disponibles. Todos son fuentes públicas y profesionales.',
  },
  {
    question: '¿Cada cuánto se actualiza el pronóstico?',
    answer: 'Las observaciones actuales se refrescan cada 5 minutos, el radar cada 10 minutos y los modelos completos se reactualizan cada 1–6 horas según el modelo (HRRR cada hora, ECMWF cada 6 h).',
  },
  {
    question: '¿Funciona AetherCast sin conexión?',
    answer: 'Sí. AetherCast es una PWA instalable: tras la primera visita, el service worker cachea las páginas principales y los últimos pronósticos para que puedas consultarlos offline.',
  },
  {
    question: '¿Es gratis? ¿Tiene anuncios?',
    answer: 'Es 100 % gratis y nunca verás anuncios. Existe un plan Pro opcional con capas profesionales (CAPE, SREH, jet stream) y exportaciones, pero todas las funciones esenciales están disponibles para cualquier visitante.',
  },
  {
    question: '¿Puedo usar AetherCast en el móvil?',
    answer: 'Sí. Está diseñado mobile-first: el mapa, los widgets, el comparador y el modo Caza-tormentas funcionan perfectamente en pantallas de 360 px. Puedes instalarlo como app desde el navegador (Añadir a pantalla de inicio).',
  },
];

export function locationFaqs(cityName: string): FaqItem[] {
  return [
    {
      question: `¿Va a llover hoy en ${cityName}?`,
      answer: `Consulta la sección "Pronóstico 7 días" más arriba: te indicamos la probabilidad de lluvia, los milímetros estimados y las horas con mayor riesgo de precipitación en ${cityName} para hoy y los próximos 6 días.`,
    },
    {
      question: `¿Qué temperatura hace ahora en ${cityName}?`,
      answer: `La temperatura actual en ${cityName} se muestra en la tarjeta principal junto con la sensación térmica, viento, humedad, presión y porcentaje de nubes. Los datos se actualizan cada 5 minutos.`,
    },
    {
      question: `¿Qué modelo meteorológico es más fiable para ${cityName}?`,
      answer: `Para Europa, ECMWF (European Centre for Medium-Range Weather Forecasts) suele ser el más preciso. AetherCast muestra por defecto la combinación "Best match" de Open-Meteo que pondera ECMWF, ICON y GFS según el rendimiento histórico en cada zona.`,
    },
    {
      question: `¿Hay alertas meteorológicas activas en ${cityName}?`,
      answer: `En la sección "Alertas Meteorológicas" verás cualquier aviso oficial activo (viento, lluvias, nevadas, calor extremo). Si no hay ninguno, el panel mostrará "Sin alertas" en verde.`,
    },
  ];
}
