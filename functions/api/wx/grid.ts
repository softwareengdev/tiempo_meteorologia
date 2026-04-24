/**
 * Cloudflare Pages Function — server-side proxy for Open-Meteo grid sampling.
 *
 * Lives outside Next.js (`output: 'export'` would otherwise reject API routes)
 * and is automatically routed by Cloudflare Pages at /api/wx/grid.
 *
 * Why this exists:
 *  - Open-Meteo rate-limits per IP. With direct browser calls every user can
 *    independently hit 429 Too Many Requests.
 *  - This Worker uses a single egress IP (CF), and stores the response in the
 *    edge cache (`caches.default`) for 5 minutes — multiple users viewing the
 *    same bbox/zoom share one upstream call.
 *  - On upstream failure (429 / 5xx) we still respond 200 with `{ error,
 *    current: null }` so the map overlay code can bail gracefully without
 *    flashing red errors.
 */

interface PagesContext {
  request: Request;
}

export const onRequestGet = async (ctx: PagesContext): Promise<Response> => {
  const url = new URL(ctx.request.url);
  const sp = url.searchParams;
  const latitude = sp.get('latitude');
  const longitude = sp.get('longitude');

  if (!latitude || !longitude) {
    return json({ error: 'missing latitude/longitude' }, 400);
  }
  if (latitude.split(',').length > 500) {
    return json({ error: 'too many points' }, 413);
  }

  const upstream = new URL('https://api.open-meteo.com/v1/forecast');
  // Forward every search param verbatim — supports current/hourly/daily/minutely_15/etc.
  for (const [k, v] of sp) upstream.searchParams.set(k, v);
  if (!sp.get('timezone')) upstream.searchParams.set('timezone', 'auto');

  // Stable cache key: sort all params so order doesn't fragment cache entries.
  const sortedParams = new URLSearchParams();
  [...sp.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([k, v]) => sortedParams.append(k, v));
  const cacheKey = new Request(`${url.origin}${url.pathname}?${sortedParams}`, { method: 'GET' });

  const cache = (caches as unknown as { default: Cache }).default;
  const cached = await cache.match(cacheKey);
  if (cached) {
    const r = new Response(cached.body, cached);
    r.headers.set('x-aether-cache', 'hit');
    return r;
  }

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(upstream.toString(), {
      cf: { cacheTtl: 300, cacheEverything: true },
    } as RequestInit & { cf: unknown });
  } catch {
    return json({ error: 'upstream_unreachable' }, 502);
  }

  if (!upstreamRes.ok) {
    if (upstreamRes.status === 429 || upstreamRes.status >= 500) {
      const degraded = json(
        { error: `upstream_${upstreamRes.status}`, current: null, retry_after: 60 },
        200,
        { 'cache-control': 'public, max-age=30, s-maxage=30', 'x-aether-cache': 'miss-degraded' },
      );
      ctx.request && (await cache.put(cacheKey, degraded.clone()));
      return degraded;
    }
    return json({ error: `upstream_${upstreamRes.status}` }, upstreamRes.status);
  }

  const body = await upstreamRes.text();
  const res = new Response(body, {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'cache-control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
      'x-aether-cache': 'miss',
    },
  });
  await cache.put(cacheKey, res.clone());
  return res;
};

function json(payload: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      ...extra,
    },
  });
}
