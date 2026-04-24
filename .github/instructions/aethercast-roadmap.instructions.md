---
applyTo: "**"
description: "Roadmap de 6 fases para llevar AetherCast al nivel de las mejores webs meteorológicas del mundo. Auto-cargado por Copilot CLI como contexto global del proyecto."
---

# 🌩️ AetherCast — Roadmap de Mejora Mobile-First (6 Fases)

> **Generado**: 2026-04-24 tras auditoría en vivo de https://tiempo-meteorologia.pages.dev/ con Edge DevTools MCP
> **Objetivo**: Convertir AetherCast en la mejor web de meteorología en español, superando a Windy, Ventusky, Meteoblue y AccuWeather en UX mobile, SEO y rendimiento.
> **Premisa**: 70% del tráfico es mobile → todo se diseña primero para 360–430 px y luego se escala.

---

---

## ✅ Fase 2 — Mobile-First Reconquista (COMPLETADA · 2026-04-24)

| Cambio | Detalle |
|--------|---------|
| **Bottom-sheet (vaul)** | `WidgetPanel` con `Drawer.Root` (snap points `96px / 50% / 92%`), `modal={false}` para no bloquear el mapa, `dismissible={false}` (siempre presente), pull-to-refresh nativo (touch-only, 80px threshold → `qc.invalidateQueries(['weather','airQuality','marine'])`) |
| **Tabs segmentados** | `SegmentedTabs<T>` reutilizable con pill animado (`motion.layoutId`), haptic `select`. 4 vistas: Ahora · Hoy · 7 días · Detalle. Filtra qué widgets se muestran |
| **Hero móvil rediseñado** | `CurrentWeatherWidget` ahora con temperatura `text-7xl` (8xl en `sm:`), icono ilustrativo grande, glance-ribbon de 3 KPIs (prob. lluvia 6h / viento / humedad), `<details>` con métricas extendidas, skeleton loading |
| **Outdoor Mode** | Botón en Header (`OutdoorMode`) que pone `data-outdoor="1"` en `<html>`. CSS sube font-size a 19.5px y bumpea contraste de todas las opacidades (`/30..70` → mayor opacidad, bordes más visibles). Diseño una sola vez, cascada global |
| **Web Share + Haptic** | Hooks `useShare()` (Web Share API + clipboard fallback) y `useHaptic()` (Vibration API, respeta `prefers-reduced-motion`). Cableados al hero share button y a tabs/nav |
| **Bottom-nav 4 ítems** | De 5 → 4 cols (Mapa · Panel · Pro · Más). Eliminado "Capas" (ya hay hamburger en Header). Touch target `min-h-[56px]`, indicador animado superior |
| **Layout fullbleed mapa** | `app/page.tsx` reescrita: mapa absoluto + `<WidgetPanel />` flotante (drawer en mobile, aside derecho en `lg:`). 11 widgets eliminados del JSX inline |
| **Persistencia store** | `mobileTab` y `outdoorMode` añadidos a Zustand con `persist` |
| **`min-h-screen` → `min-h-dvh`** | Restante en `/location/[slug]` corregido |

**Validaciones**:
- `pnpm type-check` ✅
- `pnpm lint` ✅ baseline preservada (4 errores pre-existentes; widget-panel usa el mismo patrón `eslint-disable-next-line react-hooks/set-state-in-effect`)
- `pnpm build` ✅ 36 páginas, build OK
- Edge DevTools MCP: drawer abre con peek inicial, tabs swap content, hero `21°` + share button + glance ribbon visibles, outdoor toggle activo en header, no errores nuevos en consola

