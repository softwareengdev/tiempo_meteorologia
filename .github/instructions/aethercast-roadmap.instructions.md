---
applyTo: "**"
description: "Roadmap de mejora de AetherCast. Cabeza: Fase 7 (UI/UX & paridad web↔móvil, defectos accionables). Cola: histórico de Fases 1-6. Auto-cargado por Copilot CLI."
---

# 🌩️ AetherCast — Roadmap (cabeza: Fase 7 · UI/UX & paridad)

> **Última auditoría**: dual desktop (Edge DevTools MCP @ 1912×948, dev server local) + móvil (emulador Android Pixel 7 API 34, Chrome, viewport 1080×2400 con `adb reverse tcp:3000 tcp:3000`).
> **Capturas**: `.shots/desktop/` y `.shots/mobile/`. Esta carpeta debe estar gitignorada.
> **Filosofía**: ningún defecto pasa a Producción si no aparece como TODO en este documento con criterio de aceptación verificable.

---

## 🟥 FASE 7 — UI/UX Parity & Defect Cleanup *(prioridad crítica · cabeza del roadmap)*

**Misión**: dejar la web y la versión móvil **funcionalmente equivalentes**, sin defectos visibles de renderizado, con navegación coherente, jerarquía visual correcta y modos claro/oscuro ambos legibles.

### 7.0 Catálogo de defectos confirmados (auditoría dual)

> Severidad: 🔴 bloquea uso · 🟠 rompe percepción de calidad · 🟡 mejora secundaria.

#### A. Renderizado / contraste

| ID | Sev | Síntoma | Ruta(s) afectadas | Causa raíz | Archivo objetivo |
|----|-----|---------|-------------------|------------|------------------|
| **A1** | 🔴 | Modo claro globalmente roto: párrafos, subtítulos y descripciones invisibles (texto blanco sobre fondo blanco). Visible en `<p>` con `text-white/55`, `text-white/65`, `text-white/70`. | `/landing`, `/sobre`, `/comparador`, `/dashboard`, `/pro`, `/precios`, `/legal/*` y todo lo que no sea `/` (la home está sobre `bg-[#0b1020]` por lo que se "ve"). | Cuerpos de página fijan colores con utilities `text-white/XX` en vez de tokens semánticos (`text-foreground`, `text-muted-foreground`). El tema light cambia `--background` pero no las clases hardcoded. | Todas las `app/**/page.tsx` que no sean `/` + `globals.css`. |
| **A2** | 🔴 | Header siempre oscuro (`bg-gray-950/75`) incluso en modo claro → contraste invertido respecto al cuerpo de la página. | Todas. | `header.tsx:29` con clase fija dark. | `src/components/layout/header.tsx`. |
| **A3** | 🟠 | Gradiente "AetherCast" + gradiente `text-gradient-sky` / `text-gradient-aurora` desaparecen sobre superficies claras (stops a blanco/translúcido). | `/dashboard` (h1 nombre de ciudad), `/pro` (cabecera de hero card), home en modo light. | Las utilities `.text-gradient-*` en `globals.css` están calibradas para fondos oscuros. | `src/app/globals.css` (variantes light) + `dashboard/page.tsx:53`. |
| **A4** | 🟠 | "Comparativa honesta" tabla en `/landing`: la fila "AetherCast" tiene fondo gradient azul→violeta MUY claro y texto del mismo tono → ilegible. | `/landing`. | Hardcoded gradient sin contraste mínimo AA. | `src/app/landing/page.tsx`. |
| **A5** | 🟠 | Mockup de teléfono en `/landing` se renderiza vacío (solo icono de nube). Debería mostrar preview real o screenshot estático. | `/landing`. | Componente espera datos client que no llegan o un `<img>` que no existe. | `src/app/landing/**` (revisar componente PhonePreview). |
| **A6** | 🟠 | `/pro`: el área de mapa aparece **completamente amarilla** con la capa de temperatura activa (sin gradiente real). Indica fallback a "color extremo" cuando el sampling de Open-Meteo falla en `/pro`. | `/pro`. | `weather-overlay.tsx` clamp de fallback en error de fetch (probable timeout o CORS en el grid sampling de la primera carga). | `src/components/map/weather-overlay.tsx`. |
| **A7** | 🟠 | Humedad dial en `/dashboard` muestra solo una astilla verde minúscula en lugar del anillo completo. | `/dashboard`. | `HumidityWidget` calcula radio/stroke con altura del padre antes de hidratar (ResponsiveContainer con altura cero al primer paint). | `src/components/widgets/humidity-widget.tsx`. |
| **A8** | 🟡 | PrecipNow muestra "2" suelto sin sparkline. | Mobile drawer de `/`. | `precip-now.tsx` renderiza el número del bucket activo pero el SVG de barras no aparece (probable `width=0` mientras el drawer hace su animación). | `src/components/widgets/precip-now.tsx`. |
| **A9** | 🟡 | Stats labels (Sensación / Viento / Humedad / UV máx) en cards de `/comparador` salen en gris muy claro casi invisible en modo light. | `/comparador`. | `text-white/40` en badges. | `src/app/comparador/client.tsx`. |
| **A10** | 🟡 | Botón "Añadir" en `/comparador` (modo light) sale celeste claro sobre cyan claro → bajo contraste. | `/comparador`. | `bg-sky-100 text-sky-300`. | `src/app/comparador/client.tsx`. |

#### B. Layout / superposición

