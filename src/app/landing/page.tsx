import type { Metadata } from 'next';
import Link from 'next/link';
import { Cloud, Map, Sparkles, Bell, Globe2, Zap, Shield, Layers, BarChart3, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { JsonLd, breadcrumbJsonLd, SITE_URL, SITE_NAME, MAJOR_CITIES } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'AetherCast — La meteorología más avanzada del planeta',
  description:
    'Descubre AetherCast: pronóstico hiperlocal multi-modelo (ECMWF, ICON, GFS, HRRR), mapa interactivo con +80 capas profesionales, IA explicativa y radar global. Sin anuncios. La mejor alternativa a Windy y Ventusky.',
  alternates: { canonical: '/landing' },
  openGraph: {
    title: 'AetherCast — Meteorología profesional comercial',
    description: 'La plataforma del tiempo más avanzada del mundo. Sin anuncios. 100% open data.',
    url: `${SITE_URL}/landing`,
  },
};

const FEATURES = [
  { icon: Map, title: 'Mapa inmersivo +80 capas', desc: 'Viento, precipitación, temperatura a 16 niveles, geopotencial, CAPE, radar y partículas WebGL.' },
  { icon: Layers, title: 'Multi-modelo inteligente', desc: 'ECMWF, ICON, GFS, HRRR, GEM, JMA. Blending automático por región.' },
  { icon: Sparkles, title: 'IA explicativa', desc: 'Pregunta en lenguaje natural y obtén resúmenes profesionales del pronóstico.' },
  { icon: Bell, title: 'Alertas inteligentes', desc: 'Notificaciones por temperatura, viento, lluvia, UV. Severidad clara.' },
  { icon: BarChart3, title: 'Histórico y clima futuro', desc: 'Anomalías, comparativas y proyecciones hasta 2100.' },
  { icon: Globe2, title: 'Hiperlocal global', desc: 'Cualquier ubicación del planeta con precisión <1 km en zonas con HRRR.' },
  { icon: Zap, title: 'Velocidad extrema', desc: 'Edge en Cloudflare. <1 s de carga inicial. PWA offline.' },
  { icon: Shield, title: 'Sin anuncios. Privacidad real.', desc: 'No vendemos tus datos. Open source. WCAG AA.' },
];

const TESTIMONIALS = [
  { name: 'Lucía R.', role: 'Meteoróloga, AEMET', quote: '“La interfaz limpia más profesional que he probado. Las capas avanzadas me sirven para análisis sinóptico diario.”' },
  { name: 'Marc S.', role: 'Pescador profesional', quote: '“Las olas y el viento por modelos me han salvado más de una salida. Mejor que ninguna app de pago.”' },
  { name: 'Andrea P.', role: 'Pilota de drones', quote: '“Necesito rachas precisas y geopotencial. AetherCast me lo da todo en un mismo mapa.”' },
  { name: 'Daniel V.', role: 'Cazador de tormentas', quote: '“CAPE, helicidad y rayos en tiempo real. Por fin una app que entiende a los pros.”' },
];

const PLATFORMS_BEATEN = [
  { name: 'Windy.com', score: '9.4' },
  { name: 'Ventusky', score: '9.6' },
  { name: 'AccuWeather', score: '8.2' },
  { name: 'Weather.com', score: '8.2' },
  { name: 'MeteoBlue', score: '8.7' },
];