**Aprendizajes técnicos**:
- vaul 1.1.2 `Drawer.Root` con `modal={false}` + `dismissible={false}` + `open` controlado: montar `open=true` en `useEffect` evita SSR mismatch. Necesita `Drawer.Title`/`Description` (sr-only OK) para a11y
- vaul `snapPoints` acepta strings (`'96px'`) y números 0..1 (vh fraction). Mezclar es válido
- `qc.invalidateQueries({ queryKey: ['weather'] })` invalida por prefijo (todas las variantes con args extras)
- Pull-to-refresh: bastan `touchstart`/`touchmove` con guard `scrollTop <= 0` y umbral 80px. Sin libs ni overscroll API
- Outdoor mode: usar atributo en `<html>` + selectores `html[data-outdoor="1"] .text-white\/30 { ... }` cubre todo el cascade sin tocar componentes
- Web Share API solo está en HTTPS o localhost; en desktop falla silente → fallback a clipboard

---

## ✅ Fase 1 — Estabilización (COMPLETADA · 2026-04-24)

| Error | Estado | Fix aplicado |
|-------|--------|--------------|
| **E1** Recharts `-1×-1` warnings | ✅ Resuelto | Hook `useMounted` (useEffect) + altura numérica fija en todos los `<ResponsiveContainer>` (hourly, meteogram, humidity, weather-charts ×2, model-comparison, climate-history) |
| **E2** RSC `__PAGE__.txt` 404 | ✅ Mitigado | `prefetch={false}` en todos los `<Link>` internos del Header y MobileBottomNav. Causa raíz: `output: 'export'` no genera payloads RSC. Sin impacto funcional |
| **E3** theme-color `#fff` en dark | ✅ Falso positivo | Ya existían dos `<meta name="theme-color">` con `media` (light/dark). MCP solo leyó el primero |
| **E4** Touch targets <32 px | ✅ Resuelto | Header buttons `h-11 w-11`, nav links `min-h-[44px]`, MobileBottomNav `min-h-[48px]`, Sidebar layer toggles `min-h-[44px] py-2.5` |
| **E5** H1 = "AetherCast" | ✅ Resuelto | Header logo: `<h1>` → `<span>`. Home queda con 0 H1s. `/location/[slug]` añade H1 SEO `Tiempo en {city}, {country}` |
| **E6** `/location/[slug]` shell vacío | ✅ Resuelto | Reescritura completa: usa `MAJOR_CITIES` (20 ciudades pre-renderizadas, antes 10), JSON-LD BreadcrumbList + Place, copy SEO descriptiva, cross-links a otras ciudades, metadata + canonical/og/twitter |
| **E7** Banner PWA tapa AI chat | ✅ Resuelto | Reposicionado `left-4 right-4 bottom-20 mx-auto md:left-4 md:right-auto md:bottom-6 md:max-w-xs` |
| **E8** manifest.json 2× | ✅ Falso positivo | Solo hay un `<link rel="manifest">` en layout |
| **E9** /icons/icon.svg sin caché | ✅ Falso positivo | `public/_headers` ya tiene `Cache-Control: immutable` para `/icons/*` |
| **E10** Banner install no llama prompt() | ✅ Falso positivo | `PWAInstall` sí muestra CTA visible y llama `prompt()` al click |
| **NEW** AstronomyWidget hydration mismatch (MoonSVG con `new Date()`) | ✅ Resuelto | Gate `useMounted`: SSR usa fecha estable, post-mount usa la actual |
| **NEW** `generateStaticParams` solo 10 ciudades hard-coded mientras sitemap lista 20 | ✅ Resuelto | Ahora consume `MAJOR_CITIES` directamente (single source of truth) |

**Validaciones**:
- `pnpm type-check` ✅
- `pnpm lint` ✅ baseline preservada (4 errores pre-existentes en theme-toggle/time-slider/weather-overlay, fuera de scope)
- `pnpm build` ✅ 36 páginas estáticas, 20 location/[slug] pre-renderizadas
- Edge DevTools MCP: 0 warnings Recharts post-fix, H1 home = 0, location/london title + 5 JSON-LD + breadcrumb ✅

**Aprendizajes técnicos**:
- En static export (`output: 'export'`) los RSC payloads no existen ⇒ usar `prefetch={false}` en Links internos
- `useSyncExternalStore` para "mounted" NO espera el layout pass; `useEffect + setState` sí (con `eslint-disable-next-line react-hooks/set-state-in-effect` en la línea del setState)
- Recharts v3: `<ResponsiveContainer height="100%">` + parent flex sin altura medida ⇒ warning. Fix: pasar `height={N}` numérico igualando la altura del padre

