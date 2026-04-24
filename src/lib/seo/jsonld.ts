import { ORGANIZATION, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './constants';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORGANIZATION.name,
  url: ORGANIZATION.url,
  logo: ORGANIZATION.logo,
  email: ORGANIZATION.email,
  sameAs: ORGANIZATION.sameAs,
};

export const webApplicationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'WeatherApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript and modern browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '1287',
  },
  featureList: [
    'Pronóstico hiperlocal multi-modelo',
    'Mapa interactivo +80 capas',
    'IA explicativa del tiempo',
    'Alertas meteorológicas',
    'Radar y satélite global',
    'Modo Pro avanzado',
    'PWA offline',
  ],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function placeWeatherJsonLd(opts: {
  name: string;
  latitude: number;
  longitude: number;
  url: string;
  temperature?: number;
  description?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: opts.name,
    url: opts.url,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: opts.latitude,
      longitude: opts.longitude,
    },
    ...(opts.temperature !== undefined && {
      additionalProperty: {
        '@type': 'PropertyValue',
        name: 'currentTemperature',
        value: opts.temperature,
        unitCode: 'CEL',
      },
    }),
    ...(opts.description && { description: opts.description }),
  };
}

/**
 * Weather forecast as a Schema.org DataFeed. Each daily prediction is a DataFeedItem
 * containing an Observation with relevant variables (temperature max/min, precipitation, wind).
 * Google parses DataFeed/Observation for rich results in the Search Console "Weather data" category.
 */
export function weatherDataFeedJsonLd(opts: {
  cityName: string;
  url: string;
  latitude: number;
  longitude: number;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
}) {
  const place = {
    '@type': 'Place',
    name: opts.cityName,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: opts.latitude,
      longitude: opts.longitude,
    },
  };
  return {
    '@context': 'https://schema.org',
    '@type': 'DataFeed',
    name: `Pronóstico meteorológico 7 días — ${opts.cityName}`,
    url: opts.url,
    dataFeedElement: opts.daily.time.map((day, i) => ({
      '@type': 'DataFeedItem',
      dateCreated: day,
      item: {
        '@type': 'Observation',
        observationDate: day,
        observedNode: place,
        measuredProperty: 'WeatherForecast',
        marginOfError: { '@type': 'QuantitativeValue', value: 1, unitCode: 'CEL' },
        valueReference: [
          { '@type': 'PropertyValue', name: 'temperatureMax', value: opts.daily.temperature_2m_max[i], unitCode: 'CEL' },
          { '@type': 'PropertyValue', name: 'temperatureMin', value: opts.daily.temperature_2m_min[i], unitCode: 'CEL' },
          { '@type': 'PropertyValue', name: 'precipitationSum', value: opts.daily.precipitation_sum[i], unitCode: 'MMT' },
          { '@type': 'PropertyValue', name: 'windSpeedMax', value: opts.daily.wind_speed_10m_max[i], unitCode: 'KMH' },
        ],
      },
    })),
  };
}

export interface FaqItem { question: string; answer: string }

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.question,
      acceptedAnswer: { '@type': 'Answer', text: it.answer },
    })),
  };
}

export function itemListJsonLd(opts: { name: string; items: { name: string; url: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}
