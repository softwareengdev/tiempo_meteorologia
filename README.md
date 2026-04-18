# AetherCast 🌤️ - La Mejor Plataforma de Meteorología Web

> La página web de tiempo y meteorología más avanzada del mundo (2026). Mapa interactivo inmersivo, IA explicativa, multi-modelo y +80 capas profesionales.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4.2-38bdf8?logo=tailwindcss)
![MapLibre](https://img.shields.io/badge/MapLibre-GL-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Características Principales

- 🗺️ **Mapa global fullscreen** con animaciones de partículas (viento, precipitación, nieve)
- 📊 **+80 capas meteorológicas** (temperatura, CAPE, shear, geopotencial, radar, rayos, olas, calidad del aire)
- 🔄 **Multi-modelo inteligente** - Selección y blending de ECMWF, ICON, GFS, HRRR
- 🤖 **IA explicativa** - Chat que explica el pronóstico en lenguaje natural
- 📱 **Dashboard personalizable** con widgets arrastrables
- 🔔 **Alertas push inteligentes** + histórico climático
- 📲 **PWA 100% offline**
- ♿ **Accesible** (WCAG AA), responsive y sin anuncios
- 🌍 **Multi-idioma** (español por defecto)

## 🚀 Tech Stack

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | Next.js 15 (App Router) + TypeScript |
| **Estilos** | Tailwind CSS v4 + shadcn/ui + Framer Motion |
| **Mapas** | MapLibre GL JS + WebGL particles |
| **Datos** | Open-Meteo API (principal) |
| **Estado** | TanStack Query + Zustand |
| **Gráficos** | Recharts |
| **Auth** | NextAuth.js v5 |
| **Despliegue** | Vercel |
| **Testing** | Vitest + Playwright |

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   ├── weather/      # Proxy a APIs meteorológicas
│   │   ├── geocoding/    # Búsqueda de ubicaciones
│   │   └── ai/           # Endpoint de IA explicativa
│   ├── dashboard/        # Página principal con mapa + widgets
│   └── location/[slug]/  # SSR por ubicación
├── components/
│   ├── map/              # MapLibre wrapper + layers
│   ├── widgets/          # Hourly, meteogram, radar, etc.
│   ├── layout/           # Header, Sidebar, Footer
│   ├── ai/               # Chat de IA
│   └── ui/               # shadcn components
├── lib/
│   ├── weather/          # Servicios Open-Meteo + blending
│   ├── ai/               # Integración IA
│   ├── stores/           # Zustand stores
│   └── hooks/            # Custom hooks
└── types/                # TypeScript type definitions
```

## 🛠️ Desarrollo

### Requisitos previos
- Node.js 22+
- pnpm 10+

### Instalación

```bash
git clone https://github.com/softwareengdev/tiempo_meteorologia.git
cd tiempo_meteorologia
pnpm install
```

### Variables de entorno

```bash
cp .env.example .env.local
```

### Ejecutar en desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000)

### Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Servidor de desarrollo con Turbopack |
| `pnpm build` | Build de producción |
| `pnpm start` | Servidor de producción |
| `pnpm lint` | Linter ESLint |
| `pnpm format` | Formateo con Prettier |
| `pnpm test` | Tests unitarios con Vitest |
| `pnpm test:e2e` | Tests E2E con Playwright |
| `pnpm type-check` | Verificación de tipos TypeScript |

## 📈 Roadmap

- [x] **Fase 1**: Mapa básico + Open-Meteo + capas core + búsqueda
- [x] **Fase 2**: Capas meteorológicas avanzadas + búsqueda por ubicación
- [x] **Fase 3**: Dashboard personalizable + widgets + gráficos
- [x] **Fase 4**: IA chat + PWA + modo oscuro + notificaciones
- [x] **Fase 5**: Modo Pro + comparativa multi-modelo + alertas

## 🤝 Contribuir

1. Fork el repositorio
2. Crea tu branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT - Usa libremente, pero mantén crédito al proyecto original.

---

**AetherCast** - *La meteorología del futuro, hoy.* 🌍⚡