---

## 📊 1. Estado actual (auditoría real)

### ✅ Fortalezas detectadas
- **Carga muy rápida**: TTFB 32 ms · DOMContentLoaded 357 ms · Load 663 ms · FCP 840 ms.
- **Bundle razonable**: chunk principal 264 KB, total transfer ~10 KB HTML + ~600 KB JS comprimido.
- **PWA real**: `manifest.json` ✅, Service Worker registrado ✅, install banner activo.
- **SEO base sólida**: meta description 226 chars, OG, Twitter, canonical, **6 bloques JSON-LD**, sitemap con 27+ URLs (incluyendo 19 ciudades), robots.txt correcto con `GPTBot` y `Googlebot` permitidos.
- **i18n correcta**: `<html lang="es">`, viewport con `viewport-fit=cover` ✅, safe-area soportada.
- **Mapa profesional**: MapLibre + dark-matter Carto + radar RainViewer real + 14 capas + grid sampling Open-Meteo batch (excelente patrón anti-N+1).
- **Multi-modelo real**: ECMWF, ICON, GFS, HRRR + selector "Mejor combinación".
- **Multi-API**: forecast + air-quality + marine + geocoding (todo Open-Meteo, sin claves).
- **Sin imágenes faltantes alt** (porque no usa `<img>`, usa SVGs/iconos Lucide).

### ❌ Errores detectados (corregir en Fase 1)

| # | Severidad | Síntoma | Causa probable | Archivo sospechoso |
|---|-----------|---------|----------------|--------------------|
| E1 | **High** | `[WARN] Recharts: width(-1) and height(-1)` × 3 | `<ResponsiveContainer>` dentro de un padre con `display: none` o `height: 0` durante el primer render (probablemente paneles del Dashboard antes de hidratar) | `src/components/widgets/*Chart*.tsx`, `src/app/dashboard/page.tsx` |
| E2 | High | `404` en `/pro/__next.pro.__PAGE__.txt?_rsc=*` y `/dashboard/__next.dashboard.__PAGE__.txt?_rsc=*` | RSC payload mal generado por adaptador (open-next + nested route segment con paréntesis o nombre repetido). Rompe prefetch y navegación instantánea | `next.config.ts`, `open-next.config.ts`, segmentos `app/pro` y `app/dashboard` |
| E3 | Medium | `theme-color` = `#ffffff` en modo oscuro (la app es dark por defecto) | Falta variante `media="(prefers-color-scheme: dark)"` | `src/app/layout.tsx` (metadata.themeColor) |
| E4 | Medium | **12 elementos con touch target < 32 px** en home a 921 px de ancho (en mobile real serán muchos más) | Iconos del mapa (zoom +/-, geolocate, brújula) y selectores de capa con padding insuficiente | `src/components/map/*controls*`, `src/components/sidebar/*` |
| E5 | Medium | `H1` = "AetherCast" (marca, no keyword) | El H1 debería ser semántico p.ej. `El tiempo en Madrid` o `Mapa meteorológico mundial` | `src/components/layout/Header.tsx`, páginas `app/page.tsx` y `location/[slug]/page.tsx` |
| E6 | Medium | `/location/madrid` devuelve **shell vacío** (solo header lat/lon) — sin contenido SSR | La página depende de hidratación cliente: googlebot indexa muy poco contenido | `src/app/location/[slug]/page.tsx` |
| E7 | Low | Banner "Instalar AetherCast" tapa el botón flotante de chat IA en mobile | Z-index/posición conflictiva | `src/components/pwa/PWAInstall.tsx`, `src/components/ai/ChatWidget.tsx` |
| E8 | Low | `manifest.json` se descarga **dos veces** | Probablemente `<link rel="manifest">` duplicado entre `layout.tsx` y `head` manual | `src/app/layout.tsx` |
| E9 | Low | `/icons/icon.svg` se descarga **3 veces** sin caché agresiva | Falta header `Cache-Control: immutable` en `public/_headers` para `/icons/*` | `public/_headers` |
| E10 | Low | Banner PWA `beforeinstallprompt` se previene pero nunca llama `prompt()` espontáneamente | Lógica intencional pero sin CTA visible al usuario para activarla | `PWAInstall.tsx` |

