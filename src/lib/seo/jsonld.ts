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
