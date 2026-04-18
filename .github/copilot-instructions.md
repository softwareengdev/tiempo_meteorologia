# Copilot Instructions for AetherCast (tiempo_meteorologia)

## Project Overview
AetherCast is the world's most advanced meteorology web platform (2026). It features an immersive interactive map, AI-powered weather explanations, multi-model forecasting, and 80+ professional weather layers.

## Tech Stack
- **Framework**: Next.js 15 (App Router) + TypeScript + React Server Components
- **Styling**: Tailwind CSS v4 + shadcn/ui + Framer Motion
- **Maps**: MapLibre GL JS with custom WebGL particle layers
- **Data**: Open-Meteo API (primary, free) + optional premium APIs
- **State**: Zustand (global) + TanStack Query (server state)
- **Charts**: Recharts
- **Auth**: NextAuth.js v5
- **Testing**: Vitest (unit) + Playwright (e2e)

## Architecture Patterns
- Use React Server Components by default; add `"use client"` only when needed (hooks, browser APIs, interactivity)
- API routes in `/src/app/api/` act as proxy to external weather APIs
- Weather data fetching goes through `/src/lib/weather/` services
- All components follow atomic design: atoms in `ui/`, molecules in `widgets/`, organisms in `layout/`
- Map-related components live in `/src/components/map/`

## Coding Standards
- TypeScript strict mode; no `any` types
- Use `clsx` + `cn()` utility for conditional classes
- Prefer named exports over default exports (except pages)
- All API responses typed in `/src/types/`
- Spanish is the default UI language
- Use Lucide React for icons
- Animations via Framer Motion with `prefers-reduced-motion` respect
- Error boundaries on every route segment

## Weather Data
- Primary API: Open-Meteo (https://api.open-meteo.com)
- Models: ECMWF, ICON, GFS, HRRR
- Always handle API errors gracefully with fallback UI
- Cache weather data with TanStack Query (staleTime: 5 minutes)

## Performance
- Target < 1s initial load (use SSR + edge caching)
- Lazy load map and heavy components
- Use `next/dynamic` for client-only components
- Optimize images with `next/image`

## Accessibility
- WCAG AA compliance minimum
- All interactive elements must be keyboard navigable
- Use semantic HTML and ARIA labels
- Support `prefers-color-scheme` and `prefers-reduced-motion`
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