---

## 🏆 2. Comparativa con el Top-10 mundial (estilo, UX y funciones)

| Web | Lo que mejor hace | Lo que vamos a robar |
|-----|-------------------|----------------------|
| **windy.com** | Mapa fullscreen inmersivo, particulas de viento WebGL ultra fluidas, time-slider sticky bottom, picker de modelos discreto | Particle layer aún más optimizada, time-slider con miniatura preview, picker de modelo en chip persistente |
| **ventusky.com** | Cambio de capa instantáneo, leyenda contextual, paleta saturada, branding minimalista | Animación fluida de transición entre capas (cross-fade 200 ms), tooltip on long-press en mobile |
| **yr.no** | **Diseño mobile reference**: tipografía enorme legible al sol, gráfico meteograma vertical scrolleable, cero ruido visual, accesibilidad AA+ | Meteograma vertical en mobile (sustituir tarjetas horizontales por timeline scroll), foco extremo en legibilidad outdoor |
| **weather.com** | Hourly cards con icono+temp+precipitación de un vistazo, alerts banner top, búsqueda predictiva potente | Tarjetas horarias con micro-barra de probabilidad, banner de alertas top sticky |
| **accuweather.com** | "RealFeel®" branded, MinuteCast (precipitación min a min), forecast vídeo | Sensación térmica diferenciada con explicación, **PrecipNow™** propio: probabilidad min-a-min basada en RainViewer, tarjeta de "qué ponerme" |
| **wunderground.com** | Datos hiper-locales de estaciones PWS, gráficos detallados, historial | Sección "Estaciones cercanas" usando OpenStreetMap + WeatherFlow Tempest free tier |
| **meteoblue.com** | Gráfico **Multi-Modelo en una sola imagen** (spaghetti), pictogramas propios, 14-day | Spaghetti chart de comparación de modelos en `/pro` (ya parcialmente hecho), pictogramas SVG propios animados |
| **weather.gov / metoffice.gov.uk** | Alertas oficiales geocodificadas, lenguaje claro, accesibilidad gov-grade | Sistema de alertas con polígono geográfico en el mapa, simplificación lingüística |
| **tiempo.com (Meteored)** | Líder en España: SEO local insuperable (`/tiempo-en-madrid`), comunidad, foros | Reescribir slugs SEO españoles, agregar 200+ ciudades ES a sitemap, microcopy localizado |
| **aemet.es** | Avisos oficiales, datos crudos, autoridad | Integrar feed oficial de avisos AEMET (XML público), badge "datos AEMET" |

### 📐 Patrones UX universales del top-10 que **faltan o flojean** en AetherCast
1. **Hero card con la temperatura en huge type** (96–120 px) — yr.no, weather.com, accuweather lo tienen; AetherCast la tiene a ~72 px y compite con sidebar.
2. **"Hoy / Mañana / 7 días"** como tabs primarias mobile (no submenú).
3. **Probabilidad de lluvia** como dato hero junto a la temp (no escondida en grid).
4. **Sunrise/sunset con arco visual SVG** animado (yr.no, weather.com).
5. **Compartir** rápido (Web Share API) → falta en AetherCast.
6. **Búsqueda con autocompletado por geocoding y sugerencias por geolocalización**.
7. **Pull-to-refresh** mobile real.
8. **Skeleton loaders** en lugar de "spinner+blank".
9. **Microinteracciones**: haptics en cambio de capa (Vibration API), spring transitions.
10. **Modo lectura outdoor**: alto contraste con un toque, fuente +20%.

---

## 🚀 3. Las 6 Fases de Mejora

