import type { MetadataRoute } from 'next';
import { SITE_URL, MAJOR_CITIES } from '@/lib/seo/constants';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: 'hourly', priority: 1.0 },
    { url: `${SITE_URL}/dashboard`, lastModified, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/pro`, lastModified, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${SITE_URL}/landing`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/precios`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/sobre`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/legal/privacidad`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/legal/terminos`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = MAJOR_CITIES.map((city) => ({
    url: `${SITE_URL}/location/${city.slug}`,
    lastModified,
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...cityRoutes];
}
