import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, MobileBottomNav, AuroraBackground } from '@/components/layout';
import { Footer } from '@/components/layout/footer';
import {
  CITIES_BY_COUNTRY,
  CITY_COUNTRIES,
  MAJOR_CITIES,
  SITE_URL,
  SITE_NAME,
  JsonLd,
  itemListJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from '@/lib/seo';

const TITLE = `Tiempo por ciudades — ${MAJOR_CITIES.length}+ destinos en directo`;
const DESCRIPTION = `Pronóstico meteorológico actualizado para ${MAJOR_CITIES.length}+ ciudades de España, Latinoamérica, Europa, Asia y América. Encuentra el tiempo de tu ciudad o destino de viaje en un clic.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/ciudades' },
  openGraph: {
    title: `${TITLE} · ${SITE_NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/ciudades`,
    type: 'website',
    siteName: SITE_NAME,
    locale: 'es_ES',
  },
  twitter: { card: 'summary_large_image', title: `${TITLE} · ${SITE_NAME}`, description: DESCRIPTION },
};

function slugifyCountry(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function CiudadesHubPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Inicio', url: SITE_URL },
    { name: 'Ciudades', url: `${SITE_URL}/ciudades` },
  ]);

  const itemList = itemListJsonLd({
    name: 'Tiempo por ciudades',
    items: MAJOR_CITIES.map((c) => ({
      name: `Tiempo en ${c.name}, ${c.country}`,
      url: `${SITE_URL}/location/${c.slug}`,
    })),
  });

  const faq = faqJsonLd([
    {
      question: '¿Cuántas ciudades cubre AetherCast?',
      answer: `Tenemos páginas dedicadas con pronóstico de 7 días para ${MAJOR_CITIES.length}+ ciudades de ${CITY_COUNTRIES.length} países, y cualquier punto del planeta puede consultarse desde el mapa interactivo o el buscador.`,
    },
    {
      question: '¿Cómo se actualiza el pronóstico de cada ciudad?',
      answer: 'Cada página de ciudad se regenera cada 5 minutos con datos de Open-Meteo (modelos ECMWF, ICON, GFS y JMA combinados) y radar global de RainViewer.',
    },
  ]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#0b1020] pb-16 text-white md:pb-0">
      <JsonLd data={breadcrumb} />
      <JsonLd data={itemList} />
      <JsonLd data={faq} />

      <Header />
      <AuroraBackground />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-24">
        <nav aria-label="Migas de pan" className="mb-4 text-xs text-white/50">
          <Link href="/" className="hover:text-sky-400">Inicio</Link>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">Ciudades</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-gradient-aurora font-display text-4xl font-bold sm:text-5xl">
            El tiempo en {MAJOR_CITIES.length}+ ciudades del mundo
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/70">
            Pronóstico meteorológico hiperlocal y multi-modelo para las principales ciudades de
            España, Latinoamérica, Europa, América del Norte, Asia, África y Oceanía. Toca cualquier
            ciudad para ver el tiempo de hoy y los próximos 7 días.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
            {CITY_COUNTRIES.map((country) => (
              <a
                key={country}
                href={`#${slugifyCountry(country)}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-white"
              >
                {country} · {CITIES_BY_COUNTRY[country].length}
              </a>
            ))}
          </div>
        </header>

        <div className="space-y-12">
          {CITY_COUNTRIES.map((country) => (
            <section
              key={country}
              id={slugifyCountry(country)}
              aria-labelledby={`country-${slugifyCountry(country)}`}
              className="scroll-mt-24"
            >
              <h2
                id={`country-${slugifyCountry(country)}`}
                className="mb-4 flex items-baseline gap-3 font-display text-2xl font-semibold text-white"
              >
                {country}
                <span className="text-sm font-normal text-white/40">
                  {CITIES_BY_COUNTRY[country].length} ciudades
                </span>
              </h2>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {CITIES_BY_COUNTRY[country]
                  .slice()
                  .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/location/${c.slug}`}
                        className="block rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-white/80 transition hover:border-sky-400/30 hover:bg-sky-400/5 hover:text-white"
                      >
                        <span className="block truncate font-medium">{c.name}</span>
                        {c.population && (
                          <span className="block text-[10px] text-white/40">
                            {Intl.NumberFormat('es-ES').format(c.population)} hab.
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