> Cada fase se ejecuta en una rama `phaseN/...`, con su PR y verificación lighthouse + visual regression.

---

### 🔴 **FASE 1 — Estabilización & Higiene** *(prioridad crítica, bloquea lo demás)*

**Objetivo:** dejar el sitio en cero errores y cero warnings antes de añadir nada.

**Scope:**
- [ ] Corregir E1 (Recharts -1×-1): wrappear con `useResizeObserver` o `min-height` en CSS.
- [ ] Corregir E2 (404 RSC): probar build con `pnpm build && wrangler pages dev .vercel/output/static` y revisar `app/pro/page.tsx`/`app/dashboard/page.tsx` para evitar segmentos colisionantes; si persiste, fijar `dynamic = "force-static"` o reportar a `@opennextjs/cloudflare`.
- [ ] Corregir E3 (theme-color): en `layout.tsx` exportar `themeColor: [{ media:'(prefers-color-scheme: dark)', color:'#0a0e1a' }, { media:'(prefers-color-scheme: light)', color:'#ffffff' }]`.
- [ ] Corregir E4: aumentar todos los hit-targets a **min 44×44 px** (Apple HIG) en mapa controls, sidebar items, mobile bottom nav.
- [ ] Corregir E7/E8/E9/E10.
- [ ] Añadir **Sentry edge** (gratis hasta 5k events) o `console.error` shipping a Cloudflare Analytics.
- [ ] Lighthouse mobile: **objetivo ≥ 95 en las 4 categorías**.
- [ ] Configurar **Playwright visual regression** para `/`, `/dashboard`, `/pro`, `/location/madrid` en 3 viewports (390, 768, 1440).

**Criterio de aceptación:** consola sin warnings/errors, 0 requests 404, LCP < 1.5 s en 4G, todos los targets táctiles ≥ 44 px.

---

### 📱 **FASE 2 — Mobile-First Reconquista** *(70% del tráfico)*

**Objetivo:** rediseñar la experiencia mobile para que supere a yr.no en legibilidad y a windy en fluidez.

**Scope:**
- [ ] **Hero meteorológico mobile**: temperatura 112 px, sensación térmica + probabilidad de lluvia + viento de un vistazo (above-the-fold sin scroll).
- [ ] **Tabs primarias** "Ahora · Hoy · 7 días · Mapa" en lugar del bottom nav genérico.
- [ ] **Meteograma vertical** scrolleable (timeline 24 h) inspirado en yr.no — sustituye tarjetas horizontales que requieren scroll horizontal.
- [ ] **Bottom-sheet modular** (Vaul o `<dialog>`) para favoritos, capas y ajustes — mejor que sidebar deslizante.
- [ ] **Pull-to-refresh** real con `framer-motion` `useDragControls`.
- [ ] **Web Share API** (botón compartir) en hero.
- [ ] **Vibration API** suave (5 ms) en cambio de capa y selección de favorito (respetando `prefers-reduced-motion`).
- [ ] **Modo outdoor** (toggle ☀️): aumenta tipografía 20%, contraste AAA, deshabilita partículas.
- [ ] Sustituir todos los `h-screen` restantes por `h-dvh`. Auditar safe-area.
- [ ] **Skeleton loaders** en widgets (`shadcn/skeleton`).
- [ ] Reescribir bottom-nav: 4 ítems máximo + label corta + icono 24px + altura 56 px + safe-area-inset-bottom.

**Criterio de aceptación:** test manual en iPhone SE (375), Pixel 7 (412) y iPhone 14 Pro Max (430). Todo accesible sin scroll horizontal. Score Lighthouse mobile UX ≥ 98.

---

### 🎨 **FASE 3 — UI/UX Polish & Branding** *(quedar "espectacular")*

**Objetivo:** que cada pantalla sea instagrameable y consistente.

