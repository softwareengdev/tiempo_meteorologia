import Script from 'next/script';

/**
 * Cloudflare Web Analytics — privacy-first, cookieless, no PII.
 * Set NEXT_PUBLIC_CF_ANALYTICS_TOKEN in env to activate.
 *
 * Token is obtained from Cloudflare Dashboard → Analytics → Web Analytics → Site
 * Free tier, no impact on Core Web Vitals (script loaded with strategy="afterInteractive").
 */
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;

  return (
    <Script
      strategy="afterInteractive"
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
