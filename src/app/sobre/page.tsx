import type { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { JsonLd, faqJsonLd, HOME_FAQS, breadcrumbJsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Sobre AetherCast — Nuestra misión',
  description: 'AetherCast nace para democratizar la meteorología profesional. Open data, sin anuncios, hecho en España.',
  alternates: { canonical: '/sobre' },
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-[#0b1020] text-white">
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Inicio', url: SITE_URL },
        { name: 'Sobre AetherCast', url: `${SITE_URL}/sobre` },
      ])} />
      <JsonLd data={faqJsonLd(HOME_FAQS)} />

      <article className="mx-auto max-w-3xl px-6 py-20 prose prose-invert">
        <h1 className="text-[var(--fs-h1)] font-bold tracking-tight">Nuestra misión</h1>
        <p className="text-lg text-white/65">
          AetherCast nace en 2026 con una idea simple: la mejor meteorología debería ser
          libre, abierta y accesible para todo el mundo. Sin anuncios, sin paywalls, sin
          venta de datos.
        </p>
        <p className="text-white/65">
          Combinamos los mejores modelos numéricos del planeta (ECMWF, ICON, GFS, HRRR,
          GEM, JMA) con un blending inteligente que selecciona el modelo más preciso para
          cada región y momento. Encima, una capa de IA explicativa traduce datos complejos
          en información útil para tu día a día.
        </p>
        <h2 className="mt-12 text-2xl font-bold">Datos abiertos</h2>
        <p className="text-white/65">
          Usamos exclusivamente fuentes abiertas como Open-Meteo, NOAA y ECMWF Open Data.
          Esto garantiza transparencia, reproducibilidad y precisión verificable.
        </p>
        <h2 className="mt-12 text-2xl font-bold">Open source</h2>
        <p className="text-white/65">
          Todo el código está disponible en
          {' '}<a href="https://github.com/softwareengdev/tiempo_meteorologia" className="text-sky-400 hover:underline">GitHub</a>.
          Cualquiera puede auditarlo, contribuir o desplegar su propia instancia.
        </p>

        <h2 className="mt-12 text-2xl font-bold">Preguntas frecuentes</h2>
        <div className="not-prose mt-6 space-y-3">
          {HOME_FAQS.map((f) => (
            <details
              key={f.question}
              className="group rounded-xl border border-white/5 bg-white/[0.02] p-4 transition open:border-sky-400/30 open:bg-white/5"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-white/90 marker:hidden">
                <span className="mr-2 inline-block transition group-open:rotate-90">▸</span>
                {f.question}
              </summary>
              <p className="mt-3 pl-6 text-sm leading-relaxed text-white/65">{f.answer}</p>
            </details>
          ))}
        </div>
      </article>
      <Footer />
    </div>
  );
}