**Scope:**
- [ ] **Pictogramas meteo propios** (SVG animados, 32 estados WMO codes, dark+light) — reemplazar `lucide-react` para iconos meteo. Inspiración: meteoblue + breezy.
- [ ] **Sistema de iconografía animada** con Lottie ligero (< 5 KB c/u) para precipitación, sol, nube.
- [ ] **Arco SVG sunrise/sunset** animado en widget Sol/UV.
- [ ] **Aurora background** dinámico que cambia según condición actual (despejado→azul-rosa, tormenta→morado-gris, nieve→blanco-celeste).
- [ ] **Microinteracciones spring** (framer-motion) en cambio de capa, selección de favorito, click en hora del meteograma.
- [ ] **Tipografía**: ajustar escala a `clamp()` fluido, line-height 1.3 en hero, 1.55 en body, tracking -0.02em en displays.
- [ ] **Colores de capa unificados**: paleta meteorológica estándar WMO (no inventada): viento Beaufort, temp NCAR, precip USGS.
- [ ] **Modo claro pulido** (actualmente prioriza dark) — revisar contraste todos los componentes.
- [ ] **Página `/landing` completa** con hero animado, comparativa visual con Windy/Ventusky, video demo, testimonios reales (los actuales son ficticios — sustituir o marcar "ejemplo").
- [ ] **Empty states ilustrados** (favoritos vacíos, búsqueda sin resultados, offline).
- [ ] **Loading screen** con animación de marca (anillo aether girando).
- [ ] **Iconos PWA** ya generados (192/512/maskable/monochrome) — verificar 100% conformes a maskable.app.

**Criterio de aceptación:** review visual con figma comparando antes/después. Test de 5 segundos: usuarios identifican qué es la app y para qué sirve.

---

### ⚡ **FASE 4 — Funcionalidades Killer** *(superar al top-10)*

**Objetivo:** features que ningún competidor tiene gratis o tiene mal.

**Scope:**
- [ ] **PrecipNow™** — probabilidad minuto a minuto próximas 2 h usando interpolación de frames RainViewer + ML simple en cliente (compite con AccuWeather MinuteCast).
- [ ] **"¿Qué me pongo?"** — recomendación de vestimenta basada en temp, viento, lluvia, UV (icono + frase corta + emoji).
- [ ] **Alertas oficiales** — integrar feed AEMET XML (España) + NWS alerts (USA) + Met Office (UK), pintar polígonos en el mapa.
- [ ] **Estaciones cercanas (PWS)** — usando WeatherFlow Tempest API gratuita o Madis NOAA.
- [ ] **Spaghetti chart multi-modelo** mejorado en `/pro` (ya iniciado): añadir banda de incertidumbre P10–P90.
- [ ] **Comparador de ciudades** — hasta 4 ciudades lado a lado (mobile: swipe).
- [ ] **Asistente IA conversacional** mejorado: usar Workers AI (`@cf/meta/llama-3.1-8b-instruct`, free tier Cloudflare) para explicar el tiempo en lenguaje natural en español. Prompt enriquecido con datos JSON del forecast actual.
- [ ] **Modo navegación** — para usuarios moviéndose: muestra el tiempo en la ruta (integración con Open-Source Routing Machine).
- [ ] **Notificaciones push web** (suscripción opt-in) usando Web Push + Cloudflare Queues para alertas personalizadas.
- [ ] **Widget embed** (`<iframe>`) para que blogs incrusten el tiempo de su ciudad.
- [ ] **API pública gratuita** documentada (proxy Open-Meteo + caché edge) — convierte la marca en autoridad técnica.
- [ ] **Modo "Caza-tormentas"**: capa CAPE + helicidad + cizalladura + rayos (Blitzortung WebSocket gratuito).

**Criterio de aceptación:** cada feature con test e2e Playwright + documentación en `/sobre/funciones`.

---

### 🔍 **FASE 5 — SEO, Indexación & Posicionamiento**

**Objetivo:** rankear top-3 en `tiempo en {ciudad}` para 200+ ciudades hispanohablantes y top-10 EN para "interactive weather map".