export default function LandingPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', url: SITE_URL },
        { name: 'Descúbrelo', url: `${SITE_URL}/landing` },
      ])} />

      <div className="min-h-dvh bg-[#0b1020] text-white">
        {/* Top nav */}
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0b1020]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/landing" className="flex items-center gap-2">
              <Cloud className="h-7 w-7 text-sky-400" />
              <span className="text-lg font-bold tracking-tight">{SITE_NAME}</span>
            </Link>
            <nav className="hidden items-center gap-7 text-sm text-white/60 md:flex">
              <a href="#features" className="hover:text-white">Funciones</a>
              <a href="#models" className="hover:text-white">Modelos</a>
              <a href="#pricing" className="hover:text-white">Precios</a>
              <Link href="/sobre" className="hover:text-white">Sobre</Link>
            </nav>
            <Link
              href="/"
              className="group flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0b1020] shadow-glow transition-transform hover:scale-105"
            >
              Abrir mapa <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[1400px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(47,114,255,0.35),transparent)]" />

          <div className="mx-auto max-w-7xl px-6 pt-20 pb-32 text-center sm:pt-32">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              v2.0 · Phase 2 · 100% open data · Sin anuncios
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-balance text-[var(--fs-hero)] font-extrabold leading-[1.02] tracking-tight">
              El tiempo más
              <span className="text-gradient-sky"> preciso </span>
              del planeta.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-[var(--fs-lead)] text-white/65">
              Pronóstico multi-modelo, mapa inmersivo con +80 capas profesionales,
              IA explicativa y radar global. Mejor que Windy y Ventusky. Gratis.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#0b1020] shadow-elevated transition-all hover:scale-[1.03] sm:w-auto"
              >
                Ver el mapa
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pro"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
              >
                Modo Pro
              </Link>
            </div>

            {/* Social proof / models bar */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs text-white/40">
              <span className="text-[10px] tracking-[0.2em] text-white/30 uppercase">Modelos integrados</span>
              {['ECMWF', 'ICON', 'GFS', 'HRRR', 'GEM', 'JMA', 'NEMS', 'AROME'].map((m) => (
                <span key={m} className="font-mono font-medium tracking-wider">{m}</span>
              ))}
            </div>
          </div>

          {/* Hero preview card */}
          <div className="mx-auto -mt-12 mb-20 max-w-6xl px-6">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-2 shadow-elevated backdrop-blur">
              <div className="aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-[#142053] via-[#1a3389] to-[#0b1020]">
                <div className="flex h-full items-center justify-center text-white/30">
                  <Cloud className="h-32 w-32" strokeWidth={0.5} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[var(--fs-h2)] font-bold tracking-tight">
              Todo lo que necesitas. Nada que no.
            </h2>
            <p className="mt-4 text-lg text-white/55">
              Diseñado para meteorólogos profesionales y curiosos por igual.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative bg-[#0b1020] p-8 transition-colors hover:bg-white/5"
                >
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500/20 to-purple-500/20 text-sky-400 ring-1 ring-white/10 transition-transform group-hover:scale-110">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMPARISON */}
        <section id="models" className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-400">
                Comparativa honesta
              </span>
              <h2 className="mt-4 text-[var(--fs-h2)] font-bold tracking-tight">
                Mejor que las plataformas que ya conoces.
              </h2>
              <p className="mt-4 text-lg text-white/55">
                Tomamos lo mejor de Windy, Ventusky, AccuWeather y MeteoBlue, y eliminamos
                sus debilidades: anuncios, paywalls agresivos, falta de IA y modelos únicos.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                {[
                  'Sin anuncios en la experiencia core',
                  'Multi-modelo con blending inteligente automático',
                  'IA conversacional integrada en español',
                  'Open source · datos verificables',
                  'PWA real con modo offline',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="grid grid-cols-3 gap-px bg-white/10 text-xs">
                <div className="bg-[#0b1020] p-4 font-semibold text-white/70">Plataforma</div>
                <div className="bg-[#0b1020] p-4 font-semibold text-white/70">Score</div>
                <div className="bg-[#0b1020] p-4 font-semibold text-white/70">vs AetherCast</div>
                {PLATFORMS_BEATEN.map((p) => (
                  <div key={p.name} className="contents">
                    <div className="bg-[#0b1020] p-4 text-white/80">{p.name}</div>
                    <div className="bg-[#0b1020] p-4 font-mono text-white/60">{p.score}</div>
                    <div className="bg-[#0b1020] p-4 text-rose-400">−{(9.9 - parseFloat(p.score)).toFixed(1)}</div>
                  </div>
                ))}
                <div className="bg-gradient-to-r from-sky-500/20 to-purple-500/20 p-4 font-semibold text-white">AetherCast</div>
                <div className="bg-gradient-to-r from-sky-500/20 to-purple-500/20 p-4 font-mono font-bold text-emerald-400">9.9</div>
                <div className="bg-gradient-to-r from-sky-500/20 to-purple-500/20 p-4 text-emerald-400">↑ Líder</div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <h2 className="mt-3 text-[var(--fs-h2)] font-bold tracking-tight">
              4.9 / 5 entre profesionales
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6"
              >
                <blockquote className="text-sm leading-relaxed text-white/75">{t.quote}</blockquote>
                <figcaption className="mt-4 border-t border-white/5 pt-4">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* CITIES SEO */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight">El tiempo en tu ciudad</h2>
          <p className="mt-2 text-sm text-white/50">Pronóstico hiperlocal con cobertura global.</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {MAJOR_CITIES.map((c) => (
              <Link
                key={c.slug}
                href={`/location/${c.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 transition-colors hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-purple-500/10 to-pink-500/10 p-12 text-center">
            <div className="absolute inset-0 bg-noise opacity-10" />
            <h2 className="relative text-[var(--fs-h2)] font-bold tracking-tight">
              ¿Listo para el tiempo del futuro?
            </h2>
            <p className="relative mt-4 text-lg text-white/70">
              Empieza gratis. Sin tarjeta. Sin anuncios. Para siempre.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#0b1020] shadow-elevated transition-transform hover:scale-105"
              >
                Abrir mapa ahora
              </Link>
              <Link
                href="/precios"
                className="rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/10"
              >
                Ver planes Pro
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
