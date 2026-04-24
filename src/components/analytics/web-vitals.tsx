'use client';

import { useReportWebVitals } from 'next/web-vitals';

/**
 * Logs Core Web Vitals (LCP, INP, CLS, FCP, TTFB) to console in dev,
 * and optionally beacons them to NEXT_PUBLIC_VITALS_ENDPOINT in production
 * (set this env var to a Cloudflare Worker / Plausible / Umami endpoint).
 *
 * No server route is required when the endpoint is unset (works with static export).
 */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const payload = {
      name: metric.name,
      value: Math.round(metric.value * 100) / 100,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
      url: typeof location !== 'undefined' ? location.pathname : undefined,
      ts: Date.now(),
    };

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[web-vitals] ${metric.name}=${payload.value} (${metric.rating})`);
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_VITALS_ENDPOINT;
    if (!endpoint) return;

    try {
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
      } else {
        fetch(endpoint, {
          body,
          method: 'POST',
          keepalive: true,
          headers: { 'content-type': 'application/json' },
        });
      }
    } catch {
      // ignore
    }
  });

  return null;
}