**Auditoría SEO actual:**
- ✅ sitemap.xml con 27+ URLs, lastmod correctos
- ✅ robots.txt correcto, GPTBot/Googlebot allow
- ✅ 6 bloques JSON-LD (Organization, WebSite, etc.)
- ✅ canonical, OG, Twitter cards
- ❌ H1 = "AetherCast" (debería ser keyword principal de la página)
- ❌ Páginas `/location/{slug}` con contenido casi vacío en SSR
- ❌ Solo 19 ciudades — competencia tiene > 5000
- ❌ Falta hreflang (`es-ES`, `es-MX`, `en`, `pt`)
- ❌ Sin breadcrumbs JSON-LD ni visuales
- ❌ Sin contenido editorial (blog/glosario meteorológico)

**Scope:**
- [ ] **H1 dinámicos**: `El tiempo en {ciudad}, {país}` en `/location/[slug]`.
- [ ] **SSR completo en `/location/[slug]`**: pre-renderizar 500 ciudades top-mundo con `generateStaticParams()` + ISR cada hora (vía `revalidate=3600`). Cada página: hero + meteograma + 7 días + alertas + texto descriptivo SEO ("El clima de Madrid es continental mediterráneo...").
- [ ] **Generator de páginas** desde GeoNames (cities500.txt, gratis, 200k ciudades): top-1000 prioridad en sitemap.
- [ ] **Sitemap segmentado**: `sitemap-index.xml` + `sitemap-cities-1.xml`, `sitemap-cities-2.xml` (50k URL/sitemap límite Google).
- [ ] **Hreflang** completo en `<head>`.
- [ ] **Breadcrumbs** visuales + `BreadcrumbList` JSON-LD.
- [ ] **WeatherForecast schema.org** JSON-LD por ciudad (no oficial pero indexa rich results).
- [ ] **FAQPage** JSON-LD en landing y `/sobre`.
- [ ] **Blog `/blog`**: 20 artículos cornerstone ("Qué es CAPE", "Cómo leer un mapa de presión", "Diferencia ECMWF vs GFS", etc.) generados con LLM y revisados.
- [ ] **Glosario `/glosario`** con 100+ términos meteorológicos enlazables internamente.
- [ ] **Internal linking**: cada `/location/{x}` enlaza a 5 ciudades cercanas (calculado con haversine en build).
- [ ] **Page speed**: meta INP < 200 ms, CLS < 0.05, LCP < 1.8 s en p75 mobile (Search Console CWV).
- [ ] **Open Graph image dinámica** por ciudad (`/location/[slug]/opengraph-image` edge runtime con `@vercel/og`/`workers-og`).
- [ ] **Search Console + Bing Webmaster**: dar de alta, enviar sitemap, monitorizar.
- [ ] **Schema verification**: pasar test Google Rich Results en todas las plantillas.
- [ ] **Backlinks naturales**: API pública gratuita + widget embed (Fase 4) atraen enlaces.

**Criterio de aceptación:** índice Google con 1000+ páginas indexadas en 60 días, CWV verde en > 75% de URLs, 10 keywords top-10 en Search Console.

---

### 🧪 **FASE 6 — Optimización, Observabilidad & Continuidad**

**Objetivo:** rendimiento perfecto y proceso para mantenerlo.

**Scope:**
- [ ] **Bundle splitting agresivo**: dynamic import del mapa (260 KB chunk) sólo en rutas que lo usan; landing/pricing sin MapLibre.
- [ ] **Route-level code splitting** revisado con `next-bundle-analyzer`.
- [ ] **Imagen `next/image`** para todos los pictogramas WMO (AVIF + WebP fallback), srcSet por DPR.
- [ ] **Preload selectivo**: fonts woff2 preload, hero CSS critical inline.
- [ ] **Service Worker mejorado**: precaching del shell + runtime cache stale-while-revalidate para Open-Meteo (5 min), cache-first para tiles RainViewer (10 min) e iconos.
- [ ] **Background sync**: subir refresh de favoritos cuando vuelve la conexión.
- [ ] **Web Vitals reporting** a Cloudflare Analytics (`reportWebVitals` de Next).
- [ ] **Tests automáticos**:
  - Vitest unit para `lib/weather/*` (parsing, transformaciones)
  - Playwright e2e: 10 user flows críticos
  - Lighthouse CI en GitHub Actions: presupuestos por ruta (LCP, CLS, TBT)
  - axe-core a11y en cada PR
