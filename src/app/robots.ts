import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/constants';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/static/chunks/', '/icons/', '/sw.js'],
      },
      // Search engines — explicit allow
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Googlebot-Image', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'Slurp', allow: '/' }, // Yahoo
      { userAgent: 'DuckDuckBot', allow: '/' },
      { userAgent: 'YandexBot', allow: '/' },
      { userAgent: 'Baiduspider', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      // AI crawlers — allow indexing for visibility in AI answers
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      // Block aggressive scrapers
      { userAgent: 'AhrefsBot', disallow: '/' },
      { userAgent: 'SemrushBot', disallow: '/' },
      { userAgent: 'MJ12bot', disallow: '/' },
      { userAgent: 'DotBot', disallow: '/' },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap/pages.xml`,
      `${SITE_URL}/sitemap/cities.xml`,
    ],
    host: SITE_URL,
  };
}
