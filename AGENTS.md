<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AetherCast — Phase 2 Conventions

## Brand & Design
- Brand palette in globals.css: `--brand-aether-50..900`, gradients `aurora`, `storm`, `glow`.
- Use utility classes: `.glass`, `.text-gradient-aurora`, `.text-gradient-sky`, `.shadow-glow`, `.aurora-bg`, `.bg-grid`.
- Fonts: `--font-sans` (Inter), `--font-display` (Manrope), `--font-mono` (JetBrains Mono).
- Spanish UI by default. Tone: profesional, técnico pero accesible.

## Mobile-First Responsive
- Use `h-dvh` (defined in globals.css) instead of `h-screen` for full viewport.
- Sidebar: full overlay on mobile (with backdrop), 64-wide on `md:` and up.
- Bottom nav (`MobileBottomNav`) is always visible on `md:hidden`; pages add `pb-16 md:pb-0`.
- Use safe area insets: `.pb-safe`, `.pt-safe`.
- Widget panels become bottom drawers on mobile (`45dvh` height), floating sidebars on desktop.

## SEO
- Always import shared SEO from `@/lib/seo`: `SITE_URL`, `SITE_NAME`, `MAJOR_CITIES`.
- Add JSON-LD via the `<JsonLd data={...} />` component from `@/lib/seo`.
- Each new page must export `metadata` with `title`, `description`, `alternates.canonical`, `openGraph`, `twitter`.
- Static OG: route `/opengraph-image` (edge runtime). Twitter equivalent at `/twitter-image`.
- `robots.ts` and `sitemap.ts` (Next `MetadataRoute`) are the source of truth — update `MAJOR_CITIES` to add city URLs.

## Cloudflare Pages
- Project deploys via GitHub→Cloudflare Pages integration (recommended on Windows).
- Build command in dashboard: `npx @cloudflare/next-on-pages`  •  Output: `.vercel/output/static`  •  Compatibility flags: `nodejs_compat`.
- All API routes MUST export `runtime = 'edge'`.
- Headers/redirects also configured in `public/_headers` and `public/_redirects` for Cloudflare-native handling.

## Lucide-react
- Use latest API names. `Github`/`Twitter` no longer exist — use `Code2`/`X` instead.

## Open-Meteo APIs
- Forecast: `api.open-meteo.com/v1/forecast`
- Air quality: `air-quality-api.open-meteo.com/v1/air-quality`
- Marine: `marine-api.open-meteo.com/v1/marine` (returns 400 inland → handle gracefully, use `retry: 0`)
- Geocoding: `geocoding-api.open-meteo.com/v1/search`
- All free, no key required. Cache via TanStack Query (`staleTime: 5 minutes`).

## Build & Deploy
- `pnpm build` — Next.js production build (verified working).
- `pnpm pages:build` — Cloudflare adapter (run on Linux/macOS/WSL only).
- `pnpm deploy` — wrangler pages deploy (requires `wrangler login`).

# AetherCast — Phase 3 Conventions

## Map Layers (visible & functional)
- ``useWeatherOverlay`` (in ``src/components/map/weather-overlay.tsx``) renders:
  - **Real radar tiles** (RainViewer) for ``precipitation``, ``rain``, ``snow``, ``snowfall``.
  - **Sampled grid circles** for all other layers (temperature, wind, clouds, pressure, humidity, visibility, UV, CAPE, dew_point, wind_gusts) — fetched live from Open-Meteo across the visible bbox, debounced on ``moveend``.
- ``MapLegend`` shows up to 4 active layer color scales (bottom-left).
- ``TimeSlider`` scrubs forecast hours 0–47 with play/pause; persists in store as ``forecastHourOffset``.
- ``WindParticles`` canvas overlay activates with ``wind`` or ``wind_gusts`` layers.

## Store extensions
- ``forecastHourOffset`` (number, persisted) — sync widgets/overlay to scrubbed time.
- ``favorites`` — ``{ name, coords }[]`` (persisted), with ``addFavorite``/``removeFavorite``.
- DO NOT add functions on the store that call ``useWeatherStore.getState()`` — breaks TS inference. Use selectors at call site instead.

## PWA
- Service worker at ``public/sw.js`` (Cache-First for tiles, SWR for Open-Meteo).
- Registered via ``PWAInstall`` component (also handles ``beforeinstallprompt``).
- Mounted in main pages (``/``, ``/dashboard``, ``/pro``).

## Typography
- Base ``font-size: 17px`` (was 16). Sub-640px → 16px. ``≥1280px`` → 17.5px.
- Body ``line-height: 1.55``.

## Cloudflare Deployment (Workers)
- Adapter: ``@opennextjs/cloudflare`` (NOT ``@cloudflare/next-on-pages`` — that's deprecated and broken on Windows).
- Build: ``npx @opennextjs/cloudflare build`` → ``.open-next/`` (worker.js + assets/).
- Config: ``wrangler.jsonc`` at project root with assets binding.
- Deploy: ``npx wrangler deploy``.
- Live URL pattern: ``https://<project>.<account>.workers.dev``.
- Compatibility flags required: ``nodejs_compat``, ``global_fetch_strictly_public``.
- ``wrangler.toml`` REPLACED by ``wrangler.jsonc`` (don't keep both).

## RainViewer integration
- Public, no key. Tile URL pattern: ``{host}{path}/256/{z}/{x}/{y}/{color}/{options}.png``.
- Get current frame from ``https://api.rainviewer.com/public/weather-maps.json`` → ``radar.past[last].path``.
- Color scheme ``4`` (Universal Blue), options ``1_1`` (smooth + snow).

## Open-Meteo grid sampling
- Endpoint accepts comma-separated lat/lon arrays for batch sampling — use this pattern, not N parallel requests.