| ID | Sev | Síntoma | Donde | Causa raíz | Archivo |
|----|-----|---------|-------|------------|---------|
| **B1** | 🔴 | **Header móvil colapsado**: el wordmark "AetherCast" se renderiza ENCIMA del input de búsqueda. El botón sidebar (X/Menu), el logo, la nav y el search compiten por el mismo espacio sin `flex-1`/`min-w-0` correcto. | Todas las rutas en mobile (≤640px). | `header.tsx` usa `gap-2` + `shrink-0` en logo y `<LocationSearch />` sin reservar ancho mínimo, y la nav desktop no se oculta hasta `md:flex` pero el grupo izquierdo se desborda antes. | `src/components/layout/header.tsx` (líneas 32-46 y 90-104). |
| **B2** | 🔴 | **Sidebar abierta por defecto** en mobile cubriendo todo el contenido al primer paint. | Todas las rutas. | `weather-store.ts:65` `sidebarOpen: true`. La sidebar se persiste y nunca se inicializa cerrada por breakpoint. | `src/lib/stores/weather-store.ts`. |
| **B3** | 🟠 | Botón `Caza-tormentas` (StormHunter) aparece en rutas que no tienen mapa (`/dashboard`, `/comparador`...) — porque está mounted en `app/page.tsx` pero también filtra mal en otras o se pinta como FAB cuando no hay mapa. Verificar: en captura `/landing` aparece la "N" del Next dev overlay (eso es OK, falso positivo). El StormHunter sí está limitado a `/`. | `/`. | OK, mantener. | – |
| **B4** | 🟠 | FAB AI Chat (esquina inferior derecha) tapa el botón "Más" del bottom-nav en mobile. | Mobile, todas las rutas con `<MobileBottomNav />` y `<AIChat />`. | El FAB se posiciona `bottom-6 right-6` sin tener en cuenta los 64px del bottom-nav. | `src/components/ai/ai-chat.tsx` (FAB) o `src/components/layout/widget-panel.tsx` (peek snap). |
| **B5** | 🟠 | Geolocate del mapa (`bottom-left`) tapa el label "Mapa" del bottom-nav. | Mobile, `/`. | Maplibre default control posicionado sin offset bottom. | `src/components/map/weather-map.tsx` (en `addControl(GeolocateControl)`, definir `position` o offset CSS). |
| **B6** | 🟠 | Banner PWA "Add to Home Screen" (Chrome móvil nativo) se monta encima del bottom-nav y tapa la nav. | Mobile, todas las rutas. | El banner es del navegador, no se puede ocultar — pero podemos compensar con `padding-bottom` extra cuando `display-mode: browser`. | `MobileBottomNav` o `globals.css`. |
| **B7** | 🟠 | StormHunter FAB se sale del viewport por la derecha en móvil (clipping). | Mobile, `/`. | Posicionado `right-4` en mobile pero el contenedor está dentro de `<main>` con `overflow-hidden` y aside lateral. Verificar `right` en lugar de `lg:right-[26rem]`. | `src/components/map/storm-hunter.tsx`. |
| **B8** | 🟡 | Outdoor mode + Theme toggle en header mobile se ven con iconos solapados con el input de búsqueda. | Mobile, todas. | Mismo origen que B1: el grupo derecho del header no tiene espacio. | `header.tsx`. |

#### C. Navegación

| ID | Sev | Síntoma | Donde | Causa raíz | Acción |
|----|-----|---------|-------|------------|--------|
| **C1** | 🟠 | Bottom-nav tiene 4 items (Mapa / Panel / Pro / Más). Falta entrada explícita para **Comparador**. La ruta solo es alcanzable desde header desktop. | Mobile. | 4-tabs decisión Phase 2; Comparar quedó fuera. | Reestructurar bottom-nav a 5 tabs: Mapa · Panel · Comparar · Pro · Más. O sustituir "Más" por "Comparar" y mover ajustes al sidebar. |
| **C2** | 🟠 | Sidebar contiene controles del MAPA (capas, modelo, ubicación) que NO tienen sentido en `/dashboard`, `/comparador`, `/sobre`, etc. — pero la sidebar se renderiza en TODAS las rutas que la importan. | Todas las rutas con `<Sidebar />`. | `Sidebar.tsx` no inspecciona `pathname`. | Hacer que la sidebar muestre una sección distinta por ruta: en `/` capas+modelo; en `/dashboard` favoritos+ajustes; en `/comparador` historial; en `/sobre`/`/precios`/`/legal/*` ocultar la sidebar y dejar solo header+footer. |
| **C3** | 🟠 | Header desktop: rutas `/landing`, `/sobre`, `/precios`, `/ciudades`, `/alerts`, `/climate` NO están en la nav principal — solo accesibles vía footer o tipeando URL. | Desktop. | Nav inline en `header.tsx` solo con 4 enlaces. | Añadir un menú "Más ▾" en desktop (posición a la derecha del Pro accent) con submenu de páginas secundarias. En mobile, esas mismas rutas vivirán en el tab "Más". |
| **C4** | 🟡 | El X de cerrar sidebar en `header.tsx` aparece pegado al wordmark sin separación; en mobile además se ve como botón "huérfano" al inicio del header. | Mobile. | Sin `border-r` separador entre toggle y logo. | Añadir un `<span>` divisor o margen visible. |
| **C5** | 🟡 | No hay "skip to content" link para teclado / a11y. | Todas. | – | Añadir `<a href="#main">Saltar al contenido</a>` al inicio de `<body>` (visualmente oculto, visible al focus). |
| **C6** | 🟡 | El badge `📍 Madrid, España` del header desktop es decorativo (no clicable) y duplica el indicador de ubicación que ya hay en el sidebar/widgets. Conviene convertirlo en botón → abre modal de cambio de ubicación o lleva a `/location/[slug]`. | Desktop. | `<div>` no `<button>`. | Convertir a `<Link>`/`<button>`. |

#### D. Paridad de funcionalidades web ↔ móvil

> Regla **inviolable**: cada feature debe ser accesible y usable en ambos breakpoints. Si una columna está vacía, abrir TODO.

