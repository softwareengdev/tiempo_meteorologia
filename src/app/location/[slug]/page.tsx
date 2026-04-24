import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getForecast, searchLocations, getWeatherDescription } from '@/lib/weather';
import { WeatherIcon } from '@/components/icons';
import {
  MAJOR_CITIES,
  SITE_URL,
  SITE_NAME,
  JsonLd,
  weatherDataFeedJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  locationFaqs,
} from '@/lib/seo';

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return MAJOR_CITIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = MAJOR_CITIES.find((c) => c.slug === slug);
  const name = city?.name ?? decodeURIComponent(slug).replace(/-/g, ' ');
  const country = city?.country ? `, ${city.country}` : '';
  const title = `Tiempo en ${name}${country} — Pronóstico 7 días | ${SITE_NAME}`;
  const description = `El tiempo en ${name}${country} hoy y los próximos 7 días: temperatura, lluvia, viento, presión, humedad y radar en directo. Multi-modelo (ECMWF, ICON, GFS).`;
  const url = `${SITE_URL}/location/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: SITE_NAME, locale: 'es_ES' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;
  const city = MAJOR_CITIES.find((c) => c.slug === slug);
  const queryName = city?.name ?? decodeURIComponent(slug).replace(/-/g, ' ');

  const locations = await searchLocations(queryName);
  if (!locations.length && !city) {
    notFound();
  }

  const location = locations[0] ?? {
    name: city!.name,
    country: city!.country,
    latitude: city!.latitude,
    longitude: city!.longitude,
    admin1: undefined,
    elevation: undefined,
  };
  let forecast: Awaited<ReturnType<typeof getForecast>> | null = null;
  try {
    forecast = await getForecast({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  } catch {
    forecast = null;
  }

  const current = forecast?.current;
  const daily = forecast?.daily;
  const cityName = city?.name ?? location.name;
  const countryName = city?.country ?? location.country;

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Inicio', url: SITE_URL },
    { name: 'Ciudades', url: `${SITE_URL}/ciudades` },
    { name: cityName, url: `${SITE_URL}/location/${slug}` },
  ]);

  const placeLd = current ? {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: cityName,
    url: `${SITE_URL}/location/${slug}`,
    address: { '@type': 'PostalAddress', addressLocality: cityName, addressCountry: countryName },
    geo: { '@type': 'GeoCoordinates', latitude: location.latitude, longitude: location.longitude },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'currentTemperature', value: Math.round(current.temperature_2m), unitCode: 'CEL' },
      { '@type': 'PropertyValue', name: 'apparentTemperature', value: Math.round(current.apparent_temperature), unitCode: 'CEL' },
      { '@type': 'PropertyValue', name: 'relativeHumidity', value: current.relative_humidity_2m, unitCode: 'P1' },
      { '@type': 'PropertyValue', name: 'windSpeed', value: Math.round(current.wind_speed_10m), unitCode: 'KMH' },
      { '@type': 'PropertyValue', name: 'pressure', value: Math.round(current.pressure_msl), unitCode: 'HPA' },
      { '@type': 'PropertyValue', name: 'cloudCover', value: current.cloud_cover, unitCode: 'P1' },
    ],
  } : null;

  const dataFeedLd = daily ? weatherDataFeedJsonLd({
    cityName,
    url: `${SITE_URL}/location/${slug}`,
    latitude: location.latitude,
    longitude: location.longitude,
    daily: {
      time: daily.time,
      temperature_2m_max: daily.temperature_2m_max,
      temperature_2m_min: daily.temperature_2m_min,
      precipitation_sum: daily.precipitation_sum,
      wind_speed_10m_max: daily.wind_speed_10m_max,
    },
  }) : null;

  const faqLd = faqJsonLd(locationFaqs(cityName));

  return (
    <div className="min-h-dvh bg-gray-950 px-4 py-8">
      <JsonLd data={breadcrumbLd} />
      {placeLd && <JsonLd data={placeLd} />}
      {dataFeedLd && <JsonLd data={dataFeedLd} />}
      <JsonLd data={faqLd} />

      <div className="mx-auto max-w-4xl">
        <nav aria-label="Migas de pan" className="mb-4 text-xs text-white/50">
          <Link href="/" className="hover:text-sky-400">Inicio</Link>
          <span className="mx-2 text-white/20">/</span>
          <Link href="/ciudades" className="hover:text-sky-400">Ciudades</Link>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/70">{cityName}</span>
        </nav>

        <Link href="/" className="mb-6 inline-block text-sm text-sky-400 hover:underline">
          ← Volver al mapa
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Tiempo en {cityName}
            {countryName && <span className="text-white/50">, {countryName}</span>}
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {location.latitude.toFixed(4)}°N, {location.longitude.toFixed(4)}°{location.longitude >= 0 ? 'E' : 'O'}
            {location.elevation && ` · ${location.elevation}m de altitud`}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            Pronóstico meteorológico actualizado para {cityName}{countryName && `, ${countryName}`}: temperatura,
            precipitación, viento, presión y humedad para hoy y los próximos 7 días, con datos de los modelos ECMWF,
            ICON y GFS vía Open-Meteo.
          </p>
        </div>

        {current && (
          <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 to-blue-600/5 p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/50">Ahora en {cityName}</p>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-light text-white">
                    {Math.round(current.temperature_2m)}°
                  </span>
                  <span className="mb-2 text-xl text-white/40">C</span>
                </div>
                <p className="mt-1 text-white/70">{getWeatherDescription(current.weather_code)}</p>
                <p className="text-sm text-white/40">
                  Sensación: {Math.round(current.apparent_temperature)}°C
                </p>
              </div>
              <WeatherIcon code={current.weather_code} isDay={current.is_day === 1} size={96} animated={false} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Humedad" value={`${current.relative_humidity_2m}%`} />
              <Stat label="Viento" value={`${Math.round(current.wind_speed_10m)} km/h`} />
              <Stat label="Presión" value={`${Math.round(current.pressure_msl)} hPa`} />
              <Stat label="Nubes" value={`${current.cloud_cover}%`} />
            </div>
          </div>
        )}

        {daily && (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6" aria-labelledby="forecast-7d">
            <h2 id="forecast-7d" className="mb-4 text-lg font-semibold text-white">
              Pronóstico 7 días en {cityName}
            </h2>
            <div className="space-y-3">
              {daily.time.map((day, i) => {
                const date = new Date(day);
                return (
                  <div key={day} className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-white/5">
                    <span className="w-20 text-sm font-medium capitalize text-white/70">
                      {i === 0 ? 'Hoy' : date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                    </span>
                    <WeatherIcon code={daily.weather_code[i]} isDay={true} size={32} animated={false} />
                    <span className="flex-1 text-sm text-white/50">
                      {getWeatherDescription(daily.weather_code[i])}
                    </span>
                    {daily.precipitation_probability_max[i] > 0 && (
                      <span className="text-xs text-sky-400" aria-label={`Probabilidad de lluvia ${daily.precipitation_probability_max[i]}%`}>
                        💧 {daily.precipitation_probability_max[i]}%
                      </span>
                    )}
                    <div className="text-right">
                      <span className="text-lg font-medium text-white">{Math.round(daily.temperature_2m_max[i])}°</span>
                      <span className="ml-1 text-sm text-white/40">{Math.round(daily.temperature_2m_min[i])}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-10" aria-labelledby="other-cities">
          <h2 id="other-cities" className="mb-4 text-lg font-semibold text-white">Otras ciudades</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {MAJOR_CITIES.filter((c) => c.slug !== slug).slice(0, 12).map((c) => (
              <Link
                key={c.slug}
                href={`/location/${c.slug}`}
                className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-white/70 transition hover:border-sky-400/30 hover:bg-white/5 hover:text-white"
              >
                Tiempo en {c.name}
              </Link>
            ))}
          </div>
          <div className="mt-3 text-right">
            <Link href="/ciudades" className="text-xs text-sky-400 hover:underline">
              Ver las {MAJOR_CITIES.length}+ ciudades disponibles →
            </Link>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="faq-title">
          <h2 id="faq-title" className="mb-4 text-lg font-semibold text-white">
            Preguntas frecuentes sobre el tiempo en {cityName}
          </h2>
          <div className="space-y-3">
            {locationFaqs(cityName).map((f) => (
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
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
      <p className="text-xs text-white/40">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  );
}
