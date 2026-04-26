import type { Metadata } from 'next';
import { Footer } from '@/components/layout';
import { CityCompareClient } from './client';
import { JsonLd, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Comparador de ciudades — AetherCast',
  description:
    'Compara el tiempo de hasta 4 ciudades a la vez. Temperatura, lluvia, viento, UV e índice de calidad: todo lado a lado, en tiempo real y sin anuncios.',
  alternates: { canonical: '/comparador' },
  openGraph: {
    title: 'Comparador de ciudades — AetherCast',
    description: 'Compara el tiempo de hasta 4 ciudades a la vez en AetherCast.',
    url: `${SITE_URL}/comparador`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comparador de ciudades — AetherCast',
    description: 'Compara el tiempo de hasta 4 ciudades a la vez en AetherCast.',
  },
};

export default function CompararPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'AetherCast Comparador',
          url: `${SITE_URL}/comparador`,
          applicationCategory: 'WeatherApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        }}
      />
      <main className="min-h-dvh bg-[#0b1020] pt-14 pb-24 text-white md:pb-12">
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6">
          <header className="mb-6">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Comparador de ciudades
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/65 sm:text-base">
              Compara hasta 4 ciudades en paralelo. Toca cualquier columna para fijar referencia,
              o busca nuevas ciudades para sustituirlas.
            </p>
          </header>
          <CityCompareClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