| Funcionalidad | Desktop | Mobile | Acción |
|---------------|---------|--------|--------|
| Cambio de capa meteorológica | ✅ Sidebar siempre visible | ⚠️ Sólo via sidebar overlay | OK tras arreglar B2/C2. Añadir además gesto: doble-tap en chip de capa para fijar. |
| Time-slider (forecastHourOffset) | ✅ Sticky bottom | ⚠️ Visible pero estrecho, controles play/pause se cortan en pantallas <380px | Hacer el time-slider un drawer secundario o mover controles a esquinas. |
| Multi-modelo selector | ✅ Sidebar | ⚠️ Sidebar overlay | OK. |
| Comparador de ciudades | ✅ Grid 4 columnas | ❌ Cards no se renderizan en móvil (skeleton infinito hasta scroll) | Verificar `useQueries` enabled en SSR y forzar refetch onMount. Layout: snap-x carrusel obligatorio <md. |
| Caza-tormentas (StormHunter) | ✅ FAB con label | ⚠️ FAB se sale por la derecha (B7) | Reposicionar y dejar el banner top centrado siempre visible. |
| Outdoor mode | ✅ Toggle en header | ⚠️ Toggle en header pero icono solapado (B8) | Mover a sidebar / drawer de ajustes en mobile. |
| Theme toggle | ✅ Header | ⚠️ Header pero solapado | Misma acción que outdoor. |
| Búsqueda de ubicación | ✅ Header con autocomplete | ❌ Solapado por el wordmark (B1) | Rediseñar header móvil: search como segunda fila o trigger que despliegue overlay full-width. |
| Favoritos | ✅ Star en header + sidebar | ⚠️ Star visible pero sidebar persistente | Igual que C2. |
| AI Chat | ✅ FAB | ⚠️ FAB tapa "Más" (B4) | Reposicionar `bottom: calc(64px + 16px + env(safe-area-inset-bottom))` cuando hay bottom-nav. |
| PWA install | ✅ Banner discreto | ⚠️ Banner del navegador (Chrome) duplica info | Detectar `beforeinstallprompt` y suprimir nuestro banner si Chrome ya lo muestra. |
| PrecipNow / Outfit / SunArc | ✅ Visible en widget panel | ⚠️ Visible en drawer "Ahora" pero PrecipNow sin sparkline (A8) | Fix A8. |
| Mapa interactivo | ✅ Fullscreen | ⚠️ Fullscreen pero sidebar tapa (B2) | Fix B2. |
| Spaghetti chart (`/pro`) | ✅ Visible | ❓ No comprobado en mobile (faltan capturas) | Auditar y asegurar scroll horizontal de la gráfica. |
| Hub `/ciudades` | ✅ Pill-nav países | ❓ Verificar si pill-nav stickea en mobile | Audit pendiente. |

### 7.1 Plan de remediación (TODOs)

> Cada TODO se inserta en SQLite (`todos`) al ejecutar la fase. IDs kebab-case, descripciones autocontenidas.

**Sprint 7A — Stop-the-bleeding (defectos 🔴 visibles al primer paint):**
- [ ] `t7-light-theme-tokens` — Sustituir TODO uso de `text-white/XX`, `bg-gray-950/XX` y `border-white/XX` en `app/**/page.tsx` y componentes layout por tokens semánticos (`text-foreground`, `text-muted-foreground`, `bg-background`, `bg-card`, `border-border`). Definir variantes light de los tokens en `globals.css`. Resuelve A1, A2, A4, A9, A10.
- [ ] `t7-sidebar-default-closed` — En `weather-store.ts:65`, cambiar `sidebarOpen: true → false`. Añadir hidratación que abra la sidebar automáticamente sólo si `window.matchMedia('(min-width: 1024px)').matches` y la ruta está en `MAP_ROUTES`. Resuelve B2.
- [ ] `t7-header-mobile-redesign` — Rediseñar `header.tsx` para mobile: una sola fila con `[Toggle][Logo↔]` a la izquierda y `[Search⤢][Star][Theme][Outdoor]` a la derecha. La búsqueda en mobile es un `<button>` con icono de lupa que abre un overlay full-screen con input + lista de sugerencias. Resuelve B1, B8, C4. Añadir `min-w-0 flex-1` al wrapper del wordmark y `hidden xs:inline` al texto "AetherCast".
- [ ] `t7-fab-stacking` — Definir variable CSS `--bottom-nav-h: 64px` e introducir clase `.fab-above-nav { bottom: calc(var(--bottom-nav-h) + 1rem + env(safe-area-inset-bottom)); }`. Aplicar a AI chat FAB y a controles maplibre (`Geolocate`, `Zoom`). Resuelve B4, B5.
- [ ] `t7-stormhunter-position` — En `storm-hunter.tsx`, usar `right-4` en mobile + `lg:right-[26rem]` en desktop, asegurando que su contenedor padre permita `position: fixed` o `position: absolute` sin overflow clipping. Resuelve B7.

**Sprint 7B — Navegación coherente:**
- [ ] `t7-context-aware-sidebar` — En `sidebar.tsx`, leer `usePathname()`. Definir `MAP_ROUTES = ['/']`, `DATA_ROUTES = ['/dashboard','/comparador','/pro','/climate','/alerts']`, `INFO_ROUTES = ['/sobre','/precios','/landing','/legal/*','/ciudades']`. En INFO_ROUTES no renderizar la sidebar. En DATA_ROUTES mostrar favoritos + ajustes. En MAP_ROUTES capas + modelo. Resuelve C2.
- [ ] `t7-header-more-menu` — Añadir dropdown "Más ▾" en `header.tsx` con submenu desktop: Ciudades / Alertas / Clima / Precios / Sobre. Implementar con shadcn `DropdownMenu` o `Popover`. Resuelve C3.
- [ ] `t7-bottom-nav-comparar` — Modificar `mobile-bottom-nav.tsx` a 5 tabs: Mapa · Panel · **Comparar** · Pro · Más. El tab "Más" abre un sheet con: Ciudades / Alertas / Clima / Sobre / Precios / Theme / Outdoor / Idioma. Resuelve C1.
- [ ] `t7-skip-to-content` — Añadir link "Saltar al contenido" al inicio del body (clase `sr-only focus:not-sr-only ...`). Resuelve C5.
- [ ] `t7-location-badge-clickable` — Convertir el badge `📍 {locationName}` del header en `<button>` que abre el modal de búsqueda. Resuelve C6.

