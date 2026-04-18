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