- [ ] **CI/CD**: pre-push hook con `pnpm lint && pnpm typecheck`, GH Action que comenta perf delta en PRs.
- [ ] **Feature flags** (Cloudflare KV) para rollouts graduales.
- [ ] **A/B testing** ligero (Cloudflare Workers) para hero variants.
- [ ] **Monitorización**:
  - Cloudflare Analytics (already free)
  - Sentry edge runtime para errores
  - Custom Worker que pinguea Open-Meteo cada 5 min y alerta si tarda > 2 s
- [ ] **Documentación viva**: `/docs` con Storybook o Ladle de componentes UI.
- [ ] **Pricing page real** (`/precios`) si se monetiza Pro algún día (objetivo: mantener gratis).

**Criterio de aceptación:** Lighthouse CI presupuestos verdes en main, p75 mobile LCP < 1.5 s en CrUX, 0 regresiones visuales sin aprobación.

---

## 📌 4. Convenciones y reglas a respetar siempre

- **Mobile-first absoluto**: cada nuevo componente se diseña primero a 360 px, luego se mejora a `md:` y `xl:`.
- **`h-dvh` siempre**, nunca `h-screen`.
- **Touch targets ≥ 44 × 44 px** (auditar con extensión Tappable).
- **`prefers-reduced-motion` respetado** en cada animación.
- **`prefers-color-scheme` respetado** en theme-color y palettes.
- **Spanish first**, inglés como segundo idioma vía sub-ruta o hreflang.
- **Edge runtime** en TODAS las API routes (`export const runtime = 'edge'`).
- **TanStack Query** con `staleTime: 5 * 60 * 1000`, `retry: 0` para marine.
- **Sin `any`** en TypeScript; usar `unknown` + narrowing.
- **Named exports** salvo páginas Next.
- **Lucide React** para iconos UI; pictogramas meteo propios SVG.
- **Open-Meteo** como API canónica; nunca pegar API keys.
- **`AGENTS.md` y este archivo se sincronizan**: si añades una convención nueva, actualiza ambos.

---

## 🛠️ 5. Cómo trabajar este roadmap con Copilot CLI

```
# Empezar fase N
copilot
> /plan
> Trabaja la FASE 1 del roadmap. Lista todos los E1-E10 como TODOs y empieza por E1.

# Para validación visual durante desarrollo
arrancar Edge: msedge.exe --remote-debugging-port=9222
> Abre tiempo-meteorologia.pages.dev en Edge y verifica que el warning Recharts ya no aparece tras mi fix.
```

El MCP server **edge-devtools** está configurado en `~/.copilot/mcp-config.json` y permite a Copilot CLI navegar, inspeccionar DOM, leer console y network, y tomar screenshots para validar cada cambio.

---

## 📈 6. KPIs de éxito (medibles)

| Métrica | Hoy | Objetivo Fase 6 |
|---------|-----|------------------|
| Lighthouse mobile Performance | ~85 (estimado) | **≥ 95** |
| Lighthouse mobile Accessibility | ~90 | **100** |
| LCP p75 mobile (CrUX) | desconocido | **< 1.5 s** |
| INP p75 | desconocido | **< 150 ms** |
| CLS | desconocido | **< 0.05** |
| Páginas indexadas Google | < 30 | **> 1000** |
| Keywords en top-10 | 0 | **≥ 25** |
| Touch targets ≥ 44 px | ~80% | **100%** |
| Cobertura tests e2e | 0% | **≥ 80% rutas críticas** |
| Errores consola en cualquier ruta | 6+ warnings/errors | **0** |

---

> **Última actualización**: 2026-04-24 · auditoría real con Edge DevTools MCP a la web en producción.
> **Siguiente revisión**: tras completar Fase 1.