**Sprint 7C — Datos / widgets / parity:**
- [ ] `t7-comparador-mobile-layout` — Verificar y forzar carrusel `flex snap-x snap-mandatory` con cards `w-[78vw] shrink-0` <md. Validar `useQueries` enabled de inicio para las 3 ciudades por defecto (Barcelona, Valencia). Si SSR no hidrata, forzar `refetchOnMount: 'always'`. Cubre paridad row "Comparador".
- [ ] `t7-overlay-yellow-fallback` — En `weather-overlay.tsx`, identificar el path donde el overlay de temperatura cae a un color sólido en `/pro` y reemplazarlo por: skeleton de mapa + toast "Sin datos en esta capa para esta vista". Resuelve A6.
- [ ] `t7-humidity-widget-resize` — Aplicar el mismo patrón `useMounted + height numérico` que se usa en otros widgets de Recharts al `HumidityWidget`. Resuelve A7.
- [ ] `t7-precip-now-svg-resize` — En `precip-now.tsx` reservar ancho fijo (e.g. `w-[280px]`) o usar `ResizeObserver` antes de pintar las barras. Resuelve A8.
- [ ] `t7-pwa-banner-dedupe` — Detectar si Chrome ha mostrado su nativo (no hay forma 100%, pero podemos chequear `getInstalledRelatedApps()` y/o suprimir nuestro banner los primeros 5s tras el `beforeinstallprompt`). Reduce ruido B6.

**Sprint 7D — Pulido y verificación dual:**
- [ ] `t7-time-slider-mobile` — Rediseñar para pantallas <380px: play/pause como botón circular único + slider full-width debajo. O integrarlo en el drawer con su propio handle.
- [ ] `t7-gradient-text-light-variant` — Añadir variantes `.text-gradient-aurora-on-light` y `.text-gradient-sky-on-light` en `globals.css` con stops legibles, y aplicar la utility correcta según `dark`/`light` (Tailwind v4 `@variant`). Resuelve A3.
- [ ] `t7-landing-phone-preview` — Reemplazar el mockup vacío por un `<Image>` estático (PNG en `public/landing/phone.png`) o un componente real con datos demo precomputados (no fetch). Resuelve A5.
- [ ] `t7-route-tour-playwright` — Añadir un test Playwright que recorra todas las rutas en 3 viewports (390, 768, 1440) y verifique: (a) ningún elemento tiene `color === backgroundColor`, (b) bottom-nav siempre visible en <md, (c) sidebar inicialmente cerrada en <md, (d) ningún FAB pisa el bottom-nav (bounding-box no overlap).
- [ ] `t7-shots-folder-gitignore` — Añadir `.shots/` a `.gitignore`.

### 7.2 Criterio de aceptación de Fase 7

Una vez completados los 4 sprints:

1. **Modo claro y oscuro ambos legibles**: en cada ruta del array de tour, ningún `<p>`, `<h*>`, `<a>` ni `<button>` tiene contraste calculado <4.5:1.
2. **Header móvil sin solapamientos**: `boundingClientRect` del logo, search trigger y botones del header no se intersectan en viewports 360, 390, 412, 430.
3. **Sidebar cerrada al primer paint en mobile** y abierta en desktop ≥1024px sólo en rutas de mapa/datos.
4. **Bottom-nav presente en TODAS las rutas mobile**, con 5 tabs incluyendo Comparar, sin FAB ni control de mapa por encima.
5. **Tabla de paridad sección 7.0.D**: todas las celdas en ✅. Cada feature accesible en ambos breakpoints en ≤2 taps/clicks.
6. **Lighthouse mobile en `/`, `/dashboard`, `/comparador`, `/pro`, `/landing`, `/sobre`**: Performance ≥90, Accessibility = 100, Best Practices ≥95.
7. **Test Playwright `t7-route-tour-playwright` pasando**.
8. **`pnpm build` limpio** y captura comparativa antes/después en `.shots/before-after/`.

### 7.3 Cómo reproducir el entorno de auditoría

```powershell
# Dev server (importante: NO usar turbopack por el bug edge-runtime + output:'export')
npx next dev --port 3000

# Edge en modo debug (perfil aislado para evitar el welcome flow)
$env:TEMP\edge-debug-profile lo crea en %TEMP%
Start-Process msedge.exe -ArgumentList @(
  '--remote-debugging-port=9222',
  "--user-data-dir=$env:TEMP\edge-debug-profile",
  'about:blank'
)

# Emulador Android + reverse del puerto del host
Start-Process emulator.exe -ArgumentList @('-avd','Pixel_7_API_34_RosaFinanzas')
adb wait-for-device
adb reverse tcp:3000 tcp:3000
```

Capturas:
- Edge: usar `edge-devtools-take_screenshot` (MCP) en `pageIndex:1`.
- Emulador: usar `mobile-mcp-mobile_save_screenshot` con `saveTo` dentro del repo (`.shots/mobile/...`) — el MCP no permite paths fuera del cwd.

---

# 🌩️ AetherCast — Roadmap original de 6 Fases (histórico)

> **Generado**: 2026-04-24 tras auditoría en vivo de https://tiempo-meteorologia.pages.dev/ con Edge DevTools MCP
> **Objetivo**: Convertir AetherCast en la mejor web de meteorología en español, superando a Windy, Ventusky, Meteoblue y AccuWeather en UX mobile, SEO y rendimiento.
> **Premisa**: 70% del tráfico es mobile → todo se diseña primero para 360–430 px y luego se escala.

---

## ✅ Fase 7 — UI/UX parity Web ↔ Mobile (COMPLETADA · 2026-04-24)

