import type { MetadataRoute } from 'next';
import { SITE_URL, MAJOR_CITIES, CITY_COUNTRIES } from '@/lib/seo/constants';

export const dynamic = 'force-static';

// Up to 50 000 URLs per sitemap (Google limit). We split into pages + cities.
export async function generateSitemaps() {
  return [{ id: 'pages' }, { id: 'cities' }];
}

export default function sitemap({ id }: { id: string }): MetadataRoute.Sitemap {
  const lastModified = new Date();

  if (id === 'cities') {
    return MAJOR_CITIES.map((city) => ({
      url: `${SITE_URL}/location/${city.slug}`,
      lastModified,
      changeFrequency: 'hourly' as const,
      priority: city.population && city.population > 1_000_000 ? 0.85 : 0.75,
    }));
  }

  // Default: static pages + country hubs
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${SITE_URL}/dashboard`, lastModified, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/pro`, lastModified, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/comparador`, lastModified, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/ciudades`, lastModified, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/landing`, lastModified, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/precios`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/sobre`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/legal/privacidad`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/legal/terminos`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const countryHubs: MetadataRoute.Sitemap = CITY_COUNTRIES.map((country) => ({
    url: `${SITE_URL}/ciudades#${slugifyCountry(country)}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...countryHubs];
}

function slugifyCountry(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