| Cambio | Detalle |
|--------|---------|
| **Hoist `<Header />` + `<MobileBottomNav />` a root layout** | `src/app/layout.tsx` ahora monta header global + bottom-nav dentro de `<Providers>`. Eliminadas 16 referencias inline (`<Header/>`, `<MobileBottomNav/>` + imports) en 8 páginas: `/`, `/dashboard`, `/comparador`, `/pro`, `/sobre`, `/ciudades`, `/climate`, `/alerts`, `/map`. **Garantiza paridad funcional** entre todas las rutas en desktop y mobile sin código duplicado. |
| **MobileBottomNav 5-tabs robusto** | Reescrito con `display: grid; gridTemplateColumns: 'repeat(5, minmax(0, 1fr))'` inline (a prueba de purgas Tailwind). Tabs: Mapa · Panel · Comparar · Pro · Más. Establece CSS var `--bottom-nav-h` que cascada a hijos. |
| **CSS var `--bottom-nav-h`** | Definida en `globals.css` como `0px` por defecto, `calc(56px + env(safe-area-inset-bottom))` en `<768px`. Usada por `widget-panel`, `pwa-install`, `ai/chat`, `storm-hunter` para evitar solapamiento con bottom-nav en mobile. |
| **Drawer offset above bottom-nav** | `Drawer.Content` en `widget-panel.tsx` con `style={{ bottom: 'var(--bottom-nav-h, 0px)', height: 'calc(92dvh - var(--bottom-nav-h, 0px))' }}`. Antes: el drawer cubría el bottom-nav y bloqueaba navegación. |
| **Header restructure mobile-first** | `src/components/layout/header.tsx`: search inline en desktop / sheet full-screen en mobile, dropdown "Más" para nav secundaria, toggle sidebar gated por `usePathname()` a MAP_ROUTES (`['/']`) — antes aparecía en rutas sin mapa y rompía layout. |
| **Sidebar gated** | `src/components/layout/sidebar.tsx` retorna `null` fuera de MAP_ROUTES. Estado `sidebarOpen` default → `false` en `weather-store.ts` (antes el drawer se abría tapando hero). `app/page.tsx` lo abre via `useEffect` solo en desktop (`window.matchMedia('(min-width: 1024px)').matches`). |
| **AIChat parity** | FAB + panel con offsets responsive: `bottom: calc(var(--bottom-nav-h, 0px) + 1rem)`, `right-3 left-3 sm:right-6 sm:left-auto sm:w-96`. Pendiente Fase 8: hoist a root layout para aparecer también en `/dashboard /comparador /pro` (actualmente solo `/` y `/landing`). |
| **StormHunter fixed positioning** | `src/components/map/storm-hunter.tsx` con `fixed` + safe-area-aware top calc para no chocar con header/sidebar/AI chat. |
| **Dark-only enforcement** | `<html className="dark" style={{ colorScheme: 'dark' }}>` SSR fijo. **Eliminado** `ThemeProvider` (next-themes 0.4.6 rompía hidratación en mobile). **Eliminadas** ~120 líneas de overrides `html:not(.dark)` con `!important` en `globals.css` que provocaban flash blanco permanente cuando faltaba `.dark` por un instante. App es dark-only hasta Fase 8 (re-tokenización con CSS vars semánticas). |
| **PWA banner offset** | `src/components/layout/pwa-install.tsx`: `bottom: calc(var(--bottom-nav-h, 0px) + 0.75rem)`. |

**⚠️ Lecciones críticas (consultar antes de Fase 8):**
- **Turbopack en Next 16.2.4 NO compila clases arbitrarias de Tailwind v4** (`bg-[#0b1020]`, `grid-cols-5`, etc.) — el CSS final no contiene esas reglas. Para dev SIEMPRE usar `npx next dev --webpack`. Production build (webpack por defecto) funciona perfecto. Reevaluar al actualizar Next/Turbopack.
- **Next 16 App Router rechaza `<script dangerouslySetInnerHTML>` dentro de `<head>`** — error "Scripts inside React components are never executed". Si necesitas script pre-hydration, usar `next/script` con `strategy="beforeInteractive"`.
- **next-themes 0.4.6 + mobile** rompe hidratación incluso con `forcedTheme`. Si en Fase 8 se reintroduce light theme, gestionarlo con CSS vars + media query `prefers-color-scheme`, NO con next-themes.
- **`html:not(.dark) { ... !important }` es un footgun** — un solo render sin `.dark` deja la UI en blanco permanente. Cualquier override de tema debe ir bajo selectores que coexistan, no que se excluyan.
- **Validación mobile**: Chrome 113 del emulador Android estándar es demasiado antiguo para Tailwind v4 (oklch, color-mix, @property). Usar **Edge mobile-emulation** vía CDP (`Emulation.setDeviceMetricsOverride` + UA Pixel 7) como fuente primaria de validación mobile. Patrón en `.shots/mobile-emulate.js` (ignored).
- **Hoisting layout vs duplicación**: Header/MobileBottomNav en root layout es la única forma de garantizar paridad sin drift entre rutas. Si una ruta necesita ocultarlos, hacerlo con `usePathname()` desde el propio componente, no quitándolos de la página.

**Validaciones ejecutadas:**
- `pnpm type-check` ✅ 0 errores
- `pnpm lint` ✅ baseline preservada (4 errores pre-existentes Phase 1-4, 0 nuevos)
- `pnpm build` ✅ webpack, 46s compile, 180 páginas estáticas
- Tour Edge mobile-emulation Pixel 7 (412×915) ✅ `/`, `/dashboard`, `/comparador`, `/pro`, `/sobre`: header global + bottom-nav 5 tabs + dark theme + drawer no solapa nav.

**Pendiente Fase 8 (post-parity):**
- Re-tokenizar con CSS vars semánticas (`--bg-base`, `--bg-surface`, `--fg-primary`...) para soporte light theme sin `:not(.dark)`.
- Hoist `<AIChat />` a root layout para aparecer en todas las rutas.
- Actualizar Next/Tailwind cuando Turbopack soporte clases arbitrarias v4 → eliminar flag `--webpack` de scripts dev.

---

## ✅ Fase 6 — Performance & Observabilidad (COMPLETADA · 2026-04-24)

| Cambio | Detalle |
|--------|---------|
| **Lazy chart widgets (recharts aislado)** | Nuevo `src/components/widgets/lazy.tsx` reexporta los 7 widgets que dependen de recharts vía `next/dynamic({ ssr:false, loading: ChartSkeleton })`: `HourlyChartWidget`, `WindChartWidget`, `PressureChartWidget`, `MeteogramWidget`, `HumidityWidget`, `ModelComparisonWidget`, `ClimateHistoryWidget`. **Crítico**: estos widgets **fueron eliminados del barrel `widgets/index.ts`** porque la re-exportación eager hacía que webpack los metiera en el chunk principal pese al `dynamic()`. Cualquier nuevo widget con recharts debe ir solo a `lazy.tsx`. Resultado: chunk recharts **646 KB → 276 KB** y aislado como chunk async (`5958.*.js`). |
| **`ChartSkeleton`** | `src/components/ui/chart-skeleton.tsx`. Shimmer CSS puro (sin librerías), `contentVisibility:auto` para skip de render off-screen, altura/label configurables. Loading state unificado para todos los widgets de gráfica. |
| **Bundle analyzer** | `@next/bundle-analyzer` envuelve `next.config.ts` (activo con `ANALYZE=true`). Script `pnpm analyze` (usa `cross-env`) genera reportes interactivos en `.next/analyze/*.html`. `optimizePackageImports` añade `date-fns`. |
| **Service Worker v4** | `public/sw.js` reescrito con 4 estrategias separadas: **SHELL** (HTML, network-first con timeout 3 s → fallback cache → `/offline` → `/`), **STATIC** (assets `_next/static/*`, cache-first), **API** (Open-Meteo, SWR + freshness stamp `x-aether-cached-at`, considera fresco <5 min para skip-network), **TILES** (RainViewer/Carto, cache-first con LRU trim a 250 entradas). Listener de mensaje `SKIP_WAITING` para upgrade UX. SHELL_URLS incluye `/offline` y `/og.png`. |
| **`/offline` page** | `src/app/offline/page.tsx` — fallback estático para fallos de navegación bajo SW. `noindex`, retorna a `/` con CTA. |
| **CloudflareAnalytics beacon** | `src/components/analytics/cloudflare.tsx` — script CF Web Analytics (privacy-first, sin cookies), gate con `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (no-op si vacío). Montado en `layout.tsx` tras `<WebVitalsReporter />`. |
| **Resource hints** | `layout.tsx` añade 6 `<link rel="preconnect">` (`api.open-meteo.com`, `geocoding-api.open-meteo.com`, `air-quality-api.open-meteo.com`, `marine-api.open-meteo.com`, `basemaps.cartocdn.com`, `tilecache.rainviewer.com`) + 2 `dns-prefetch`. Acelera el primer fetch de datos y tiles. |
| **Lighthouse CI** | `lighthouserc.json` con preset desktop, 5 URLs (`/`, `/ciudades`, `/location/madrid`, `/comparador`, `/sobre`). Presupuestos: perf ≥0.85, a11y ≥0.95, best-practices ≥0.9, SEO ≥0.95. Métricas: LCP ≤2500 ms, CLS ≤0.1, TBT ≤300 ms. Ejecutado por `treosh/lighthouse-ci-action@v12` en el workflow CI existente sobre la URL en producción. |
| **content-visibility** | `/ciudades` aplica `[content-visibility:auto] [contain-intrinsic-size:1px_500px]` a cada `<section>` por país — el navegador omite layout/paint de secciones fuera de viewport. Mejora TBT y FCP en hub con 160+ ciudades. |

**Validaciones ejecutadas:**
- `pnpm type-check` ✅ 0 errores
- `pnpm build` ✅ Compila limpio. 179 páginas estáticas. **Top chunks**: `8dd50394` (1006 KB, maplibre+framer — esperado), `5958` (276 KB, recharts aislado ↓ desde 646 KB), `20` (217 KB, framer), `2176` (202 KB), `d8ed9c07` (195 KB), `framework` (185 KB), `main` (128 KB). Recharts ya **no** carga en la ruta `/` ni en `widget-panel`.
- Análisis de bundle reproducible con `pnpm analyze`.

**⚠️ Lecciones aprendidas:**
- **Los re-exports en barrels derrotan el code-splitting**: `next/dynamic()` no salva si el módulo dinámico está re-exportado eagerly desde un `index.ts` que el consumidor importa. Webpack ve el grafo estático del barrel y mete todo en el mismo chunk. Solución: el módulo dinámico **solo** debe ser accesible vía un path que NO esté en ningún barrel eager.
- `optimizePackageImports` (Next config) **solo aplica a paquetes npm**, no a paths del proyecto (`@/components/*`). Para tree-shaking de barrels propios, hay que partir el barrel manualmente.
- SW SWR sin freshness stamping degrada UX (responde con datos viejos antes de saber su edad). Escribir `x-aether-cached-at` al cachear y leerlo al servir resuelve el problema sin depender del header `Date`.

---

## ✅ Fase 5 — SEO & Indexación profesional (COMPLETADA · 2026-04-24)

| Cambio | Detalle |
|--------|---------|
| **MAJOR_CITIES 20 → 160+** | `src/lib/seo/constants.ts` ampliado con todas las capitales provinciales españolas (67) + LATAM (México 9, Argentina 7, Colombia 5, Perú 3, Chile 3 + Venezuela/Ecuador/Bolivia/Paraguay/Uruguay/Costa Rica/Panamá/Cuba/Dominicana/PR) + Europa 25 + Norteamérica 11 + Asia 12 + África 5 + Oceanía 3. Nuevas exportaciones `CITIES_BY_COUNTRY` y `CITY_COUNTRIES` (España fija primero, resto alfabético). **Slugs renombrados**: `tenerife → santa-cruz-de-tenerife`, `mexico-df → ciudad-de-mexico` (redirects 301 en `_redirects`). |
| **`/ciudades` hub page** | SSR en `src/app/ciudades/page.tsx`. Pill-nav superior con anclas por país (`#espana`, `#mexico`...), secciones ordenadas por población dentro de cada país, formato `Intl.NumberFormat` para población. JSON-LD: `breadcrumb` + `ItemList` (160+ items) + `FAQ`. Linkado desde footer "Ver todas →". |
| **Sitemap split (index + 2 niños)** | `src/app/sitemap.ts` usa `generateSitemaps()` retornando `[{id:'pages'},{id:'cities'}]`. Next 16 emite automáticamente `/sitemap.xml` (índice) + `/sitemap/pages.xml` + `/sitemap/cities.xml`. Prioridad dinámica por ciudad (0.85 si pop>1M, 0.75 resto). El `pages` sitemap añade `/ciudades`, `/comparador` y anclas por país. |
| **JSON-LD enriquecido** | `weatherDataFeedJsonLd()` (Schema.org `DataFeed` con `Observation`/`PropertyValue` por día — unitCode CEL/MMT/KMH/HPA/P1), `faqJsonLd()` + tipo `FaqItem`, `itemListJsonLd()`. `placeWeatherJsonLd` enriquecido con `additionalProperty` (currentTemp, apparentTemp, humidity, windSpeed, pressure, cloudCover) en cada `/location/[slug]`. |
| **FAQ visible + estructurado** | Nueva librería `src/lib/seo/faqs.ts` con `HOME_FAQS` (6 Qs) + `locationFaqs(name)` (4 Qs por ciudad). Renderizado visible con `<details>` accesibles + JSON-LD FAQPage en `/sobre`, `/ciudades`, y cada `/location/[slug]`. |
| **Hreflang correcto** | `src/app/layout.tsx` reemplaza el `en-US` falso por locales españolas reales: `es-ES`, `es-MX`, `es-AR`, `es-CO`, `es-CL`, `es-419`, `x-default`. |
| **Robots.txt extendido** | `src/app/robots.ts`: 12+ user-agents explícitos. Permite bots de búsqueda (Googlebot, Bingbot, Slurp, DuckDuckBot, YandexBot, Baidu, Applebot) **y bots de IA opt-in** (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, CCBot). Bloquea scrapers SEO agresivos (AhrefsBot, SemrushBot, MJ12bot, DotBot). Sitemap referenciado como array de 3 URLs. |
| **OG static + branded** | `scripts/generate-og.mjs` genera `public/og.png` (1200×630) con sharp a partir de SVG inline (aurora gradient + grid + brand mark + headline + 5 model pills). Reemplaza `next/og ImageResponse` que es **incompatible con `output:'export'`** en Next 16 (problema con `Geist-Regular.ttf.bin`). Redirect `/opengraph-image → /og.png` para legacy. |
| **Web Vitals reporter** | `src/components/analytics/web-vitals.tsx` (client) usa `useReportWebVitals` de `next/web-vitals`. En dev → `console.log`. En prod → beacon a `NEXT_PUBLIC_VITALS_ENDPOINT` si está definido (Cloudflare Worker / Plausible / Umami). Sin endpoint → no-op (compatible con static export). |

**Validaciones ejecutadas:**
- `pnpm type-check` ✅ 0 errores
- `pnpm lint` ✅ misma baseline (4 errores pre-existentes Phase 1-4, 0 nuevos)
- `pnpm build` ✅ Compila en 17s. 179 páginas estáticas (160 location + hub ciudades + sitemap split). `/sitemap/pages.xml` y `/sitemap/cities.xml` emitidos correctamente.

**⚠️ Lecciones aprendidas:**
- `next/og` ImageResponse **NO funciona con `output:'export'`** en Next 16 (webpack/turbopack no parsean `.ttf.bin`). Usar SVG → PNG con sharp en build script.
- En PowerShell, `Remove-Item src\app\location\[slug]\file.tsx` falla silenciosamente — `[slug]` es wildcard. Usar `-LiteralPath`.
- `/api/vitals` no se puede crear como edge route con static export — usar endpoint externo configurable.

---

## ✅ Fase 4 — Funcionalidades Killer (COMPLETADA · 2026-04-24)

| Cambio | Detalle |
|--------|---------|
| **PrecipNow™ (nowcasting 2 h)** | Widget en pestaña "Ahora" que consume `minutely_15` de Open-Meteo (nuevo en `lib/weather/api.ts`: `minutely_15='precipitation,precipitation_probability'` + `forecast_minutely_15='24'`). Sparkline SVG 280×60 con 8 buckets de 15 min, gradient bars, 3 tonos (dry/soon/now) y headline contextual: "Sin precipitación esperada", "Lluvia en ~Xmin", "Está lloviendo ahora". Renderiza `null` si la lat/lon no devuelve datos minutely. |
| **OutfitRecommender** | Widget _"¿Qué me pongo?"_ basado en reglas (`recommend()` en `outfit-recommender.tsx`). 7 brackets de temperatura sobre la sensación térmica media de las próximas 6 h + tips capa-a-capa según lluvia máx, viento máx y UV máx. Devuelve `{emoji, title, description, tips[]}` sin necesidad de IA. |
| **Comparador de ciudades** (`/comparador`) | Hasta 4 ciudades en paralelo con `useQueries`. Mobile: `flex snap-x` carrusel (78vw cards). Desktop: `grid` con `gridTemplateColumns: repeat(N, minmax(0,1fr))` dinámico. CityCard muestra WeatherIcon + temp + máx/mín + 6 stats (sensación, viento, humedad, lluvia, UV, prob). CityPicker modal con búsqueda en vivo + sugerencias desde `MAJOR_CITIES`. SSR con metadata + JsonLd WebApplication. |
| **AI Workers REST** (`/api/ai/chat`) | Edge route que llama a Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`) vía REST con `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_AI_TOKEN`. SYSTEM_PROMPT en español (máx 4 frases, 1-2 emojis), `buildContext` serializa `CurrentWeather`. Fallback automático a `generateAIResponse` rule-based si faltan envs o falla la API. Chat añade badge `✨ Llama 3.1 · Workers AI` cuando `source === 'workers-ai'`. |
| **StormHunter mode** | Botón flotante (`top-20 right-4 lg:top-4 lg:right-[26rem]`) con icono Zap + glow violeta. `toggleStormHunter()` en el store activa simultáneamente las capas `cape`, `wind_gusts` y `precipitation`. Banner top-center con punto amarillo pulsante (`wi-flash`) cuando está activo. Persistido en localStorage. |
| **Header nav** | Nuevo enlace "Comparar" (icono `GitCompare`) entre Dashboard y Pro. |

**Pendientes deferred a futuras iteraciones:**
- Push notifications de alertas (Web Push + VAPID)
- Embed iframe `<iframe src="/embed/madrid">` para terceros
- Public API REST con rate-limit (Cloudflare Workers + KV)
- AEMET official alerts feed (CAP XML)
- Blitzortung WebSocket para markers de rayos en tiempo real

**Validaciones**:
- `pnpm type-check` ✅
- `pnpm lint` ✅ (4 errores baseline, sin nuevos)
- `pnpm build` ✅ (37 páginas, `/comparador` static, `/api/ai/chat` edge)
- Smoke test Edge MCP ✅ (PrecipNow render, Outfit chip "Fresco · Chaqueta ligera", StormHunter activa 3 capas + banner, /comparador 3 cities side-by-side)

---

## ✅ Fase 3 — UI/UX Polish & Branding (COMPLETADA · 2026-04-24)

| Cambio | Detalle |
|--------|---------|
| **WeatherIcon SVG animado** | Componente `<WeatherIcon code isDay size animated />` con 12 _kinds_ (clear, mostlyClear, partlyCloudy, cloudy, fog, drizzle, rain, heavyRain, freezingRain, snow, sleet, thunderstorm). Día/noche (Sun/Moon). Animaciones SMIL+CSS: sol gira (`wi-spin 22s`), gotas caen (`wi-fall`), copos rotan (`wi-snow`), rayo parpadea (`wi-flash`). Memoized. Reemplaza emoji `getWeatherIcon` en `current-weather`, `daily-forecast`, `hourly-detail`, `location/[slug]` |
| **AuroraBackground dinámico** | Gradiente reactivo a `weather_code` + `is_day` vía CSS vars (`--aurora-from/to/glow/accent`) con transición 1500ms. 8 paletas (clear día/noche, partly, cloudy, fog, rain, snow, storm). Cableado en `app/page.tsx` detrás del mapa |
| **SunArc widget** | Rewrite total de `sunrise-sunset.tsx`: arco SVG (240×100, half-circle 20,90→220,90, apex 120,20), sol interpolado por `now`/`sunrise`/`sunset`, `setInterval` 60s, gradient stroke, 3 pills (Amanece/Anochece/UV) con color por nivel UV |
| **BrandLoader** | Spinner _aether ring_ con gradiente sky→indigo→violet + core pulsante. Usado como fallback de `next/dynamic` para el mapa |
| **EmptyState** | Componente reutilizable ilustrado (icono gradient sky→blue + título + descripción + acción opcional). Aplicado en Sidebar favoritos vacíos |
| **WMO color tokens** | Paleta científica en `:root`: `--wmo-temp-{frigid,cold,cool,mild,warm,hot,extreme}`, `--wmo-wind-{calm,light,moderate,strong,gale,storm}`, `--wmo-precip-{none,light,moderate,heavy,extreme}` |
| **Keyframes globales** | `wi-spin`, `wi-fall`, `wi-snow`, `wi-flash`, `aether-ring`, `aether-pulse` en `@layer utilities`. Clase `.bg-aurora-dynamic` con stack de 2 radial-gradients + 1 linear, transición 1500ms |
| **useMediaQuery hook** | Hook reactivo SSR-safe con `matchMedia`. Reemplaza la guarda CSS `lg:hidden` en `WidgetPanel` (vaul `Drawer.Portal` se monta en `<body>` y escapa la clase, lo que dejaba el drawer visible en desktop) |

**Validaciones**:
- `pnpm type-check` ✅
- `pnpm lint` ✅ baseline preservada (4 errores pre-existentes)
- `pnpm build` ✅ 36 páginas, build OK
- Edge DevTools MCP @ 1912×948 → solo aside desktop visible, SunArc renderiza con sol cerca del atardecer, AuroraBackground oscuro nocturno, no errores nuevos

**Aprendizajes técnicos**:
- Tailwind v4: animaciones custom mejor declaradas como `[animation:wi-spin_22s_linear_infinite]` arbitrary que como utilities en config (cero fricción)
- `prefers-reduced-motion`: ya hay regla global que pone `animation-duration: 0.01ms` — cubre todas las animaciones nuevas sin código por componente
- vaul `Drawer.Portal` → renderiza en `document.body`. CSS `lg:hidden` en wrapper **NO** lo oculta. Solución: gate con JS (`useMediaQuery('(min-width:1024px)')`) y renderizar condicional
- SVG arc geometry: `M 20 90 A 100 80 0 0 1 220 90` produce semicírculo elegante. Para posicionar sol: `angle = π·(1-progress)`, `x = 120 + 100·cos`, `y = 90 - 80·sin`
- AuroraBackground lee de `useWeatherForecast(selectedLocation)` (TanStack Query cacheado) — sin fetch extra, usa la misma data que widgets

---


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
